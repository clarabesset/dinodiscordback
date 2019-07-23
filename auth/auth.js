const express = require("express");
const passport = require("passport");
const router = new express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/User");
const session = require("express-session");

router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  var errorMsg = null;

  if (!username || !email || !password)
    errorMsg = {
      message: "Provide username and password",
      status: "warning",
      httpStatus: 403 // 403	Forbidden
    };
  if (errorMsg) return res.status(errorMsg.httpStatus).json(errorMsg);

  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt);
  console.log(hashPass);
  const newUser = {
    username,
    email,
    password: hashPass
  };
  UserModel.create(newUser)
    .then(dbRes => {
      res.status(200).send({ message: "everything went alright" });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

router.post("/signin", (req, res, next) => {
  passport.authenticate("local", (err, user, failureDetails) => {
    var errorMsg = null;
    if (err) {
      console.log("signin error details", failureDetails);

      errorMsg = {
        message: "Something went wrong authenticating user",
        status: "error",
        httpStatus: 520
      };
    }

    if (!user)
      errorMsg = {
        message: "sorry, we coun't find that account",
        status: "warning",
        httpStatus: 404
      };

    if (errorMsg) return res.status(errorMsg.httpStatus).json(errorMsg);

    req.logIn(user, function(err) {
      if (err) {
        console.log("passport login error", err);
        return res.json({ message: "Something went wrong logging in" });
      }

      console.log("passport login ok", req.user);
      console.log("authenticated", req.isAuthenticated());
      const { _id: username, email, password } = req.user;
      // next(
      //   res.status(200).json({
      //     loginStatus: true,
      //     user: {
      //       username,
      //       email,
      //       password
      //     }
      //   })
      // );
      res.status(200).json({ user, loginStatus: true });
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  req.logout();
  res.json({ message: "Success" });
});

router.get("/loggedin", (req, res, next) => {
  if (req.isAuthenticated()) {
    // const user = {
    //     firstname: req.user.firstname,
    //     lastname: req.user.lastname,
    //     avatar = req.user.avatar
    // }
    res.status(200).json({ user: req.user, loginStatus: true });
    return;
  }
  res.status(403).json({ message: "Unauthorized" });
});

module.exports = router;

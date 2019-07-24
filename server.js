require("dotenv").config();
require("./config/dbconnection");
require("./config/passport");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const app = express();
const http = require("http");
const server = http.createServer(app);


app.use(
  cors({
    credentials: true,
    origin: [process.env.Front_End_Url, "http://10.150.98.211:3000/", ]
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

const auth = require("./auth/auth");
app.use(auth);

const userAPI = require("./api/User");
app.use("/api/User", userAPI.router);


require("./socket/listeners")(server);

server.listen(process.env.PORT, () => {
  console.log("App hosted on: ", process.env.SITE_URL);
});

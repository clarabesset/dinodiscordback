require("dotenv").config();
require("./config/dbconnection");
require("./config/passport");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const app = express();
const socketIO = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketIO(server);

app.use(
  cors({
    credentials: true,
    origin: process.env.Front_End_Url
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

// SOCKET
io.on("connection", socket => {
  console.log("user connected", Date.now());
  const users = [];
  socket.on("room", connected => {
    users.push({ name: "yolo" });
    console.log("room created", connected);
    console.log(users);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

let connectedPlayers = 0;
const players = [];

io.of("/room").on("connection", function(socket) {
  connectedPlayers += 1;

  console.log(connectedPlayers);
  socket.emit("aloha");

  socket.on("player-join", color => {
    if (players.length < 2) players.push({ color, nb: players.length + 1 });

    console.log("-----PLAYERS SETUp-----");
    console.log(players);

    socket.emit("confirm-player-join", players);
  });

  socket.on("message", data => {
    console.log(data);
    socket.broadcast.emit("message", data);
  });
  if (connectedPlayers < 4) {
    socket.broadcast.emit(
      "message",
      `There are ${4 - connectedPlayers} left to go !`
    );
    socket.emit("message", `There are ${4 - connectedPlayers} left to go !`);
  } else {
    io.of("room").emit("message", "the tournament will start soon");
    socket.emit("message", "the tournament will start soon");
  }
  socket.on("disconnect", () => (connectedPlayers -= 1));
  //setInterval(() => socket.emit("message", "hello"), 2000)
});
server.listen(process.env.PORT, () => {
  console.log("App hosted on: ", process.env.SITE_URL);
});

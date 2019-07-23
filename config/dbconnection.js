const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to Mongo! yo");
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

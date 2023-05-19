const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const Auth = require("./routes/Auth");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/Soberness/api", Auth);

mongoose
  .connect("mongodb://127.0.0.1:27017/Soberness")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.listen(3000, () => {
  console.log("listening on port 3000");
});

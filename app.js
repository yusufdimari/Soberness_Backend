const express = require("express");
const mongoose = require("mongoose");
const { config } = require("dotenv");
const cors = require("cors");

const Auth = require("./routes/Auth");
const Admin = require("./routes/Admin/Auth");
const Sessions = require("./routes/Sessions");
const Sober = require("./routes/Sober");
const Feed = require("./routes/Feed");

const app = express();
config();
app.use(cors());
app.use(express.json());
app.use("/Soberness/api", Auth);
app.use("/Soberness/api/admin/auth", Admin);
app.use("/Soberness/api/sessions", Sessions);
app.use("/Soberness/api/sober", Sober);
app.use("/Soberness/api/posts", Feed);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.listen(3000, () => {
  console.log("listening on port 3000");
});

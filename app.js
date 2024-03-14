const express = require("express");
const colors = require("colors");
const cors = require("cors");
const path = require("path");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/postRouter");
const userRouter = require("./routes/user");
const { connectDB } = require("./config/connectDB");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
connectDB(
  `mongodb+srv://sfsalman:${process.env.MONGODB_PASS}@cluster0.6otcg9k.mongodb.net/?retryWrites=true&w=majority`
);
// connectDB(`mongodb://127.0.0.1:27017/stmidea`);
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/user", userRouter);

// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

//Servin the frontend

app.use(express.static(path.join(__dirname, "./client/dist")));
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "./client/dist/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

app.listen(port, "127.0.0.1", () => {
  console.log(
    `server running on : http://127.0.0.1:${port}`.america.white.bold
  );
});

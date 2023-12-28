const express = require("express");
const cors = require("cors");
require('./helpers/database');
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
require("dotenv").config();
const port = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "welcome to the dashboard!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require("express");
const cors = require("cors");
const sequelize = require("./models/index");
const authRouter = require("./routes/auth");
require("dotenv").config();
const port = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "welcome to the dashboard!" });
});

sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

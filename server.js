const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const expressLayout = require("express-ejs-layouts");

//routers
const aboutRouter = require("./routes/about");
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");

dotenv.config();
//connecting to the database
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("images", express.static(__dirname + "public/images"));

app.use(expressLayout);
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

//navigation

app.get("", (req, res) => {
  res.render("index");
});

app.get("/home", (req, res) => {
  res.render("index");
});

//routes
app.use("/about", aboutRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);

app.listen("5000", () => {
  console.log("Backend is running!");
});

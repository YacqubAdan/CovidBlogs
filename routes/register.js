const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { redirect } = require("express/lib/response");
router.get("/", (req, res) => {
  res.render("register");
});

router.post("/", async (req, res) => {
  // console.log(req.body);
  const { username, email, password, password2 } = req.body;
  let errors = [];
  //Check to see if passwords match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }
  // Password length checker
  if (password.length < 6) {
    errors.push({ msg: "Passwords should be atleast 6 characters" });
  }
  if (errors.length > 0) {
    res.render("register", { errors });
    console.log("fail");
  } else {
    // validation passed
    const userFound = await User.findOne({ email: email });
    if (userFound) {
      errors.push({ msg: "User with that email already exists" });
      res.render("register", { errors });
    } else {
      try {
        // user doesn't exist
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
        });
        await newUser.save();
        res.redirect("/login");
      } catch (err) {
        console.log(err);
        res.render("register");
      }
    }
  }
});

module.exports = router;

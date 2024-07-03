import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../model/user";

const express = require("express");
const router = express.Router();
const passport = require("passport");
const querystring = require("querystring");
const saltRounds = 10;
const secret = "secret123";

require("dotenv").config();

/**
 * Routes Definitions
 */

router.post('/register', function(req, res) {
  const { email, username, password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, message: "Password is required" });
  }

  // Hash the password securely
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  // Example of saving user with hashed password
  let user = new User({
    email: email,
    username: username,
    password: hashedPassword // Save the hashed password to your database
  });

  user.save(function(err, user) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Your account could not be saved. Error: " + err.message,
      });
    }
    res.status(201).json({ success: true, message: "Your account has been saved" });
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  User.findOne({ username }).then((user) => {
    if (!user) {
      return res.status(403).json("Invalid username or password");
    }

    const passOk = bcrypt.compareSync(password, user.password);
    if (!passOk) {
      return res.status(403).json("Invalid username or password");
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      secret,
      { expiresIn: '1h' } // Token expiration time (optional)
    );

    // Set the token in cookie
    res.cookie("token", token, {
      httpOnly: true, // Cookie cannot be accessed via client-side JavaScript
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict" // Restrict cookie to same site requests
    }).status(200).send("Login successful"); // Optionally, you can send additional data here
  }).catch((err) => {
    console.error("Login error:", err);
    res.status(500).json("Internal server error");
  });
});


export default router;
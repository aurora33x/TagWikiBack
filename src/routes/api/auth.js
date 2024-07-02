import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../model/user";

const express = require("express");
const router = express.Router();
const passport = require("passport");
const querystring = require("querystring");

const secret = "secret123";

require("dotenv").config();

/**
 * Routes Definitions
 */

router.post("/register", function (req, res) {
  let user = new User({
    email: req.body.email,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
  });

  user.save(function (err, user) {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Your account could not be saved. Error: ",
        err,
      });
    } else {
      res.set("Access-Control-Allow-Origin", "*");
      res.json({ success: true, message: "Your account has been saved" });
    }
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }).then((user) => {
    if (user && user.username) {
      const passOk = bcrypt.compareSync(password, user.password);
      if (passOk) {
        jwt.sign(
          { id: user._id, username: user.username },
          secret,
          (err, token) => {
            res.status(200).cookie("token", token).send();
          }
        );
      } else {
        res.status(403).json("Invalid username or password");
      }
    } else {
      res.status(403).json("Invalid username or password");
    }
  });
});

export default router;

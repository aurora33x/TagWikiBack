import bcrypt from "bcrypt";
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



router.post("/user/userSecurity", (req, res) => {
  const { username, password, oldPassword } = req.body;
  User.findOne({ username }).then((user) => {
    if (user && user.username) {
      const passOk = bcrypt.compareSync(oldPassword, user.password);
      if (passOk) {
        console.log("1", user);
        user.password = bcrypt.hashSync(req.body.password, 10);
        console.log("2", user);
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
      } else {
        res.status(403).json("Invalid username or password");
      }
    } else {
      res.status(403).json("Invalid username or password");
    }
  });
});

router.post("/user/userProfile", (req, res) => {
  const { username, email, newusername } = req.body;
  User.findOne({ username }).then((user) => {
    console.log(username, email, newusername);
    if (user && user.username) {
      console.log("1", user);
      user.username = newusername;
      user.email = email;
      console.log("2", user);
    } else {
      res.status(403).json("Invalid username or password");
    }
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
});


export default router;

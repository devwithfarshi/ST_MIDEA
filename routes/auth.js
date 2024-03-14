const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middlewares/requireLogin");
const router = express.Router();
router
  .post("/signup", (req, res) => {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(422).json({ error: "Please add all the fields" });
    }

    try {
      User.findOne({ $or: [{ email }, { username }] }).then((savedUser) => {
        if (savedUser) {
          return res
            .status(422)
            .json({ error: `User already exist with ${email} or ${username}` });
        }
        bcrypt.hash(password, 10).then((hashedPassword) => {
          const user = new User({
            name,
            email,
            username,
            password: hashedPassword,
          });
          user
            .save()
            .then((user) => {
              res.json({ message: "Registered successfull" });
            })
            .catch((err) => {
              console.log(`User Create Error --> ${err}`);
            });
        });
      });
    } catch (error) {
      console.log(`Try catch error on create user --> ${error}`);
    }
  })
  .post("/signin", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ error: "Please add email and password" });
    }

    User.findOne({ email }).then((result) => {
      try {
        bcrypt
          .compare(password, result.password)
          .then((match) => {
            const { _id, name, email, username, image } = result;
            if (match) {
              const token = jwt.sign(
                { _id: result._id },
                process.env.jwt_secret
              );
              res.json({
                _id,
                name,
                email,
                username,
                image,
                token,
              });

              // return res.json({ message: "Login Succesfull" });
            } else {
              return res
                .status(422)
                .json({ error: "Invalid email or password" });
            }
          })
          .catch((error) => {
            return res.status(422).json({ error: "Invalid email or password" });
          });
      } catch (error) {
        return res.status(422).json({ error: "Invalid email or password" });
        return res.status(422).json({ error: "Invalid email or password" });
      }
    });
  });

router.get("/createPost", requireLogin, (req, res) => {
  console.log("hello auth");
});

module.exports = router;

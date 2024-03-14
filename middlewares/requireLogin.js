const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/userModel");
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You must have looged in 1" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.jwt_secret, (err, paylaod) => {
    if (err) {
      return res.status(401).json({ error: "You must have looged in 2" });
    }
    const { _id } = paylaod;
    User.findOne({ _id }).then((result) => {
      req.user = result;

      next();
    });
  });
};

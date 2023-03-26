const express = require("express");
const router = express.Router();
const requireLogin = require("../middlewares/requireLogin");
const Post = require("../models/postModel");
const User = require("../models/userModel");

router.get("/profile/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .populate("followers", "_id name image")
    .populate("following", "_id name image")
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: user._id })
        .populate("postedBy", "_id name image")
        .populate("comments.postedBy", "_id name image")

        .then((post) => {
          res.status(200).json({ user, post });
        })
        .catch((err) => {
          res.json({ err });
        });
    })
    .catch((err) => {
      res.status(400).json({ error: "User Not Found" });
    });
});

router.put(`/follow`, requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
  )
    .then((result) => {
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true },
      )
        .populate("followers", "_id name image")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.json({ error: err });
        });
    })
    .catch((error) => res.json({ error }));
});

router.put(`/unfollow`, requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
  )
    .then(() => {
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.followId },
        },
        { new: true },
      )
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.json({ error: err });
        });
    })
    .catch((error) => res.json({ error }));
});

router.get("/search/:key", requireLogin, (req, res) => {
  const key = req.params.key;
  if (key) {
    User.find({
      $or: [{ name: { $regex: key } }, { username: { $regex: key } }],
    })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => res.json({ err }));
  }
});

router.put("/uploadprofilepic", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { image: req.body.photo },
    },
    { new: true },
  )
    .then((result) => {
      res.json(result);
    })
    .catch((err) => res.json({ err }));
});

module.exports = router;

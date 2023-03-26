const express = require("express");
const requireLogin = require("../middlewares/requireLogin");
const Post = require("../models/postModel");
const router = express.Router();

router.post("/createPost", requireLogin, (req, res) => {
  const { title, photo } = req.body;
  if (!title && !photo) {
    return res.status(422).json({ error: "Write a caption or select a photo" });
  }
  const post = new Post({
    title,
    photo,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      return res.json({ post: result.postedBy });
    })
    .catch((err) => console.log(`Post save error -> ${err}`));
});

router.get("/allposts", requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name image")
    .populate("comments.postedBy", "_id name image")
    .sort("-createdAt")
    .then((result) => {
      res.json(
        result.filter(
          (i) => i.postedBy._id.toString() !== req.user._id.toString(),
        ),
      );
    });
});

router.get("/myposts", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name image")
    .populate("comments.postedBy", "_id name image")
    .sort("-createdAt")
    .then((result) => {
      res.json(result);
    });
});

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    { new: true },
  )
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.json({ error });
    });
});
router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.json({ error });
    });
});

router.get("/fetchlikespeople/:postId", requireLogin, (req, res) => {
  Post.findById(req.params.postId)
    .populate("likes", "_id name image")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.json({ error });
    });
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    comment: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    { new: true },
  )
    .populate("comments.postedBy", "_id name image")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.json({ error });
    });
});

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .then((result) => {
      if (result.postedBy._id.toString() === req.user._id.toString()) {
        Post.deleteOne({ _id: result._id })
          .then((done) => {
            res.json({ message: "Successfully deleted" });
          })
          .catch((err) => {
            res.json({ err });
          });
      } else {
        res.status(422).json({ error: "You can's delete this post" });
      }
    })
    .catch((error) => {
      res.json({ error });
    });
});

router.get("/myfollowingpost", requireLogin, (req, res) => {
  Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name image")
    .populate("comments.postedBy", "_id name image")
    .then((result) => {
      res.json(result);
    })
    .catch((err) => res.json({ err }));
});

module.exports = router;

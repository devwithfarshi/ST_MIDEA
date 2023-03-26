const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new Schema(
  {
    title: {
      type: String,
    },
    photo: {
      type: String,
    },
    postedBy: {
      type: ObjectId,
      ref: "user",
    },
    likes: [{ type: ObjectId, ref: "user" }],
    comments: [
      {
        comment: { type: String },
        postedBy: { type: ObjectId, ref: "user" },
      },
    ],
  },
  { timestamps: true },
);

const Post = model("post", postSchema);
module.exports = Post;

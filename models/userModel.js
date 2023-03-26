const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://t4.ftcdn.net/jpg/02/17/34/67/360_F_217346782_7XpCTt8bLNJqvVAaDZJwvZjm0epQmj6j.webp",
    },

    followers: [
      {
        type: ObjectId,
        ref: "user",
      },
    ],
    following: [{ type: ObjectId, ref: "user" }],
  },
  { timestamps: true },
);

const User = model("user", userSchema);
module.exports = User;

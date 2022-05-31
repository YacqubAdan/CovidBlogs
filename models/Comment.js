const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },

  blog: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],

  username: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Comment", commentSchema);

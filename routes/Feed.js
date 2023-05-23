const express = require("express");
const { Post } = require("../models");
const router = express.Router();

// Create a new post
router.post("/", async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    // Create the post
    const post = new Post({ userId, title, content });
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to create post", error });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();

    res.status(200).json({ status: "OK", message: posts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error });
  }
});

// Get a single post by ID
router.get("/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.find({ _id: postId });

    if (!post) {
      return res.status(404).json({ status: "ERR", message: "Post not found" });
    }

    res.status(200).json({ status: "OK", message: post });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch post", error });
  }
});

// Update post likes or dislikes
router.patch("/:postId/likes", async (req, res) => {
  try {
    const postId = req.params.postId;
    const action = req.body.action; // 'like' or 'dislike'

    let updateField;
    if (action === "like") {
      updateField = { $inc: { likes: 1 } };
    } else if (action === "dislike") {
      updateField = { $inc: { dislikes: 1 } };
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      { _id: postId },
      updateField,
      {
        new: true,
      }
    );

    res.status(200).json({ status: "OK", message: updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Failed to like post", error });
  }
});

// Create a new comment
router.post("/:postId/comments", async (req, res) => {
  try {
    const postId = req.params.postId;
    const { content, userId } = req.body;

    // Create the comment
    const comment = new Comment({ content, postId, userId });
    await comment.save();

    res.status(201).json({ status: "OK", message: comment });
  } catch (error) {
    res.status(500).json({ message: "Failed to create comment", error });
  }
});

// Get all comments for a post
router.get("/:postId/comments", async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.find({ _id: postId });

    res.status(200).json({ status: "OK", message: comments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments", error });
  }
});

module.exports = router;

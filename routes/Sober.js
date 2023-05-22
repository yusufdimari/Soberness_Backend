const express = require("express");
const { User } = require("../models");
const router = express.Router();

router.post("/users/:userId/reset-soberdays", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Set soberDays to 0
    user.soberDays = 0;

    // Set notSober to the current date
    user.notSober = new Date();

    // Save the changes
    await user.save();

    res.status(200).json({ message: "Sober days reset successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to reset sober days", error });
  }
});

module.exports = router;

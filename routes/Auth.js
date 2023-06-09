const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/index");

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dimarijnr@gmail.com",
    pass: "19601970baBA",
  },
});

router.post("/signup", async (req, res) => {
  try {
    const { name, schoolId, email, username, password, drug } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ schoolId });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      schoolId,
      email,
      username,
      password: hashedPassword,
      drug,
    });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { schoolId, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ schoolId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate and send a JWT token
    const token = jwt.sign({ userId: user._id }, "dev_deems");
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a random temporary password
    const temporaryPassword = Math.random().toString(36).slice(-8);

    // Update the user's password with the temporary password
    user.password = await bcrypt.hash(temporaryPassword, 10);
    await user.save();

    // Send a password reset email
    await transporter.sendMail({
      from: "dimarijnr@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Your new password: ${temporaryPassword}`,
    });

    res.status(200).json({
      message: "Password reset email sent",
      password: temporaryPassword,
    });
  } catch (error) {
    res.status(500).json({ message: "Password reset failed" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "OK",
      message: users,
    });
  } catch (error) {
    res.status(500).json({ status: "ERR", message: "Internal server Error" });
  }
});

module.exports = router;

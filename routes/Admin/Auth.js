const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const Therapist = require("../../models/admin");

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
    const {
      name,
      email,
      phone,
      specialties,
      languages,
      qualificationsCore,
      qualificationsAdditional,
      memberships,
      clientAgeGroups,
      password,
    } = req.body;

    // Check if the therapist already exists
    const existingTherapist = await Therapist.findOne({ email });
    if (existingTherapist) {
      return res.status(400).json({ message: "Therapist already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new therapist
    const newTherapist = new Therapist({
      name,
      email,
      phone,
      specialties,
      languages,
      qualificationsCore,
      qualificationsAdditional,
      memberships,
      clientAgeGroups,
      password: hashedPassword,
    });
    await newTherapist.save();

    res
      .status(201)
      .json({ status: "OK", message: "Therapist created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the therapist by email
    const therapist = await Therapist.findOne({ email });
    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, therapist.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate and send a JWT token
    const token = jwt.sign({ therapistId: therapist._id }, "dev_deems");
    res.status(200).json({ token, therapist });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the therapist exists
    const therapist = await Therapist.findOne({ email });
    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }

    // Generate a random temporary password
    const temporaryPassword = Math.random().toString(36).slice(-8);

    // Update the therapist's password with the temporary password
    therapist.password = await bcrypt.hash(temporaryPassword, 10);
    await therapist.save();

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

router.get("/therapists", async (req, res) => {
  try {
    const therapists = await Therapist.find();
    if (!therapists)
      return res
        .status(404)
        .json({ status: "ERR", message: "No Therapists found" });
    return res.status(200).send({ status: "OK", message: therapists });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "ERR", message: "Internal Server Error" });
  }
});

router.get("/therapist/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const therapist = await Therapist.find({ _id: id });
    if (!therapist)
      return res
        .status(404)
        .json({ status: "ERR", message: "No Therapists found" });
    return res.status(200).send({ status: "OK", message: therapist });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "ERR", message: "Internal Server Error" });
  }
});
module.exports = router;

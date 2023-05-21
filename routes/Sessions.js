const express = require("express");
const Therapist = require("../models/admin");
const router = express.Router();
const { Appointment, User } = require("../models/index");

router.post("/book-appointment", async (req, res) => {
  try {
    const { therapistId, dateTime, details, userId, duration } = req.body;

    const therapist = await Therapist.find({ _id: therapistId });
    const user = await User.find({ _id: userId });
    // Create a new appointment
    if (user.length < 1) return res.status(404).json("user not found");
    if (therapist.length < 1)
      return res.status(404).json("Therapist not found");
    const appointment = new Appointment({
      therapistId,
      userId,
      dateTime,
      details,
      duration,
    });
    await appointment.save();

    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Appointment booking failed", err: error });
  }
});

// Get All Sessions API
router.get("/", async (req, res) => {
  try {
    // Get all sessions for the therapist
    const sessions = await Appointment.find()
      .populate("userId")
      .populate("therapistId");

    if (sessions.length < 1)
      return res
        .status(404)
        .json({ status: "ERR", message: "no sessions found" });

    res.status(200).json({ sessions });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve sessions" });
  }
});

// Get User Sessions API
router.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.find({ _id: id });
    if (user.length < 1)
      return res
        .status(404)
        .json({ status: "ERR", message: "Not a therapist" });
    // Get all sessions for the user
    const sessions = await Appointment.find({
      userId: id,
    }).populate("userId");

    res.status(200).json({ sessions });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve user sessions" });
  }
});

// Get Therapist Sessions API
router.get("/therapist/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const therapist = await Therapist.find({ _id: id });
    if (therapist.length < 1)
      return res
        .status(404)
        .json({ status: "ERR", message: "Not a therapist" });
    // Get all sessions for the user
    const sessions = await Appointment.find({
      therapistId: id,
    }).populate("therapistId");

    res.status(200).json({ sessions });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve Therapist sessions" });
  }
});

//Accept or Deny Session request by Therapist
router.post("/session/accept-deny/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status, therapistId } = req.body;
    // Find the session by ID
    const session = await Appointment.findOne({
      _id: sessionId,
      therapistId: therapistId,
    });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Update the session status
    session.status = status;
    await session.save();

    res
      .status(200)
      .json({ message: "Session status updated successfully", session });
  } catch (error) {
    res.status(500).json({ message: "Failed to update session status", error });
  }
});

module.exports = router;

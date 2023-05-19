const express = require("express");
const router = express.Router();
const { Appointment } = require("../models/index");

router.post("/book-appointment", async (req, res) => {
  try {
    const { therapistId, dateTime, details, userId } = req.body;

    // Create a new appointment
    const appointment = new Appointment({
      therapistId,
      userId,
      dateTime,
      details,
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
router.get("/:id", async (req, res) => {
  try {
    // Get all sessions for the user
    const sessions = await Appointment.populate()
      .find({
        userId: req.params.id,
      })
      .populate();

    res.status(200).json({ sessions });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve user sessions" });
  }
});

module.exports = router;

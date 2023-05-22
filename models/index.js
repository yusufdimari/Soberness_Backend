const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  schoolId: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
  drug: {
    type: String,
    enum: [
      "alcohol",
      "heroin",
      "marijuana",
      "amphetamines",
      "prescription painkillers",
      "caffeine",
    ],
    required: true,
  },
  soberDays: {
    type: Number,
    default: 0,
  },
  notSober: {
    type: Date,
    default: new Date(),
  },
});

const appointmentSchema = new mongoose.Schema({
  therapistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Therapist",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  details: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  duration: {
    type: Number,
    required: true,
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

const User = mongoose.model("User", userSchema);

module.exports = { User, Appointment };

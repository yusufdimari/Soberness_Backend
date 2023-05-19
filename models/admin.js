const mongoose = require("mongoose");

const therapistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  specialties: {
    type: [
      {
        type: String,
        enum: [
          "Cognitive Behavioral Therapy",
          "Substance use disorder",
          "Anxiety",
          "Depression",
          "Mindfulness",
        ],
      },
    ],
    required: true,
  },
  languages: {
    type: [
      {
        type: String,
        enum: ["English", "Spanish", "Arabic", "French"],
      },
    ],
    required: true,
  },
  qualificationsCore: {
    type: [
      {
        type: String,
        enum: [
          "Addiction Counseling Techniques",
          "Substance Abuse Assessment and Treatment",
          "Cognitive-Behavioral Therapy for Addiction",
          "Motivational Interviewing",
          "Family Therapy in Addiction Treatment",
        ],
      },
    ],
  },
  qualificationsAdditional: {
    type: [
      {
        type: String,
        enum: [
          "Trauma-Informed Care for Substance Abuse",
          "Pharmacology of Addiction",
          "Mindfulness-Based Relapse Prevention",
          "Adolescent Substance Abuse Treatment",
          "Group Therapy Skills for Addiction Counselors",
        ],
      },
    ],
  },
  memberships: {
    type: [
      {
        type: String,
        enum: [
          "National Association for Addiction Professionals (NAADAC)",
          "American Counseling Association (ACA)",
          "Association for Addiction Professionals (AAP)",
          "National Association of Alcoholism and Drug Abuse Counselors (NAADAC)",
          "International Certification & Reciprocity Consortium (IC&RC)",
        ],
      },
    ],
  },
  clientAgeGroups: {
    type: [
      {
        type: String,
        enum: ["Children", "Adults", "Family", "Teenagers"],
      },
    ],
  },
  password: {
    type: String,
    required: true,
  },
});

const Therapist = mongoose.model("Therapist", therapistSchema);

module.exports = Therapist;

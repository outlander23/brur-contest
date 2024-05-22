const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  tshirtSize: {
    type: String,
    required: true,
  },
});

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    unique: true,
  },
  members: [memberSchema],
  bkashTransactionId: {
    type: String,
    required: true,
    unique: true,
  },
  isPaymentConfirm: {
    type: Boolean,
    default: false,
  },
});

// Virtual field to check if a team is senior
teamSchema.virtual("isSenior").get(function () {
  return this.members.some((member) => {
    const batchNumber = parseInt(member.batch, 10);
    return batchNumber >= 10 && batchNumber <= 14;
  });
});

// Ensure that the same person cannot be part of multiple teams by email
teamSchema.index(
  {
    "members.email": 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      "members.email": {
        $exists: true,
      },
    },
  }
);

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;

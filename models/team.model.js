const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    unique: true,
  },
  members: [
    {
      name: {
        type: String,
        required: true,
      },
      institution: {
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
      idcardNumber: {
        type: String,
        required: true,
        unique: true,
      },
    },
  ],
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

// Ensure that the same person cannot be part of multiple teams
teamSchema.index(
  {
    "members.idcardNumber": 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      "members.idcardNumber": {
        $exists: true,
      },
    },
  }
);

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;

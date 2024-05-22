const mongoose = require("mongoose");

const quizParticipantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  isPaymentConfirmed: {
    type: Boolean,
    default: false,
  },
});

const QuizParticipant = mongoose.model(
  "QuizParticipant",
  quizParticipantSchema
);

module.exports = QuizParticipant;

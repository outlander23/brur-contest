const QuizParticipant = require("../models/quize.model");

exports.createQuizParticipant = async (req, res) => {
  const { name, phone, transactionId } = req.body;

  // Check if transaction ID is already used
  const existingParticipant = await QuizParticipant.findOne({ transactionId });
  if (existingParticipant) {
    return res.status(400).send("Transaction ID is already used.");
  }

  const participant = new QuizParticipant({
    name,
    phone,
    transactionId,
  });

  try {
    await participant.save();
    res.status(201).send(participant);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getQuizParticipants = async (req, res) => {
  try {
    const participants = await QuizParticipant.find({});
    res.send(participants);
  } catch (err) {
    res.status(500).send(err);
  }
};

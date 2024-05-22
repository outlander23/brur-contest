const QuizParticipant = require("../models/quize.model");
const Joi = require("joi");

// Validation function for quiz participant
const validateQuizParticipant = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    transactionId: Joi.string().required(),
  });

  return schema.validate(data);
};

exports.createQuizParticipant = async (req, res) => {
  // Extract data from request body
  const { name, phone, transactionId } = req.body;

  // Validate the extracted data
  const { error } = validateQuizParticipant({ name, phone, transactionId });
  if (error) {
    const errorDetails = error.details.map((detail) => ({
      message: detail.message,
      path: detail.path,
    }));
    return res.status(400).send({ errors: errorDetails });
  }

  try {
    // Check if transaction ID is already used
    const existingParticipant = await QuizParticipant.findOne({
      transactionId,
    });
    if (existingParticipant) {
      return res.status(400).send({
        errors: [
          {
            message: "Transaction ID is already used.",
            path: ["transactionId"],
          },
        ],
      });
    }

    // Create new quiz participant
    const participant = new QuizParticipant({
      name,
      phone,
      transactionId,
    });

    // Save to the database
    await participant.save();
    res.status(201).send(participant);
  } catch (err) {
    res.status(500).send({ errors: [{ message: err.message, path: [] }] });
  }
};

exports.getQuizParticipants = async (req, res) => {
  try {
    const participants = await QuizParticipant.find({});
    res.send(participants);
  } catch (err) {
    res.status(500).send({ errors: [{ message: err.message, path: [] }] });
  }
};

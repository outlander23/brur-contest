const Payment = require("../models/payment.model");
const Team = require("../models/team.model");
const { validatePayment } = require("../utils/validation");

exports.createPayment = async (req, res) => {
  const { error } = validatePayment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const payment = new Payment(req.body);
  await payment.save();

  const team = await Team.findById(payment.team);
  team.bkashTransactionId = payment.transactionId;
  await team.save();

  res.status(201).send(payment);
};

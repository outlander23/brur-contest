const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  paymentMethod: {
    type: String,
    enum: ["bkash", "nogod", "roket"],
    required: true,
  },
  amount: { type: Number, required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
});

module.exports = mongoose.model("Payment", paymentSchema);

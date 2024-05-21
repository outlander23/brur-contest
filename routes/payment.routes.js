const express = require("express");
const paymentController = require("../controllers/payment.controller");

const router = express.Router();

router.post("/payments", paymentController.createPayment);

module.exports = router;

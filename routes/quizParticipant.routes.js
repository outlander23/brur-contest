const express = require("express");
const router = express.Router();
const quizParticipantController = require("../controllers/quizParticipant.controller.js");

router.post("/quiz", quizParticipantController.createQuizParticipant);
router.get("/quiz", quizParticipantController.getQuizParticipants);

module.exports = router;

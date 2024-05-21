const express = require("express");
const teamController = require("../controllers/team.controller");

const router = express.Router();

router
  .post("/teams", teamController.createTeam)
  .get("/teams", teamController.getTeam);

module.exports = router;

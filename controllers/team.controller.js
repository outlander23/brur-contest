const Team = require("../models/team.model.js");
const { validateTeam } = require("../utils/validation.js");

exports.createTeam = async (req, res) => {
  const { error } = validateTeam(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if team name is already taken
  const existingTeam = await Team.findOne({ teamName: req.body.teamName });
  if (existingTeam) {
    return res.status(400).send("Team name is already taken.");
  }

  // Check if any member's idcardNumber is already in use in another team
  const existingMember = await Team.findOne({
    "members.idcardNumber": req.body.members.map(
      (member) => member.idcardNumber
    ),
  });
  if (existingMember) {
    return res
      .status(400)
      .send("One or more members are already part of another team.");
  }

  const team = new Team({
    teamName: req.body.teamName,
    members: req.body.members,
    bkashTransactionId: req.body.bkashTransactionId,
  });

  try {
    await team.save();
    res.status(201).send(team);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getTeam = async (req, res) => {
  try {
    const teams = await Team.find({});

    // Transform the teams to remove sensitive data
    const modifiedTeams = teams.map((team) => {
      const leader = { ...team.leader }; // Assuming leader is a separate object

      const members = team.members.map((member) => {
        const { email, contactNumber, ...memberRest } = member.toObject();
        return { ...memberRest };
      });

      return {
        ...team.toObject(),
        leader,
        members,
      };
    });

    res.send(modifiedTeams);
  } catch (err) {
    res.status(500).send(err);
  }
};

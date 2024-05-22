const Team = require("../models/team.model.js");
const { validateTeam } = require("../utils/validation.js");

exports.createTeam = async (req, res) => {
  // Extract the specific data from req.body
  const { teamName, members, bkashTransactionId } = req.body;

  // Validate the extracted data
  const { error } = validateTeam({ teamName, members, bkashTransactionId });
  if (error) {
    const errorDetails = error.details.map((detail) => ({
      message: detail.message,
      path: detail.path,
    }));
    return res.status(400).send({ errors: errorDetails });
  }

  try {
    // Check if team name is already taken
    const existingTeam = await Team.findOne({ teamName });
    if (existingTeam) {
      return res.status(400).send({
        errors: [
          { message: "Team name is already taken.", path: ["teamName"] },
        ],
      });
    }

    // Check if any member's email is already in use in another team
    const existingMember = await Team.findOne({
      "members.email": { $in: members.map((member) => member.email) },
    });
    if (existingMember) {
      return res.status(400).send({
        errors: [
          {
            message: "One or more members are already part of another team.",
            path: ["members"],
          },
        ],
      });
    }

    // Check if bkashTransactionId is already used
    const existingTransaction = await Team.findOne({ bkashTransactionId });
    if (existingTransaction) {
      return res.status(400).send({
        errors: [
          {
            message: "bkashTransactionId is already used.",
            path: ["bkashTransactionId"],
          },
        ],
      });
    }

    // Create a new team
    const team = new Team({
      teamName,
      members,
      bkashTransactionId,
    });

    // Save the team to the database
    await team.save();
    res.status(201).send(team);
  } catch (err) {
    res.status(500).send({ errors: [{ message: err.message, path: [] }] });
  }
};

exports.getTeam = async (req, res) => {
  try {
    const teams = await Team.find({});

    // Transform the teams to include the virtual field and remove sensitive data
    const modifiedTeams = teams.map((team) => {
      const members = team.members.map((member) => {
        const { email, contactNumber, ...memberRest } = member.toObject();
        return { ...memberRest };
      });

      return {
        ...team.toObject(),
        members,
        isSenior: team.isSenior, // Include the virtual field
      };
    });

    res.send(modifiedTeams);
  } catch (err) {
    res.status(500).send({ errors: [{ message: err.message, path: [] }] });
  }
};

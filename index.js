const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const teamRoutes = require("./routes/team.routes");
const paymentRoutes = require("./routes/payment.routes");
const quizParticipantRoutes = require("./routes/quizParticipant.routes");

require("dotenv").config(); // Load environment variables from .env file

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());

// Connect to MongoDB
const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const dbName = "BRUR"; // Replace with your database name

console.log(username, password);
mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.05n21.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use("/api", teamRoutes);
app.use("/api", paymentRoutes);
app.use("/api", quizParticipantRoutes);

app.use("/", (req, res) => {
  res.send("hi world");
});

const port = process.env.PORT || 8000;

// Create HTTP server
http.createServer(app).listen(port, () => {
  console.log(`Server running on port ${port}`);
});

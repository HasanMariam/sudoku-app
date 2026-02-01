const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connecting to the database (we will use an environment variable later for Kubernetes)
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/sudoku_db';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Defining the data format (Schema) for storing game records
const gameRecordSchema = new mongoose.Schema({
    playerName: String,
    timeInSeconds: Number,
    difficulty: String,
    createdAt: { type: Date, default: Date.now }
});

const GameRecord = mongoose.model('GameRecord', gameRecordSchema);

// Endpoints
app.get('/', (req, res) => res.send('Sudoku API is running...'));

// Save the result of a new game
app.post('/api/results', async (req, res) => {
    try {
        const { playerName, timeInSeconds, difficulty } = req.body;
        const newRecord = new GameRecord({ playerName, timeInSeconds, difficulty });
        await newRecord.save();
        res.status(201).send(newRecord);
    } catch (error) {
        res.status(500).send({ message: "Error saving record" });
    }
});

// Bringing the top 10 results (Leaderboard)
app.get('/api/leaderboard', async (req, res) => {
    try {
        const records = await GameRecord.find().sort({ timeInSeconds: 1 }).limit(10);
        res.send(records);
    } catch (error) {
        res.status(500).send({ message: "Error fetching leaderboard" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
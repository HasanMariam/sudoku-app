const express = require('express');
const redis = require('redis');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Redis Client Configuration
const client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.error('Redis Client Error:', err));

async function initRedis() {
    try {
        await client.connect();
        console.log('Successfully connected to Redis Alpine! 🚀');
    } catch (err) {
        console.error('Could not connect to Redis:', err);
    }
}
initRedis();

// --- API Routes ---

// 1. Health Check
app.get('/', (req, res) => {
    res.send('Sudoku Backend is running...');
});

// 2. Save Game State
app.post('/api/save', async (req, res) => {
    try {
        const { userId, board } = req.body;
        await client.set(`user:${userId}:board`, JSON.stringify(board));
        res.status(200).json({ message: 'Game saved successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save game' });
    }
});

// 3. Load Game State
app.get('/api/load/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const data = await client.get(`user:${userId}:board`);
        if (data) {
            res.status(200).json(JSON.parse(data));
        } else {
            res.status(404).json({ message: 'No saved game found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to load game' });
    }
});

// 4. Save Result to Leaderboard
app.post('/api/results', async (req, res) => {
    try {
        const { playerName, timeInSeconds } = req.body;
        // Store in Redis Sorted Set
        await client.zAdd('leaderboard', {
            score: parseInt(timeInSeconds),
            value: `${playerName}:${Date.now()}`
        });
        res.status(200).json({ message: 'Score saved!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save score' });
    }
});

// 5. Get Top 10 (THE CORRECT ONE)
app.get('/api/leaderboard', async (req, res) => {
    try {
        const results = await client.zRangeWithScores('leaderboard', 0, 9);
        const formattedResults = results.map(item => ({
            playerName: item.value.split(':')[1] ? item.value.split(':')[0] : item.value,
            timeInSeconds: item.score
        }));
        res.status(200).json(formattedResults);
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ error: 'Failed' });
    }
});

// Start server - Always at the end
app.listen(PORT, () => {
    console.log(`Server is breathing on port ${PORT}`);
});
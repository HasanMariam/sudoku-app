const express = require('express');
const redis = require('redis');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Redis Client Configuration
// The REDIS_URL comes from our docker-compose environment variable
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

// API Routes

// 1. Health Check
app.get('/', (req, res) => {
    res.send('Sudoku Backend (Redis Edition) is running...');
});

// 2. Save Game State
app.post('/api/save', async (req, res) => {
    try {
        const { userId, board } = req.body;
        // Store the board as a JSON string with a key unique to the user
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

app.listen(PORT, () => {
    console.log(`Server is breathing on port ${PORT}`);
});
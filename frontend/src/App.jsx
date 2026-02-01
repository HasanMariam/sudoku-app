import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

// Using your local IP for network access
const API_BASE_URL = "http://192.168.2.123:5000/api";

function App() {
  const [grid, setGrid] = useState(Array(9).fill(null).map(() => Array(9).fill({ value: 0, isOriginal: false })));
  const [playerName, setPlayerName] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchLeaderboardData();
    // Update the browser tab title
    document.title = "Sudoku with Hasan.M";
  }, []);

  useEffect(() => {
    if (isGameStarted) {
      timerRef.current = setInterval(() => setSeconds(prev => prev + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isGameStarted]);

  const fetchLeaderboardData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/leaderboard`);
      setLeaderboard(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const isSafe = (board, row, col, num) => {
    if (num === 0) return true;
    for (let i = 0; i < 9; i++) {
      if ((board[row][i].value === num && i !== col) || (board[i][col].value === num && i !== row)) return false;
    }
    let sR = row - (row % 3), sC = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + sR][j + sC].value === num && (i + sR !== row || j + sC !== col)) return false;
      }
    }
    return true;
  };

  const isBoardComplete = () => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c].value === 0 || !isSafe(grid, r, c, grid[r][c].value)) return false;
      }
    }
    return true;
  };

  const startNewGame = () => {
    if (!playerName.trim()) return;
    
    const baseGrid = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9], [4, 5, 6, 7, 8, 9, 1, 2, 3], [7, 8, 9, 1, 2, 3, 4, 5, 6],
      [2, 3, 1, 5, 6, 4, 8, 9, 7], [5, 6, 4, 8, 9, 7, 2, 3, 1], [8, 9, 7, 2, 3, 1, 5, 6, 4],
      [3, 1, 2, 6, 4, 5, 9, 7, 8], [6, 4, 5, 9, 7, 8, 3, 1, 2], [9, 7, 8, 3, 1, 2, 6, 4, 5]
    ];

    const shuffle = (g) => {
      let shuffled = [...g.map(row => [...row])];
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
      return shuffled.map(row => row.map(val => nums[val - 1]));
    };

    let sGrid = shuffle(baseGrid);
    let newGrid = sGrid.map(row => row.map(val => ({ value: val, isOriginal: true })));
    const hideLimit = difficulty === 'Easy' ? 35 : 55;
    let hidden = 0;
    while (hidden < hideLimit) {
      let r = Math.floor(Math.random() * 9), c = Math.floor(Math.random() * 9);
      if (newGrid[r][c].isOriginal) {
        newGrid[r][c] = { value: 0, isOriginal: false };
        hidden++;
      }
    }
    setGrid(newGrid);
    setSeconds(0);
    setIsGameStarted(true);
    setShowLeaderboard(false);
  };

  const handleChange = (e, r, c) => {
    if (!isGameStarted || grid[r][c].isOriginal) return;
    const val = e.target.value;
    const lastChar = val.slice(-1);
    const num = (lastChar >= '1' && lastChar <= '9') ? parseInt(lastChar) : 0;
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = { ...newGrid[r][c], value: num };
    setGrid(newGrid);
  };

  const submitScore = async () => {
    if (!isBoardComplete()) return alert("Board is not ready or has errors!");
    setIsGameStarted(false);
    try {
      await axios.post(`${API_BASE_URL}/results`, { playerName, timeInSeconds: seconds });
      alert("Awesome job! Score saved.");
      fetchLeaderboardData();
      setShowLeaderboard(true);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="container">
      <h1>Sudoku with Hasan.M</h1>

      {!isGameStarted && !showLeaderboard && (
        <div className="setup-card">
          <input className="name-input" placeholder="Your Name" value={playerName} onChange={e => setPlayerName(e.target.value)} />
          <div className="difficulty-box">
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="Easy">Easy Mode</option>
              <option value="Hard">Hard Mode</option>
            </select>
          </div>
          <button className="btn start-btn" onClick={startNewGame} disabled={!playerName.trim()}>Start Game</button>
          <button className="btn secondary" onClick={() => setShowLeaderboard(true)}>Leaderboard</button>
        </div>
      )}

      {isGameStarted && (
        <div className="game-area">
          <div className="status-bar">
            <span>{playerName} | {difficulty}</span>
            <span className="timer">Time: {Math.floor(seconds/60)}:{(seconds%60).toString().padStart(2,'0')}</span>
          </div>
          <div className="sudoku-grid">
            {grid.map((row, rIdx) => row.map((cell, cIdx) => {
              const valid = isSafe(grid, rIdx, cIdx, cell.value);
              const cellClass = cell.isOriginal ? 'original' : (cell.value !== 0 ? (valid ? 'correct' : 'incorrect') : '');
              return (
                <input
                  key={`${rIdx}-${cIdx}`}
                  type="tel"
                  inputMode="numeric"
                  className={`cell ${cellClass} ${rIdx % 3 === 2 && rIdx !== 8 ? 'row-boundary' : ''}`}
                  value={cell.value === 0 ? '' : cell.value}
                  onChange={(e) => handleChange(e, rIdx, cIdx)}
                  disabled={cell.isOriginal}
                />
              );
            }))}
          </div>
          <button className="btn finish-btn" onClick={submitScore}>Submit Result</button>
        </div>
      )}

      {showLeaderboard && (
        <div className="leaderboard-view">
          <h2>🏆 Top Winners</h2>
          <div className="score-list">
            {leaderboard.map((r, i) => (
              <div key={i} className="score-item">
                <span>#{i+1} {r.playerName}</span>
                <span>{r.timeInSeconds}s</span>
              </div>
            ))}
          </div>
          <button className="btn" onClick={() => setShowLeaderboard(false)}>Back</button>
        </div>
      )}
    </div>
  );
}

export default App;
import { useState, useEffect, useRef } from "react";
import ScoreDisplay from "./components/ScoreDisplay";
import MainGame from "./components/MainGame";
import ControlerButtons from "./components/ControlerButtons";
import GameOverDisplay from "./components/GameOverDisplay";
import GameStartDisplay from "./components/GameStartDisplay";

function App() {
  // Audio references - created once and reused via cloneNode() to allow overlapping sound effects
  const eat = useRef(new Audio('./sound-effects/eat.mp3'));
  const gameStart = useRef(new Audio('./sound-effects/game-start.mp3'));
  const gameOver = useRef(new Audio('./sound-effects/game-over.mp3'));
  const changeDir = useRef(new Audio('./sound-effects/change-dir.mp3'));

  // Initialize snake at a random position in the center area (rows 6-10, cols 6-10) to avoid starting near walls
  const [snakeBody, setSnakeBody] = useState([
    [Math.ceil((Math.random() * 5) + 5), Math.ceil((Math.random() * 5) + 5)], // head coordinates [row, col]
  ]);

  // Generate initial food at random position within playable grid (rows 2-18, cols 2-18)
  const [snakeFood, setSnakeFood] = useState([Math.ceil((Math.random() * 17) + 1), Math.ceil((Math.random() * 17) + 1)]);

  // Game state management
  const [gameOverState, setGameOverState] = useState(false);
  const [startOfGame, setStartOfGame] = useState(true);
  const [snakeSpeed, setSnakeSpeed] = useState(300); // Initial interval in milliseconds between snake movements

  // Score tracking
  const [gameScore, setGameScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("highScore")) || 0; // Retrieve high score from localStorage or default to 0
  });
  const [hasStartedMoving, setHasStartedMoving] = useState(false); // Tracks if player has pressed any direction key/button

  // Current direction - using ref to avoid re-renders and ensure latest value in intervals
  let dir = useRef('none'); // Initial state: no movement until player chooses direction

  // Update direction based on arrow key input, preventing 180-degree turns
  function setDirection(e) {
    if (e.key === 'ArrowUp' && dir.current !== 'down') dir.current = 'up';
    if (e.key === 'ArrowDown' && dir.current !== 'up') dir.current = 'down';
    if (e.key === 'ArrowLeft' && dir.current !== 'right') dir.current = 'left';
    if (e.key === 'ArrowRight' && dir.current !== 'left') dir.current = 'right';
  }

  // Clone and play audio to allow rapid/overlapping sound effects without interruption
  function playSound(audioRef) {
    audioRef.current.cloneNode().play();
  }

  // Core game loop - handles snake movement, collision detection, and food consumption
  function runSnake() {
    if (gameOverState) return; // Prevent movement after game over

    setSnakeBody(prev => {
      const [headRow, headCol] = prev[0];
      let newHead = [headRow, headCol];

      // Calculate new head position based on current direction
      if (dir.current === "right") newHead = [headRow, headCol + 1];
      if (dir.current === "left") newHead = [headRow, headCol - 1];
      if (dir.current === "up") newHead = [headRow - 1, headCol];
      if (dir.current === "down") newHead = [headRow + 1, headCol];

      const [newHeadRow, newHeadCol] = newHead;

      // Food consumption detection - exact position match
      if (newHeadRow === snakeFood[0] && newHeadCol === snakeFood[1]) {
        playSound(eat);

        // Update score and check for new high score
        setGameScore(prevScore => {
          const newScore = prevScore + 1;
          if (newScore >= highScore) {
            setHighScore(() => newScore);
            localStorage.setItem("highScore", newScore); // Persist high score
          }
          return newScore;
        });

        // Generate new food at random position and increase difficulty by reducing interval
        setSnakeFood([Math.ceil((Math.random() * 17) + 1), Math.ceil((Math.random() * 17) + 1)]);
        setSnakeSpeed(prev => prev > 150 ? prev - 10 : prev > 100 ? prev - 3 : prev > 50 ? prev - 2 : prev);

        return [newHead, ...prev]; // Grow snake: add new head without removing tail
      }

      // Wall collision detection - grid boundaries are 1-18 for both rows and columns
      if (newHeadRow < 1 || newHeadRow > 18 || newHeadCol < 1 || newHeadCol > 18) {
        playSound(gameOver);
        setGameOverState(true);
        return prev; // Return unchanged snake state
      }

      // Self-collision detection - check against body segments excluding head (index 0) and neck (index 1)
      // Neck is always safe because direction validation prevents 180-degree turns
      if (prev.slice(2).some(arr => arr[0] === newHeadRow && arr[1] === newHeadCol)) {
        playSound(gameOver);
        setGameOverState(true);
        return prev; // Return unchanged snake state
      }

      // Normal movement: remove tail and add new head to maintain constant length
      const removedTail = prev.slice(0, -1);
      return [newHead, ...removedTail];
    })
  }

  // Set up keyboard event listener on component mount
  useEffect(() => {

    function handleKey(e) {
      playSound(changeDir);
      setHasStartedMoving(true); // Enable game loop when first key is pressed
      setDirection(e);
    }

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey); // Cleanup on unmount
  }, []);

  // Game loop - runs snake movement at intervals determined by snakeSpeed
  useEffect(() => {
    if (gameOverState || startOfGame || !hasStartedMoving) return; // Don't run until game starts and player moves

    const interval = setInterval(() => {
      runSnake();
    }, snakeSpeed);

    return () => clearInterval(interval); // Cleanup interval on dependency change or unmount
  }, [hasStartedMoving, snakeSpeed, gameOverState, startOfGame])

  // Handle game reset after game over
  useEffect(() => {
    if (gameOverState) {
      // Delay reset to allow game over sound to play
      setTimeout(() => {
        setSnakeBody([
          [Math.ceil((Math.random() * 5) + 5), Math.ceil((Math.random() * 5) + 5)] // Respawn at random center position
        ]);
        setSnakeSpeed(300); // Reset to initial speed
        dir.current = 'none'; // Reset direction
        setHasStartedMoving(false); // Wait for player input
      }, 500);
    }
    else {
      setGameScore(0); // Reset score when starting new game
    }
  }, [gameOverState]);


  return (
    <div id="game-container" className="min-h-screen flex flex-col justify-center items-center bg-linear-to-br from-gray-900 to-gray-800 p-4">
      {/* Score display - shown during active gameplay */}
      {!startOfGame && (<ScoreDisplay gameScore={gameScore} highScore={highScore} />)}

      {/* Main game board and controls - shown during active gameplay */}
      {!gameOverState && !startOfGame && (
        <>
          {/* 18x18 grid game board */}
          <MainGame snakeBody={snakeBody} snakeFood={snakeFood} />

          {/* Mobile touch controls - hidden on desktop (md and larger screens) */}
          <ControlerButtons playSound={playSound} changeDir={changeDir} setHasStartedMoving={setHasStartedMoving} dir={dir} />
        </>
      )
      }

      {/* Game Over screen */}
      {
        gameOverState && (<GameOverDisplay setGameOverState={setGameOverState} playSound={playSound} gameStart={gameStart} />)
      }

      {/* Start screen - shown on initial load */}
      {
        startOfGame && (<GameStartDisplay setStartOfGame={setStartOfGame} playSound={playSound} gameStart={gameStart} />)
      }
    </div>
  )
}

export default App;

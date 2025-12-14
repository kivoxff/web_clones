import { useState, useEffect, useRef } from 'react';
import CharacterContainer from './components/CharacterContainer';
import ObstacalsContainer from './components/ObstacalsContainer';
import ScoreDisplay from './components/ScoreDisplay';
import GameOverDisplay from './components/GameOverDisplay';
import StartDisplay from './components/StartDisplay';

export default function FlappyFly() {
  const dimensions = useRef({ width: 350, height: 600 });

  const GRAVITY = 0.08;
  const FLAP_CONST = 2.5;
  const PIPE_SPEED = 2;

  const [char, setChar] = useState({
    x: 10,
    y: dimensions.current.height / 2,
    v: 0,
    size: Math.min(dimensions.current.width, dimensions.current.height) * 0.2
  })

  const [pipes, setPipes] = useState([]);
  const [charSrc, setCharSrc] = useState('./images-icons/fish.png');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('score')) || 0);
  const [gameOver, setGameOver] = useState(false);
  const [startOfGame, setStartOfGame] = useState(true);

  const velocity = useRef(0);
  const frameRef = useRef(null);
  const charRef = useRef(char);
  const pipesRef = useRef(pipes);
  const charIndex = useRef(0);
  const gameOverRef = useRef(gameOver);
  const gameOverSound = useRef(null);
  const flapSound = useRef(null);

  const V_PIPE_GAPE = charRef.current.size * 2;
  const H_PIPE_GAPE = dimensions.current.width / 2;
  const PIPE_WIDTH = dimensions.current.width * 0.2;
  const PIPE_HEIGHT = dimensions.current.height * 0.6;

  const PIPE_SRC = {
    0: {
      0: './images-icons/01.png',
      1: './images-icons/02.png',
      2: './images-icons/03.png'
    },
    1: {
      0: './images-icons/11.png',
      1: './images-icons/12.png',
      2: './images-icons/13.png'
    },
    2: {
      0: './images-icons/21.png',
      1: './images-icons/22.png',
      2: './images-icons/23.png'
    },
  }

  // sequence matters 
  const CHAR_SRC = [
    './images-icons/fish.png',
    './images-icons/potato.png',
    './images-icons/plane.png',
  ]

  useEffect(() => {
    charRef.current = char;
  }, [char]);

  useEffect(() => {
    pipesRef.current = pipes;
  }, [pipes]);

  useEffect(() => {
    gameOverSound.current = new Audio('./sound-effects/game-over.mp3');
    flapSound.current = new Audio('./sound-effects/whoosh.mp3');
  }, [])

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  useEffect(() => {
    if (startOfGame) return;

    // initial call
    frameRef.current = requestAnimationFrame(updateGame);


    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('click', handleClick);

    // cleanup 
    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [startOfGame, gameOver])

  const handleKeyPress = (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") moveCharUp();
  };

  const handleClick = () => {
    moveCharUp();
  };

  function playSound(audioRef) {
    audioRef.current.cloneNode().play();
  }

  function updateCharSrc(e) {
    if (e.target.dataset.index === undefined) return;

    charIndex.current = e.target.dataset.index;
    const characterSrc = CHAR_SRC[charIndex.current];
    setCharSrc(characterSrc);
  }

  function pullCharDown() {
    velocity.current = velocity.current + GRAVITY;
    setChar(prev => {
      if (prev.y + velocity.current >= dimensions.current.height) {
        gameOverSound.current.play();
        setGameOver(true);
        cancelAnimationFrame(frameRef.current); // stop updating
        return { ...prev, y: dimensions.current.height }; // keep final position stable
      }

      if (prev.y + velocity.current <= 0) {
        velocity.current = 0;
        return { ...prev, y: 0 };
      }
      return { ...prev, y: prev.y + velocity.current, v: velocity.current };
    });
  }

  function moveCharUp() {
    if (gameOver) return;
    playSound(flapSound);
    velocity.current = velocity.current / 2 - FLAP_CONST;
  }

  function generatePipes() {
    setPipes(prev => {

      const keys = Object.keys(PIPE_SRC[charIndex.current]); // ['0','1','2']
      const rand = Math.floor(Math.random() * keys.length); // 0,1,2
      const pipeSrc = PIPE_SRC[charIndex.current][rand];


      const newY = Math.ceil((Math.random() * (PIPE_HEIGHT * 2 / 3)) * (-1))
      const newPipe = { x: dimensions.current.width, y: newY, w: PIPE_WIDTH, h: PIPE_HEIGHT, scored: false, src: pipeSrc };

      if (prev.length < 1) {
        return [newPipe];
      }

      if (prev[prev.length - 1].x < dimensions.current.width - H_PIPE_GAPE) {
        return [...prev, newPipe];
      }

      return prev;
    })

  }

  function movePipes() {
    setPipes(prev => prev.map(pp => {
      return { ...pp, x: pp.x - PIPE_SPEED }
    }))
  }

  function removePipes() {
    setPipes(prev => {
      if (prev.length > 0 && prev[0].x < -PIPE_WIDTH) {
        const newArr = [...prev];
        newArr.shift();
        return newArr;
      }
      return prev;
    })
  }

  function checkCollision() {
    const r = charRef.current.size * 0.20; // radius of circular hitbox
    const cx = charRef.current.x + charRef.current.size / 2; // center of circle
    const cy = charRef.current.y;

    for (const pp of pipesRef.current) {
      const upperPipeBottom = pp.y + PIPE_HEIGHT;
      const lowerPipeTop = upperPipeBottom + V_PIPE_GAPE;

      const pipeLeft = pp.x;
      const pipeRight = pp.x + pp.w;

      // Horizontal overlap?
      const horizontallyInside =
        cx + r > pipeLeft && cx - r < pipeRight;

      if (!horizontallyInside) continue;

      // Vertical collision?
      const hitsUpper = cy - r < upperPipeBottom;
      const hitsLower = cy + r > lowerPipeTop;

      if (hitsUpper || hitsLower) {
        gameOverSound.current.play();
        setGameOver(true);
        cancelAnimationFrame(frameRef.current);
        break;
      }
    }
  }

  function updateGameScore() {
    for (const pp of pipesRef.current) {
      const charLeft = charRef.current.x;

      const pipeRight = pp.x + PIPE_WIDTH;

      // If character crosses the pipe and pipe is not scored yet
      if (!pp.scored && charLeft > pipeRight) {

        pp.scored = true; // Mark pipe as scored so it doesn't repeat

        setScore(prevScore => {
          const newScore = prevScore + 1;

          setHighScore(prevHighScore => {
            if (newScore >= prevHighScore) {
              localStorage.setItem('score', newScore);
              return newScore;
            }
            return prevHighScore;
          })
          return newScore;
        });
      }
    }
  }

  function updateGame() {
    if (gameOverRef.current) return;
    // score
    updateGameScore();

    // game over
    checkCollision();

    // GRAVITY
    pullCharDown();

    // generate pipes 
    generatePipes();

    // remove pipes
    removePipes();

    // moving pipes 
    movePipes();

    // getting id for cleanup
    frameRef.current = requestAnimationFrame(updateGame);
  }

  function resetGame() {

    velocity.current = 0;
    setGameOver(false);
    setScore(0);

    setPipes([]);
    pipesRef.current = [];

    setChar(prev => ({
      ...prev,
      y: dimensions.current.height / 2,
      v: 0
    }));
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="h-2/3 bg-[url(../images-icons/bg.png)] bg-cover relative overflow-hidden" style={{ width: `${dimensions.current.width}px`, height: `${dimensions.current.height}px` }}>

        {!startOfGame && (
          <>
            {/* Character Container */}
            <CharacterContainer char={char} charSrc={charSrc} />

            {/* Obstacals Container */}
            <ObstacalsContainer pipes={pipes} V_PIPE_GAPE={V_PIPE_GAPE} PIPE_HEIGHT={PIPE_HEIGHT} />

            {/* Game Score */}
            <ScoreDisplay score={score} />
          </>
        )}

        {/* Game over display */}
        {gameOver && (<GameOverDisplay score={score} highScore={highScore} resetGame={resetGame} />)}

        {/* Start of game */}
        {startOfGame && (<StartDisplay updateCharSrc={updateCharSrc} CHAR_SRC={CHAR_SRC} setStartOfGame={setStartOfGame} />)}

      </div>
    </div>
  )
}
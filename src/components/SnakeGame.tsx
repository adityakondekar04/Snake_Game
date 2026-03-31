import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { Activity, RefreshCw, Cpu } from 'lucide-react';

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const [isFlashing, setIsFlashing] = useState(false);

  const triggerFlash = () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 150);
  };

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setIsGameOver(false);
    setScore(0);
    setIsStarted(true);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || !isStarted) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        setIsStarted(false);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
        triggerFlash();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isStarted, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isStarted && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isStarted, isGameOver, moveSnake]);

  return (
    <div className="flex flex-col items-center gap-8 font-sans">
      <div className="flex gap-12 items-center bg-neutral-900/60 border border-white/10 px-8 py-4 cyber-clip backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Current Score</span>
          <div className="flex items-center gap-3">
            <Activity size={16} className="text-[#00f0ff]" />
            <span className="text-[#00f0ff] font-display text-2xl font-bold tracking-tighter drop-shadow-[0_0_8px_#00f0ff]">{score}</span>
          </div>
        </div>
        <div className="w-px h-10 bg-white/10" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">High Score</span>
          <div className="flex items-center gap-3">
            <Cpu size={16} className="text-[#ff003c]" />
            <span className="text-[#ff003c] font-display text-2xl font-bold tracking-tighter drop-shadow-[0_0_8px_#ff003c]">{highScore}</span>
          </div>
        </div>
      </div>

      <motion.div 
        animate={isFlashing ? { scale: [1, 1.02, 1], filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] } : {}}
        className="relative group"
      >
        {/* Animated Border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00f0ff] via-[#ff003c] to-[#fcee0a] rounded-none blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
        
        <div 
          className="relative bg-black border border-white/10 overflow-hidden"
          style={{ 
            width: GRID_SIZE * 20, 
            height: GRID_SIZE * 20,
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {/* Grid Background */}
          <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

          {/* Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.03]" 
               style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 4px, 3px 100%' }} />

          {/* Snake */}
          {snake.map((segment, i) => (
            <motion.div
              key={`${i}-${segment.x}-${segment.y}`}
              initial={false}
              animate={{ x: segment.x * 20, y: segment.y * 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute w-5 h-5 p-0.5"
            >
              <div className={`w-full h-full ${i === 0 ? 'bg-[#00f0ff] neon-blue' : 'bg-[#00f0ff]/40 border border-[#00f0ff]/20'}`} />
            </motion.div>
          ))}

          {/* Food */}
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1], 
              rotate: [0, 90, 180, 270, 360],
              boxShadow: ["0 0 10px #fcee0a", "0 0 20px #fcee0a", "0 0 10px #fcee0a"]
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute w-5 h-5 p-1"
            style={{ left: food.x * 20, top: food.y * 20 }}
          >
            <div className="w-full h-full bg-[#fcee0a] rotate-45" />
          </motion.div>

          {/* Overlays */}
          <AnimatePresence>
            {!isStarted && !isGameOver && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-10 p-8 text-center"
              >
                <h2 className="text-4xl font-black text-white font-display mb-2 tracking-tighter uppercase italic">
                  <span className="text-[#00f0ff]">NEO</span>STRIKE
                </h2>
                <p className="text-neutral-500 text-[10px] mb-10 tracking-[0.4em] uppercase">Neural Interface Ready</p>
                <button 
                  onClick={resetGame}
                  className="group relative bg-[#00f0ff] text-black px-10 py-4 font-display font-black text-sm uppercase tracking-widest cyber-clip hover:bg-[#fcee0a] transition-all shadow-[0_0_30px_rgba(0,240,255,0.4)] active:scale-95"
                >
                  Connect Link
                </button>
              </motion.div>
            )}

            {isGameOver && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center z-20 p-8 text-center"
              >
                <div className="relative">
                  <h2 className="text-5xl font-black text-[#ff003c] font-display mb-2 tracking-tighter uppercase italic drop-shadow-[0_0_20px_#ff003c]">
                    Link Severed
                  </h2>
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#ff003c]" />
                </div>
                <p className="text-neutral-500 text-[10px] mt-6 mb-10 tracking-[0.4em] uppercase">Data Corruption Detected</p>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-3 bg-white text-black px-10 py-4 font-display font-black text-sm uppercase tracking-widest cyber-clip hover:bg-[#00f0ff] transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95"
                >
                  <RefreshCw size={18} />
                  Re-Establish
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

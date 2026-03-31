import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { Terminal, RefreshCcw, Power } from 'lucide-react';

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

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
    <div className="flex flex-col items-center gap-6 font-mono">
      <div className="flex gap-4 items-center bg-black border border-[#00ffff]/30 px-6 py-2 shadow-[2px_2px_0px_#ff00ff]">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[#ff00ff]" />
          <span className="text-[#00ffff] text-lg tracking-tighter">DATA_POINTS: {score}</span>
        </div>
        <div className="w-[1px] h-4 bg-[#00ffff]/20" />
        <div className="text-[#ff00ff]/50 text-[10px] uppercase">
          MAX_BUFFER: {highScore}
        </div>
      </div>

      <div className="relative">
        <div 
          className="relative bg-black border-2 border-[#00ffff] shadow-[8px_8px_0px_#ff00ff]"
          style={{ 
            width: GRID_SIZE * 20, 
            height: GRID_SIZE * 20,
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {/* Snake */}
          {snake.map((segment, i) => (
            <div
              key={`${i}-${segment.x}-${segment.y}`}
              className="absolute w-5 h-5 p-[1px]"
              style={{ left: segment.x * 20, top: segment.y * 20 }}
            >
              <div className={`w-full h-full ${i === 0 ? 'bg-[#00ffff]' : 'bg-[#00ffff]/40'} border border-black`} />
            </div>
          ))}

          {/* Food */}
          <div
            className="absolute w-5 h-5 p-1 animate-pulse"
            style={{ left: food.x * 20, top: food.y * 20 }}
          >
            <div className="w-full h-full bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]" />
          </div>

          {/* Overlays */}
          <AnimatePresence>
            {!isStarted && !isGameOver && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10 p-8 text-center"
              >
                <h2 className="text-3xl font-black text-[#00ffff] mb-2 glitch uppercase tracking-tighter">INIT_SNAKE_CORE</h2>
                <p className="text-[#ff00ff] text-[10px] mb-8 tracking-widest">ENCRYPTION_KEY: REQUIRED</p>
                <button 
                  onClick={resetGame}
                  className="group flex items-center gap-3 bg-[#00ffff] text-black px-8 py-3 font-black text-sm hover:bg-[#ff00ff] transition-all shadow-[4px_4px_0px_#ff00ff] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  <Power size={18} />
                  BOOT_SYSTEM
                </button>
              </motion.div>
            )}

            {isGameOver && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-[#ff00ff]/10 backdrop-blur-sm flex flex-col items-center justify-center z-20 p-8 text-center"
              >
                <div className="bg-black border-2 border-red-600 p-8 shadow-[8px_8px_0px_#000]">
                  <h2 className="text-4xl font-black text-red-600 mb-2 italic glitch uppercase">CORE_CRITICAL</h2>
                  <p className="text-white text-xs mb-8 font-mono">MEMORY_DUMP: {score}_BYTES_LOST</p>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-3 bg-red-600 text-white px-8 py-3 font-black text-sm hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                  >
                    <RefreshCcw size={18} />
                    REBOOT_CORE
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

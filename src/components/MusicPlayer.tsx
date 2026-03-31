import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { DUMMY_TRACKS } from '../constants';
import { motion } from 'motion/react';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="bg-black border-2 border-[#00ffff] p-6 shadow-[4px_4px_0px_#ff00ff] w-full max-w-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#ff00ff]/20 animate-pulse" />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative w-full aspect-video bg-neutral-900 border border-[#00ffff]/30 overflow-hidden">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover grayscale contrast-150 mix-blend-screen opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-2 items-end h-16">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: isPlaying ? [10, 40, 20, 60, 10] : 10 }}
                  transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                  className="w-2 bg-[#00ffff]"
                />
              ))}
            </div>
          </div>
          <div className="absolute top-2 left-2 bg-black px-2 py-1 text-[10px] font-mono border border-[#ff00ff]">
            LIVE_STREAM_0{currentTrack.id}
          </div>
        </div>
        
        <div className="font-mono">
          <h3 className="text-[#ff00ff] font-black truncate text-xl uppercase tracking-tighter glitch">{currentTrack.title}</h3>
          <p className="text-[#00ffff]/70 text-xs truncate">SOURCE: {currentTrack.artist}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative h-4 bg-neutral-900 border border-[#00ffff]/30">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[#ff00ff]"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-white mix-blend-difference">
            {Math.floor(progress)}%_BUFFERED
          </div>
        </div>

        <div className="flex items-center justify-between font-mono">
          <button 
            onClick={skipBackward}
            className="p-2 text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all border border-[#00ffff]/30"
          >
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="flex-1 mx-4 py-3 bg-[#00ffff] text-black font-black uppercase tracking-widest hover:bg-[#ff00ff] transition-all shadow-[4px_4px_0px_#ff00ff] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            {isPlaying ? "STOP_CORE" : "INIT_AUDIO"}
          </button>

          <button 
            onClick={skipForward}
            className="p-2 text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all border border-[#00ffff]/30"
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

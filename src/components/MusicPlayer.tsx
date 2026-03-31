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
    <div className="bg-neutral-900/80 border border-[#00f0ff]/30 p-6 cyber-clip backdrop-blur-xl w-full max-w-md relative group">
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#ff003c] opacity-50" />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-24 h-24 shrink-0 cyber-clip-reverse overflow-hidden border border-white/10 group/cover">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover grayscale group-hover/cover:grayscale-0 group-hover/cover:scale-110 transition-all duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/cover:opacity-100 transition-opacity" />
          {isPlaying && (
            <div className="absolute inset-0 bg-[#00f0ff]/20 flex items-center justify-center">
              <div className="flex gap-1 items-end h-10">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [10, 30, 15, 35, 10] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                    className="w-1.5 bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="min-w-0 flex-1">
          <h3 className="text-[#00f0ff] font-display font-bold truncate text-xl uppercase tracking-tighter drop-shadow-[0_0_8px_#00f0ff]">{currentTrack.title}</h3>
          <p className="text-neutral-500 font-sans text-sm uppercase tracking-widest">{currentTrack.artist}</p>
          
          {/* Simulated Waveform */}
          <div className="mt-3 flex items-center gap-0.5 h-4">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                animate={isPlaying ? { 
                  height: [2, Math.random() * 12 + 4, 2],
                  opacity: [0.3, 0.8, 0.3]
                } : { height: 2, opacity: 0.2 }}
                transition={{ repeat: Infinity, duration: 0.5 + Math.random(), delay: i * 0.05 }}
                className="w-1 bg-[#00f0ff]/40"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative h-1 bg-neutral-800">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[#ff003c] neon-pink"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
          />
        </div>

        <div className="flex items-center justify-between">
          <button 
            onClick={skipBackward}
            className="p-3 text-neutral-500 hover:text-[#00f0ff] transition-colors"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-16 h-16 rounded-none bg-[#00f0ff] flex items-center justify-center text-black hover:bg-[#fcee0a] transition-all cyber-clip shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>

          <button 
            onClick={skipForward}
            className="p-3 text-neutral-500 hover:text-[#00f0ff] transition-colors"
          >
            <SkipForward size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#00ffff] selection:bg-[#ff00ff]/30 overflow-hidden relative crt-flicker">
      {/* Visual Artifacts */}
      <div className="noise" />
      <div className="scanlines" />
      
      {/* Header */}
      <header className="relative z-10 pt-8 pb-4 px-6 border-b border-[#00ffff]/20 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-4xl md:text-6xl font-black tracking-tighter uppercase glitch"
            >
              SYSTEM_OVERRIDE://SYNTH_STRIKE
            </motion.h1>
            <p className="mt-1 text-[#ff00ff] font-mono tracking-[0.3em] uppercase text-[10px] animate-pulse">
              STATUS: UNSTABLE_KERNEL_DETECTED
            </p>
          </div>
          <div className="hidden md:block text-right font-mono text-[10px] text-[#00ffff]/40">
            <p>LATENCY: 14ms</p>
            <p>PACKET_LOSS: 0.02%</p>
            <p>ENCRYPTION: AES-256-GCM</p>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[300px_1fr_350px] gap-8 items-start py-12">
        {/* Left Column - Terminal Logs */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:flex flex-col gap-6"
        >
          <div className="bg-black border border-[#00ffff]/30 p-4 font-mono text-[11px] leading-relaxed relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-[#00ffff]/50 animate-[scan_2s_linear_infinite]" />
            <h4 className="text-[#ff00ff] mb-2 border-b border-[#ff00ff]/30 pb-1">TERMINAL_LOGS</h4>
            <div className="space-y-1 opacity-70">
              <p className="text-green-500">[OK] BOOT_SEQUENCE_COMPLETE</p>
              <p>[INFO] LOADING_SNAKE_MODULE...</p>
              <p>[INFO] INITIALIZING_AUDIO_DRIVER...</p>
              <p className="text-yellow-500">[WARN] BUFFER_OVERFLOW_NEAR_X04</p>
              <p className="text-red-500">[ERR] MEMORY_LEAK_IN_VIBE_ENGINE</p>
              <p className="animate-pulse">_</p>
            </div>
          </div>

          <div className="bg-black border border-[#ff00ff]/30 p-4 font-mono text-[11px]">
            <h4 className="text-[#00ffff] mb-2 border-b border-[#00ffff]/30 pb-1">PROTOCOL_09</h4>
            <p className="text-[#ff00ff]/70 italic">"The machine does not sleep. The machine only waits for the input."</p>
          </div>
        </motion.div>

        {/* Center - Game */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center screen-tear"
        >
          <SnakeGame />
        </motion.div>

        {/* Right Column - Music Player */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center lg:items-end gap-8"
        >
          <MusicPlayer />
          
          <div className="w-full max-w-md bg-black border border-[#00ffff]/20 p-4 font-mono text-[10px]">
            <div className="flex justify-between mb-2">
              <span className="text-[#ff00ff]">SIGNAL_STRENGTH</span>
              <span>88%</span>
            </div>
            <div className="h-1 bg-[#00ffff]/10 w-full mb-4">
              <motion.div 
                animate={{ width: ["80%", "85%", "82%", "88%"] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="h-full bg-[#00ffff]"
              />
            </div>
            <p className="text-center text-[#00ffff]/40 tracking-tighter">
              DO NOT DISCONNECT. DATA CORRUPTION MAY OCCUR.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full border-t border-[#00ffff]/10 bg-black py-2 px-6 flex justify-between items-center z-50 font-mono text-[9px]">
        <div className="flex items-center gap-4">
          <span className="text-[#ff00ff] animate-pulse">● LIVE_FEED</span>
          <span className="text-[#00ffff]/40">CORE_TEMP: 42°C</span>
          <span className="text-[#00ffff]/40">UPTIME: 00:14:55:02</span>
        </div>
        <div className="flex gap-4 text-[#00ffff]/60">
          <span>ROOT@SYNTH_STRIKE:~$</span>
          <span className="animate-pulse">_</span>
        </div>
      </footer>
    </div>
  );
}

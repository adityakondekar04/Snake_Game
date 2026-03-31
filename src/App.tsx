import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';
import { motion } from 'motion/react';

export default function App() {
  const [cpuLoad, setCpuLoad] = React.useState(42);
  const [gpuTemp, setGpuTemp] = React.useState(68);
  const [syncRate, setSyncRate] = React.useState(99.9);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCpuLoad(prev => Math.min(100, Math.max(10, prev + (Math.random() * 10 - 5))));
      setGpuTemp(prev => Math.min(90, Math.max(40, prev + (Math.random() * 4 - 2))));
      setSyncRate(prev => Math.min(100, Math.max(95, prev + (Math.random() * 0.2 - 0.1))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#00f0ff] selection:bg-[#ff003c]/30 overflow-x-hidden relative cyber-grid">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#ff003c]/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00f0ff]/10 blur-[150px] rounded-full" />
        
        {/* Data Stream Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, x: Math.random() * 100 + '%' }}
            animate={{ y: '110vh' }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 20
            }}
            className="absolute w-px h-20 bg-gradient-to-b from-transparent via-[#00f0ff]/20 to-transparent"
          />
        ))}
      </div>
      
      {/* Header */}
      <header className="relative z-10 pt-12 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative"
          >
            <h1 className="text-5xl md:text-7xl font-black font-display tracking-tighter uppercase italic leading-none">
              <span className="text-[#fcee0a] drop-shadow-[0_0_15px_#fcee0a]">NEO</span>
              <span className="text-white">STRIKE</span>
            </h1>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#ff003c] to-transparent" />
          </motion.div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex gap-4"
          >
            <div className="bg-[#00f0ff]/10 border border-[#00f0ff]/30 px-6 py-2 cyber-clip">
              <span className="text-[10px] font-display uppercase tracking-[0.3em] text-[#00f0ff]">Neural Link: Active</span>
            </div>
            <div className="bg-[#ff003c]/10 border border-[#ff003c]/30 px-6 py-2 cyber-clip">
              <span className="text-[10px] font-display uppercase tracking-[0.3em] text-[#ff003c]">Sector: 7G</span>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-12 items-start pb-32">
        {/* Left Column - Tech Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:flex flex-col gap-8"
        >
          <div className="bg-neutral-900/40 border-l-4 border-[#fcee0a] p-6 cyber-clip backdrop-blur-md">
            <h4 className="text-[#fcee0a] font-display text-xs uppercase mb-4 tracking-widest">Mission Briefing</h4>
            <div className="space-y-4 text-sm text-neutral-400 font-sans">
              <p>Infiltrate the mainframe. Consume data nodes. Avoid firewall collisions.</p>
              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <span className="text-[10px] uppercase">Difficulty</span>
                <span className="text-[#00f0ff]">Hardcore</span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/40 border-l-4 border-[#00f0ff] p-6 cyber-clip backdrop-blur-md">
            <h4 className="text-[#00f0ff] font-display text-xs uppercase mb-4 tracking-widest">Hardware Sync</h4>
            <div className="space-y-4">
              {[
                { label: 'CPU Load', val: `${cpuLoad.toFixed(0)}%`, color: '#00f0ff' },
                { label: 'GPU Temp', val: `${gpuTemp.toFixed(0)}°C`, color: '#ff003c' },
                { label: 'Sync Rate', val: `${syncRate.toFixed(1)}%`, color: '#fcee0a' }
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase tracking-wider">
                    <span className="text-neutral-500">{stat.label}</span>
                    <span style={{ color: stat.color }}>{stat.val}</span>
                  </div>
                  <div className="h-0.5 bg-neutral-800 w-full">
                    <motion.div 
                      animate={{ width: stat.val }}
                      className="h-full"
                      style={{ backgroundColor: stat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Center - Game */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <SnakeGame />
        </motion.div>

        {/* Right Column - Music Player */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center lg:items-end gap-8"
        >
          <MusicPlayer />
          
          <div className="w-full max-w-md bg-[#ff003c]/5 border border-[#ff003c]/20 p-6 cyber-clip backdrop-blur-md">
            <h4 className="text-[#ff003c] font-display text-xs uppercase mb-4 tracking-widest">Neural Beats</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Synchronizing auditory feedback with visual stimuli. High-frequency patterns detected.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full z-50">
        <div className="bg-[#fcee0a] text-black py-1 px-6 flex justify-between items-center font-display text-[10px] font-bold uppercase tracking-widest">
          <span>Connection: Secure</span>
          <div className="flex gap-8">
            <span>Latency: 12ms</span>
            <span>Uptime: 100%</span>
          </div>
        </div>
        <div className="bg-black/90 backdrop-blur-md py-4 px-8 flex justify-between items-center border-t border-white/10">
          <div className="flex gap-6 text-[11px] font-sans text-neutral-500">
            <span className="hover:text-[#00f0ff] cursor-pointer transition-colors">Data Privacy</span>
            <span className="hover:text-[#ff003c] cursor-pointer transition-colors">Protocol Terms</span>
          </div>
          <div className="text-[11px] font-display text-[#00f0ff] animate-pulse">
            // NEOSTRIKE_OS_v4.0
          </div>
        </div>
      </footer>
    </div>
  );
}

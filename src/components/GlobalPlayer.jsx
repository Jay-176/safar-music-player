import React, { useEffect } from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, SkipForward, SkipBack, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalPlayer() {
  const { 
    currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, stopTrack,
    currentTime, duration, seek 
  } = useAudio();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (!currentTrack) return;

      switch (e.code) {
        case "Space":
          e.preventDefault(); 
          togglePlay();
          break;
        case "ArrowRight":
          e.preventDefault();
          seek(Math.min(currentTime + 5, duration));
          break;
        case "ArrowLeft":
          e.preventDefault();
          seek(Math.max(currentTime - 5, 0));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, currentTrack, currentTime, duration, seek]);

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <AnimatePresence>
      {currentTrack && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl ring-1 ring-black/5 p-4 flex flex-col z-50"
        >
          
          <div className="flex items-center justify-between w-full gap-3 sm:gap-6">
            
            {/* 1. Track Info: Vertically centered without the artist name */}
            <div className="flex flex-1 items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl flex-shrink-0 shadow-inner bg-gradient-to-br from-[#F6E7D8] to-[#EADCF6] flex items-center justify-center text-[#8E82E3] font-bold text-lg">
                ♪
              </div>
              <div className="flex flex-col min-w-0 justify-center">
                <h4 className="font-bold text-slate-800 text-sm leading-tight break-words pr-2">
                  {currentTrack.title}
                </h4>
              </div>
            </div>

            {/* 2. Controls */}
            <div className="flex-shrink-0 flex items-center justify-center gap-3 sm:gap-6">
              <button onClick={prevTrack} className="text-slate-600 hover:text-[#8E82E3] transition-colors">
                <SkipBack size={20} />
              </button>
              <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center bg-[#8E82E3] text-white rounded-full shadow-md hover:scale-105 transition-transform">
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
              </button>
              <button onClick={nextTrack} className="text-slate-600 hover:text-[#8E82E3] transition-colors">
                <SkipForward size={20} />
              </button>
            </div>

            {/* 3. Close Button */}
            <div className="flex justify-end ml-1 sm:ml-2">
              <button onClick={stopTrack} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all flex-shrink-0">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-center gap-3 mt-3 w-full px-2">
            <span className="text-xs font-semibold text-slate-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input 
              type="range" 
              min={0} 
              max={duration || 100} 
              value={currentTime} 
              onChange={(e) => seek(Number(e.target.value))}
              className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8E82E3]"
            />
            <span className="text-xs font-semibold text-slate-400 w-10">
              {formatTime(duration)}
            </span>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
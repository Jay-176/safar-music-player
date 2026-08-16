import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, X, Music } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds === 0) return "0:00";
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default function GlobalPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    seekBy,
    closePlayer
  } = useAudio();

  // Attach global keyboard shortcuts for the player
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if the user happens to be typing in an input field somewhere
      if (e.target.tagName === 'INPUT' && e.target.type !== 'range') return;

      if (e.key === 'ArrowRight') {
        seekBy(5);
        e.preventDefault(); // Prevents the browser from scrolling
      } else if (e.key === 'ArrowLeft') {
        seekBy(-5);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [seekBy]);

  if (!currentTrack) return null;

  const handleSliderChange = (e) => {
    seek(Number(e.target.value));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 250 }}
        className="fixed bottom-4 inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[540px] z-50 bg-[#F0F4FA]/95 backdrop-blur-2xl rounded-3xl p-4 md:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-white/80 ring-1 ring-black/5"
      >
        <div className="flex items-center justify-between gap-3">
          {/* Track Information */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E8E0FA] to-[#D5CBFA] flex items-center justify-center text-[#8E82E3] shrink-0 shadow-inner">
              <Music className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-slate-800 truncate leading-snug">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                Safar Music
              </p>
            </div>
          </div>

          {/* Player Buttons */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Previous Button */}
            <button
              onClick={playPrevious}
              className="p-2 text-slate-600 hover:text-slate-900 active:scale-95 transition-all rounded-full hover:bg-black/5"
              title="Previous Track"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            {/* Play / Pause Toggle Button */}
            <button
              onClick={togglePlay}
              className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#8E82E3] to-[#7162CA] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Next Button */}
            <button
              onClick={playNext}
              className="p-2 text-slate-600 hover:text-slate-900 active:scale-95 transition-all rounded-full hover:bg-black/5"
              title="Next Track"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            {/* Close Player Button */}
            <button
              onClick={closePlayer}
              className="p-2 text-slate-400 hover:text-slate-700 active:scale-95 transition-all rounded-full hover:bg-black/5 ml-1"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Timeline / Progress Bar */}
        <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold text-slate-500">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSliderChange}
            className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8E82E3]"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
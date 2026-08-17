import React, { useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, X, Music2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function GlobalPlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious,
    currentTime,
    duration,
    seek,
    closePlayer
  } = useAudio();

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if the user is typing in an input field (standard accessibility safety check)
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault(); // Prevents the page from scrolling down
          togglePlayPause();
          break;
        case 'ArrowRight':
          e.preventDefault(); // Prevents horizontal scrolling
          seek(Math.min(currentTime + 5, duration || 0));
          break;
        case 'ArrowLeft':
          e.preventDefault(); // Prevents horizontal scrolling
          seek(Math.max(currentTime - 5, 0));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, seek, currentTime, duration]);

  if (!currentTrack) return null;

  const handleSeekChange = (e) => {
    seek(parseFloat(e.target.value));
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg bg-white/85 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-4 transition-all">
      <div className="flex items-center justify-between gap-3">
        {/* Track Icon & Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-2xl bg-[#8E82E3]/20 flex items-center justify-center text-[#8E82E3] shrink-0">
            <Music2 className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-800 truncate">{currentTrack.title}</h4>
            <p className="text-xs text-slate-500 font-medium truncate">Safar Music</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={playPrevious} className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors">
            <SkipBack className="w-4 h-4" />
          </button>
          
          <button 
            onClick={togglePlayPause} 
            className="w-10 h-10 rounded-full bg-[#8E82E3] hover:bg-[#7b6fda] text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          
          <button onClick={playNext} className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors">
            <SkipForward className="w-4 h-4" />
          </button>

          <button onClick={closePlayer} className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors ml-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-500 w-8 text-right">{formatTime(currentTime)}</span>
        <input 
          type="range" 
          min={0} 
          max={duration || 0} 
          step="0.1"
          value={currentTime || 0} 
          onChange={handleSeekChange}
          className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8E82E3]"
        />
        <span className="text-[11px] font-semibold text-slate-500 w-8">{formatTime(duration)}</span>
      </div>
    </div>
  );
}
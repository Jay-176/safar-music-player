import React, { createContext, useState, useEffect, useRef, useContext } from 'react';

export const AudioContext = createContext();

export function AudioProvider({ children }) {
  // 1. Initialize State from Local Storage
  const [currentTrack, setCurrentTrack] = useState(() => {
    const saved = localStorage.getItem('safar_track');
    return saved ? JSON.parse(saved) : null;
  });

  const [playlist, setPlaylist] = useState(() => {
    const saved = localStorage.getItem('safar_queue');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem('safar_index');
    return saved ? parseInt(saved, 10) : -1;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // 2. Refs act as a "source of absolute truth" to prevent stale closures
  const playlistRef = useRef(playlist);
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    playlistRef.current = playlist;
    localStorage.setItem('safar_queue', JSON.stringify(playlist));
  }, [playlist]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
    localStorage.setItem('safar_index', currentIndex.toString());
  }, [currentIndex]);

  useEffect(() => {
    if (currentTrack) localStorage.setItem('safar_track', JSON.stringify(currentTrack));
    else localStorage.removeItem('safar_track');
  }, [currentTrack]);

  // 3. Bulletproof Auto-Advance Logic
  const handleTrackEnd = () => {
    // Always read from the Ref to get real-time data, ignoring old memory
    const currentQueue = playlistRef.current;
    const currentIdx = currentIndexRef.current;

    if (currentQueue.length > 0) {
      if (currentIdx === -1) {
        // A library track finished, start the custom queue
        setCurrentIndex(0);
        setCurrentTrack(currentQueue[0]);
        setIsPlaying(true);
      } else if (currentIdx < currentQueue.length - 1) {
        // Move to the next track in the custom queue
        setCurrentIndex(currentIdx + 1);
        setCurrentTrack(currentQueue[currentIdx + 1]);
        setIsPlaying(true);
      } else {
        // The entire queue has finished
        setIsPlaying(false);
        setCurrentIndex(-1);
      }
    } else {
      // No queue exists, stop playing completely
      setIsPlaying(false);
      setCurrentIndex(-1);
    }
  };

  // Sync native HTML5 audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('ended', handleTrackEnd);
    return () => audio.removeEventListener('ended', handleTrackEnd);
  }, [currentIndex, playlist]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.log("Autoplay blocked:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  // Core Audio Methods
  const playTrack = (track) => {
    setCurrentTrack(track);
    setCurrentIndex(-1);
    setIsPlaying(true);
  };

  const playQueueTrack = (index) => {
    const currentQueue = playlistRef.current;
    if (index >= 0 && index < currentQueue.length) {
      setCurrentIndex(index);
      setCurrentTrack(currentQueue[index]);
      setIsPlaying(true);
    }
  };

  const addToQueue = (track) => {
    setPlaylist((prev) => [...prev, track]);
  };

  const removeFromQueue = (index) => {
    setPlaylist((prev) => prev.filter((_, i) => i !== index));
    const currentIdx = currentIndexRef.current;
    
    // Safety check using real-time Ref data
    if (currentIdx === index) {
      setCurrentIndex(-1);
      setIsPlaying(false);
    } else if (currentIdx > index) {
      setCurrentIndex(currentIdx - 1);
    }
  };

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  // Expose the bulletproof end logic to manual skip buttons
  const playNext = () => handleTrackEnd(); 

  const playPrevious = () => {
    const currentIdx = currentIndexRef.current;
    if (currentIdx > 0) {
      playQueueTrack(currentIdx - 1);
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <AudioContext.Provider value={{
      currentTrack, setCurrentTrack,
      playlist, setPlaylist,
      currentIndex, setCurrentIndex,
      isPlaying, setIsPlaying,
      audioRef,
      playTrack,
      playQueueTrack,
      addToQueue,
      removeFromQueue,
      togglePlayPause,
      playNext,
      playPrevious
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);
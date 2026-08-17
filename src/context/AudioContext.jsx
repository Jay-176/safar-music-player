import React, { createContext, useState, useEffect, useRef, useContext } from 'react';

export const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(() => {
    try {
      const saved = localStorage.getItem('safar_track');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [playlist, setPlaylist] = useState(() => {
    try {
      const saved = localStorage.getItem('safar_queue');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    try {
      const saved = localStorage.getItem('safar_index');
      return saved !== null ? parseInt(saved, 10) : -1;
    } catch {
      return -1;
    }
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const playlistRef = useRef(playlist);
  const currentIndexRef = useRef(currentIndex);
  
  // NEW: Tracks exactly which song is currently loaded into the HTML audio element
  const loadedTrackIdRef = useRef(null); 

  // Auto-sync state to local storage and Refs
  useEffect(() => {
    playlistRef.current = playlist;
    localStorage.setItem('safar_queue', JSON.stringify(playlist));
  }, [playlist]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
    localStorage.setItem('safar_index', currentIndex.toString());
  }, [currentIndex]);

  useEffect(() => {
    if (currentTrack) {
      localStorage.setItem('safar_track', JSON.stringify(currentTrack));
    } else {
      localStorage.removeItem('safar_track');
    }
  }, [currentTrack]);

  // Bulletproof Track Advancing
  const handleTrackEnd = () => {
    const queue = playlistRef.current;
    const idx = currentIndexRef.current;

    if (queue.length > 0) {
      if (idx === -1) {
        // Start custom queue
        setCurrentIndex(0);
        setCurrentTrack(queue[0]);
        setIsPlaying(true);
      } else if (idx < queue.length - 1) {
        // Next track in queue
        setCurrentIndex(idx + 1);
        setCurrentTrack(queue[idx + 1]);
        setIsPlaying(true);
      } else {
        // End of queue
        setIsPlaying(false);
        setCurrentIndex(-1);
      }
    } else {
      // No queue exists
      setIsPlaying(false);
      setCurrentIndex(-1);
    }
  };

  // Sync native HTML5 audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => handleTrackEnd();
    const onError = (e) => {
      console.warn("Audio load error:", e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  // Handle Play/Pause execution and prevent unwanted reloads
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTrack?.src) {
      // FIX: Check against the track ID instead of the URL string
      if (loadedTrackIdRef.current !== currentTrack.id) {
        audio.src = currentTrack.src;
        audio.load();
        loadedTrackIdRef.current = currentTrack.id; // Update our tracker
      }

      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.log("Audio playback waiting for user gesture:", err);
            setIsPlaying(false);
          });
        }
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
      audio.removeAttribute('src');
      loadedTrackIdRef.current = null; // Clear the tracker
      setCurrentTime(0);
      setDuration(0);
    }
  }, [currentTrack, isPlaying]);

  // Player Controls
  const playTrack = (track) => {
    setCurrentTrack(track);
    setCurrentIndex(-1);
    setIsPlaying(true);
  };

  const playQueueTrack = (index) => {
    const queue = playlistRef.current;
    if (index >= 0 && index < queue.length) {
      setCurrentIndex(index);
      setCurrentTrack(queue[index]);
      setIsPlaying(true);
    }
  };

  const addToQueue = (track) => setPlaylist((prev) => [...prev, track]);

  const removeFromQueue = (index) => {
    setPlaylist((prev) => prev.filter((_, i) => i !== index));
    const currentIdx = currentIndexRef.current;

    if (currentIdx === index) {
      setCurrentIndex(-1);
      setIsPlaying(false);
    } else if (currentIdx > index) {
      setCurrentIndex(currentIdx - 1);
    }
  };

  const togglePlayPause = () => {
    if (!currentTrack) return;
    setIsPlaying((prev) => !prev);
  };

  // Skip buttons logic
  const playNext = () => handleTrackEnd();

  const playPrevious = () => {
    const idx = currentIndexRef.current;
    if (idx > 0) {
      playQueueTrack(idx - 1);
    } else if (audioRef.current) {
      // If no previous queue track exists, restart current song
      audioRef.current.currentTime = 0;
    }
  };

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const closePlayer = () => {
    setIsPlaying(false);
    setCurrentTrack(null);
    setCurrentIndex(-1);
  };

  return (
    <AudioContext.Provider value={{
      currentTrack,
      setCurrentTrack,
      playlist,
      setPlaylist,
      currentIndex,
      setCurrentIndex,
      isPlaying,
      setIsPlaying,
      currentTime,
      duration,
      seek,
      closePlayer,
      audioRef,
      playTrack,
      playQueueTrack,
      addToQueue,
      removeFromQueue,
      togglePlayPause,
      playNext,
      playPrevious
    }}>
      <audio ref={audioRef} preload="metadata" />
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);
import React, { createContext, useState, useRef, useEffect, useContext } from 'react';

export const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

const loadSavedState = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

export const AudioProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState(() => loadSavedState('safar_playlist', []));
  const [currentIndex, setCurrentIndex] = useState(() => loadSavedState('safar_currentIndex', 0));
  const [currentTrack, setCurrentTrack] = useState(() => loadSavedState('safar_currentTrack', null));
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef(new Audio());
  const isInitialMount = useRef(true);

  useEffect(() => {
    localStorage.setItem('safar_playlist', JSON.stringify(playlist));
    localStorage.setItem('safar_currentIndex', JSON.stringify(currentIndex));
    localStorage.setItem('safar_currentTrack', JSON.stringify(currentTrack));
  }, [playlist, currentIndex, currentTrack]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('safar_currentTime', audioRef.current.currentTime);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (currentTrack) {
      document.title = `${isPlaying ? "▶" : "⏸"} ${currentTrack.title} - Safar`;
    } else {
      document.title = "Safar - A Musical Journey";
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    if (currentTrack) {
      audioRef.current.src = currentTrack.src;
      
      if (isInitialMount.current) {
        const savedTime = localStorage.getItem('safar_currentTime');
        if (savedTime) {
          audioRef.current.currentTime = parseFloat(savedTime);
          setCurrentTime(parseFloat(savedTime));
        }
        isInitialMount.current = false;
      } else {
        audioRef.current.play().catch(err => console.error("Playback prevented:", err));
        setIsPlaying(true);
      }
    } else {
      isInitialMount.current = false;
    }
  }, [currentTrack]);

  useEffect(() => {
    if (currentTrack && !isInitialMount.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Playback prevented:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]); 

  useEffect(() => {
    const audio = audioRef.current;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      if (currentIndex < playlist.length - 1) {
        nextTrack();
      } else {
        setIsPlaying(false);
      }
    };
    
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [currentIndex, playlist]);

  const togglePlay = () => setIsPlaying(prev => !prev);

  const playTrack = (track) => {
    setPlaylist([track]);
    setCurrentIndex(0);
    setCurrentTrack(track);
  };

  const addToQueue = (track) => {
    if (!currentTrack) {
      playTrack(track);
      return;
    }
    setPlaylist(prev => [...prev, track]);
  };

  const removeFromQueue = (index) => {
    setPlaylist(prev => {
      const newPlaylist = [...prev];
      newPlaylist.splice(index, 1);
      return newPlaylist;
    });
    if (index < currentIndex) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const playQueueTrack = (index) => {
    setCurrentIndex(index);
    setCurrentTrack(playlist[index]);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    if (currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentTrack(playlist[nextIndex]);
    }
  };

  const prevTrack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentTrack(playlist[prevIndex]);
    }
  };

  // THE FIX: Completely wipe the queue and index when the player is closed!
  const stopTrack = () => {
    audioRef.current.pause();
    setIsPlaying(false);
    setCurrentTrack(null);
    setPlaylist([]); // Clears the active queue entirely
    setCurrentIndex(0); // Resets the math
    localStorage.removeItem('safar_currentTime'); // Clears the saved time for a truly fresh start
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  return (
    <AudioContext.Provider value={{
      currentTrack, isPlaying, togglePlay, playTrack, addToQueue, removeFromQueue, playQueueTrack, 
      nextTrack, prevTrack, playlist, currentIndex, stopTrack, currentTime, duration, seek 
    }}>
      {children}
    </AudioContext.Provider>
  );
};
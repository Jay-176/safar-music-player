import React, { createContext, useState, useEffect, useContext, useRef } from 'react';

export const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]); // Active Queue
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 means playing from library
  const [eraTracks, setEraTracks] = useState([]); 
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(new Audio());

  // Load persistent queue from local storage
  useEffect(() => {
    const savedQueue = localStorage.getItem('safarQueue');
    if (savedQueue) {
      try {
        setPlaylist(JSON.parse(savedQueue));
      } catch (e) {
        console.error("Failed to parse saved queue", e);
      }
    }
  }, []);

  // Save queue changes to local storage
  useEffect(() => {
    localStorage.setItem('safarQueue', JSON.stringify(playlist));
  }, [playlist]);

  // Handle track source changes
  useEffect(() => {
    const audio = audioRef.current;

    if (currentTrack?.src) {
      audio.src = currentTrack.src;
      audio.load();
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Autoplay prevented or audio source error:", err);
          setIsPlaying(false);
        });
    }

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => playNext();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!currentTrack) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  };

  const playTrack = (track, currentEraTracks = []) => {
    setCurrentTrack(track);
    if (currentEraTracks.length > 0) {
      setEraTracks(currentEraTracks);
    }
    setCurrentIndex(-1);
  };

  const addToQueue = (track) => {
    setPlaylist((prev) => [...prev, track]);
  };

  const removeFromQueue = (index) => {
    setPlaylist((prev) => prev.filter((_, i) => i !== index));
    if (currentIndex === index) {
      closePlayer();
    } else if (currentIndex > index) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const playQueueTrack = (index) => {
    if (playlist[index]) {
      setCurrentIndex(index);
      setCurrentTrack(playlist[index]);
    }
  };

  const playNext = () => {
    // 1. Always check the Active Queue first
    if (playlist.length > 0) {
      if (currentIndex === -1) {
        // If playing from library, jump into the first song of the queue
        playQueueTrack(0);
        return;
      } else if (currentIndex < playlist.length - 1) {
        // If already in queue, go to the next song in the queue
        playQueueTrack(currentIndex + 1);
        return;
      }
    }

    // 2. If queue is empty OR we finished the queue, play next from Era Library
    if (eraTracks.length > 0 && currentTrack) {
      const currentIdx = eraTracks.findIndex((t) => t.id === currentTrack.id);
      if (currentIdx !== -1 && currentIdx < eraTracks.length - 1) {
        playTrack(eraTracks[currentIdx + 1], eraTracks);
      } else {
        // Loop back to start
        playTrack(eraTracks[0], eraTracks);
      }
    }
  };

  const playPrevious = () => {
    if (playlist.length > 0 && currentIndex > 0) {
      playQueueTrack(currentIndex - 1);
      return;
    }

    if (eraTracks.length > 0 && currentTrack) {
      const currentIdx = eraTracks.findIndex((t) => t.id === currentTrack.id);
      if (currentIdx > 0) {
        playTrack(eraTracks[currentIdx - 1], eraTracks);
      } else {
        playTrack(eraTracks[eraTracks.length - 1], eraTracks);
      }
    }
  };

  const seek = (timeInSeconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timeInSeconds;
      setCurrentTime(timeInSeconds);
    }
  };

  // New function to jump forward or backward by a specific amount of seconds
  const seekBy = (amountInSeconds) => {
    if (audioRef.current) {
      let newTime = audioRef.current.currentTime + amountInSeconds;
      if (newTime < 0) newTime = 0;
      if (audioRef.current.duration && newTime > audioRef.current.duration) {
        newTime = audioRef.current.duration;
      }
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTrack(null);
    setCurrentIndex(-1);
    setCurrentTime(0);
    setDuration(0);
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playlist,
        currentIndex,
        eraTracks,
        currentTime,
        duration,
        togglePlay,
        playTrack,
        addToQueue,
        removeFromQueue,
        playQueueTrack,
        playNext,
        playPrevious,
        seek,
        seekBy,
        closePlayer,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
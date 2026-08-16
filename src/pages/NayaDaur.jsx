import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ListMusic, X, Play, ArrowLeft, Plus, Check } from "lucide-react";
import { AudioContext } from "../context/AudioContext";
import { PageShell } from "../App";

export default function NayaDaur() {
  const [tracks, setTracks] = useState([]);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("library"); 
  const [addedTrackId, setAddedTrackId] = useState(null);
  const [toast, setToast] = useState({ show: false, trackName: "", isError: false });

  const { playTrack, currentTrack, addToQueue, playlist, removeFromQueue, playQueueTrack, currentIndex } = useContext(AudioContext);

  useEffect(() => {
    const files = import.meta.glob('/src/audio/naya-daur/*.{mp3,MP3,wav,WAV,m4a,M4A}', { 
      eager: true, query: '?url', import: 'default' 
    });
    
    const dynamicTracks = Object.entries(files).map(([filePath, fileUrl], index) => {
      let fileName = filePath.split('/').pop().replace(/\.[^/.]+$/, "");
      fileName = fileName.replace(/_spotdown\.app/gi, "").replace(/_spotdown/gi, "").replace(/_128kbps/gi, "").replace(/_320kbps/gi, "");
      return { id: `naya-daur-${index}`, title: fileName.trim(), src: fileUrl };
    });

    setTracks(dynamicTracks);
  }, []);

  const handleAddToQueue = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      setToast({ show: true, trackName: "", isError: true });
      setTimeout(() => setToast({ show: false, trackName: "", isError: false }), 2500);
      return; 
    }

    addToQueue(track);
    setAddedTrackId(track.id);
    setToast({ show: true, trackName: track.title, isError: false });
    setTimeout(() => {
      setAddedTrackId(null);
      setToast({ show: false, trackName: "", isError: false });
    }, 2000);
  };

  const displayTracks = activeTab === "library" ? tracks : playlist;

  return (
    <PageShell>
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-slate-700"
          >
            <div className={`p-1 rounded-full ${toast.isError ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
              {toast.isError ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            </div>
            <p className="text-sm font-medium tracking-wide">
              {toast.isError ? (
                "Song is currently playing, cannot add to queue"
              ) : (
                <><span className="font-bold text-[#8E82E3]">{toast.trackName}</span> added to queue</>
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-115">
          <source src="/videos/naya-daur.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/40"></div>
      </div>

      <div className="absolute top-8 left-6 md:left-12 z-20">
        <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white transition-all shadow-lg">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium tracking-wide">Home</span>
        </Link>
      </div>

      <div className="absolute top-24 left-6 md:top-28 md:left-12 z-10">
        <p className="text-sm font-bold tracking-widest text-white uppercase bg-white/20 backdrop-blur-md px-3 py-1 rounded-full inline-block shadow-sm border border-white/30">
          Naya Daur
        </p>
        <h1 className="text-5xl md:text-7xl font-bold text-white mt-4 drop-shadow-2xl">
          The New Wave
        </h1>
      </div>

      <button
        onClick={() => setIsPlaylistOpen(true)}
        className={`absolute right-6 md:right-12 z-20 flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md px-6 py-3 shadow-2xl text-slate-800 hover:bg-white hover:scale-105 transition-all duration-300 ring-1 ring-black/5 ${
          currentTrack ? "bottom-48 md:bottom-40" : "bottom-12 md:bottom-32"
        }`}
      >
        <ListMusic className="w-5 h-5 text-[#8E82E3]" />
        <span className="font-bold tracking-wide">Queue</span>
      </button>

      <AnimatePresence>
        {isPlaylistOpen && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`absolute right-0 md:right-8 w-full md:w-96 h-[60vh] md:h-[500px] flex flex-col rounded-t-3xl md:rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl z-30 ring-1 ring-white overflow-hidden transition-all duration-300 ${
              currentTrack ? "bottom-40 md:bottom-32" : "bottom-0 md:bottom-24"
            }`}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200/50 bg-white/50">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab("library")}
                  className={`text-lg font-bold transition-colors ${activeTab === "library" ? "text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Era Tracks
                </button>
                <button
                  onClick={() => setActiveTab("queue")}
                  className={`text-lg font-bold transition-colors ${activeTab === "queue" ? "text-[#8E82E3]" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Active Queue
                </button>
              </div>
              <button onClick={() => setIsPlaylistOpen(false)} className="p-2 rounded-full hover:bg-black/5 text-slate-500 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {displayTracks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6 text-center">
                  <ListMusic className="w-12 h-12 mb-2 opacity-50" />
                  <p className="font-medium">Your queue is empty.</p>
                  <p className="text-sm mt-1">Click the + button on any track to add it here.</p>
                </div>
              ) : (
                displayTracks.map((track, idx) => {
                  const isLibrary = activeTab === "library";
                  const isThisTrackPlaying = isLibrary ? currentTrack?.id === track.id : idx === currentIndex;
                  const isJustAdded = addedTrackId === track.id;

                  return (
                    <div
                      key={isLibrary ? track.id : `queue-${track.id}-${idx}`}
                      className={`w-full flex items-center justify-between p-2 rounded-2xl transition-all ${
                        isThisTrackPlaying ? "bg-[#8E82E3]/10 shadow-sm ring-1 ring-[#8E82E3]/30" : "hover:bg-white/60"
                      }`}
                    >
                      <button
                        onClick={() => {
                          if (isLibrary) {
                            playTrack(track);
                            setIsPlaylistOpen(false);
                          } else {
                            playQueueTrack(idx);
                          }
                        }}
                        className="flex flex-1 items-center gap-4 text-left pr-2"
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm ${
                          isThisTrackPlaying ? "bg-[#8E82E3] text-white" : "bg-white text-[#8E82E3]"
                        }`}>
                          <Play className="h-4 w-4 ml-1" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h3 className={`font-bold leading-tight break-words ${isThisTrackPlaying ? "text-[#8E82E3]" : "text-slate-800"}`}>
                            {track.title}
                          </h3>
                        </div>
                      </button>

                      {isLibrary ? (
                        <button
                          onClick={() => handleAddToQueue(track)}
                          className={`p-2 ml-2 rounded-full transition-all flex-shrink-0 ${
                            isJustAdded ? "bg-green-100 text-green-600" : "text-slate-400 hover:text-[#8E82E3] hover:bg-white"
                          }`}
                          title="Add to Queue"
                        >
                          {isJustAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </button>
                      ) : (
                        !isThisTrackPlaying && (
                          <button
                            onClick={() => removeFromQueue(idx)}
                            className="p-2 ml-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-full transition-colors flex-shrink-0"
                            title="Remove from Queue"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, GraduationCap, Code2, Sparkles, Disc3, ArrowRight } from "lucide-react";
import { PageShell } from "../App";
import { useAudio } from "../context/AudioContext";

const GithubIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const ERAS = [
  {
    key: "sadaabahaar",
    to: "/sadaabahaar",
    title: "Sadaabahaar",
    subtitle: "The Evergreen Era",
    img: "/images/sadabaahaar-cover.jpg", 
  },
  {
    key: "yaadein",
    to: "/yaadein",
    title: "Yaadein",
    subtitle: "The 90s Rewind",
    img: "/images/yaadein-cover.jpg",
  },
  {
    key: "naya-daur",
    to: "/naya-daur",
    title: "Naya Daur",
    subtitle: "The New Wave",
    img: "/images/naya-daur-cover.jpg",
  },
];

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileErasOpen, setIsMobileErasOpen] = useState(false);
  
  const { currentTrack } = useAudio();

  const activeEraKey = currentTrack?.id ? currentTrack.id.split('-').slice(0, -1).join('-') : null;

  const displayEras = [...ERAS].sort((a, b) => {
    if (a.key === activeEraKey) return -1;
    if (b.key === activeEraKey) return 1;
    return 0;
  });

  return (
    <PageShell>
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-110">
          <source src="/videos/safar-home.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70"></div>
      </div>

      <div className="relative z-10 w-full h-screen overflow-hidden flex flex-col justify-between p-6 md:p-16">
        <div className="flex items-start justify-between w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <span className="mb-3 inline-block rounded-full bg-white/20 backdrop-blur-md border border-white/40 px-4 py-1 text-xs font-semibold tracking-widest text-white shadow-lg uppercase">
              एक संगीतमय सफ़र
            </span>
            <h1 className="text-6xl font-extrabold tracking-tight text-white drop-shadow-2xl sm:text-8xl">
              Safar
            </h1>
            <p className="mt-3 max-w-[280px] md:max-w-sm text-white/90 font-medium drop-shadow-md text-sm md:text-lg leading-relaxed">
              The Journey — three eras of music, one uninterrupted thread of sound.
            </p>
          </motion.div>

          <button 
            onClick={() => setIsProfileOpen(true)}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white font-bold text-xl shadow-lg flex items-center justify-center hover:bg-white/30 hover:scale-105 active:scale-95 transition-all"
          >
            J
          </button>
        </div>

        <div className={`md:hidden flex flex-col items-center justify-center transition-all duration-300 ${currentTrack ? 'mb-40' : 'mb-24'}`}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileErasOpen(true)}
            className="flex items-center gap-3 px-6 py-4 rounded-full bg-white/25 hover:bg-white/35 backdrop-blur-xl border border-white/40 text-white font-bold text-base shadow-2xl transition-all"
          >
            <Disc3 className="w-6 h-6 animate-spin text-[#A89FF5]" style={{ animationDuration: '4s' }} />
            <span>Select Musical Era</span>
            <ArrowRight className="w-5 h-5 opacity-80" />
          </motion.button>
        </div>

        <div className="hidden md:block absolute bottom-20 right-24">
          <div 
            className="relative w-64 h-80 flex items-center justify-center cursor-pointer perspective-1000"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {displayEras.map((era, i) => {
              const isTopCard = i === 0;
              const desktopX = i * -140;
              const desktopY = i * 10;
              const desktopRotate = i * -6;

              const xOffset = isHovered ? desktopX : i * -15;
              const yOffset = isHovered ? desktopY : i * 10;
              const rotation = isHovered ? desktopRotate : i * -3;
              const zIndex = 3 - i;

              return (
                <motion.div
                  key={era.key}
                  animate={{ 
                    x: xOffset, 
                    y: yOffset,
                    rotate: rotation, 
                    scale: isHovered ? (isTopCard ? 1.05 : 1) : 1
                  }}
                  transition={{ type: "spring", stiffness: 220, damping: 25 }}
                  className="absolute w-full h-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white/90 overflow-hidden bg-slate-800 origin-bottom"
                  style={{ zIndex }}
                >
                  <Link to={era.to} className="w-full h-full block relative group">
                    <img src={era.img} alt={era.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                      <h2 className="text-white text-3xl font-bold tracking-wider drop-shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {era.title}
                      </h2>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {isMobileErasOpen && (
            <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileErasOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="relative w-full bg-slate-900/90 backdrop-blur-2xl rounded-t-3xl border-t border-white/20 p-6 z-10"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-bold text-white tracking-wide">Choose an Era</h3>
                  <button 
                    onClick={() => setIsMobileErasOpen(false)}
                    className="p-2 text-slate-400 hover:text-white rounded-full bg-white/10"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className={`grid grid-cols-1 gap-3.5 max-h-[65vh] overflow-y-auto pr-1 ${currentTrack ? 'pb-36' : 'pb-6'}`}>
                  {ERAS.map((era) => (
                    <Link
                      key={era.key}
                      to={era.to}
                      onClick={() => setIsMobileErasOpen(false)}
                      className="flex items-center gap-4 p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 active:scale-[0.98] transition-all"
                    >
                      <img 
                        src={era.img} 
                        alt={era.title} 
                        className="w-16 h-16 rounded-xl object-cover border border-white/20 shadow-md shrink-0" 
                      />
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white">{era.title}</h4>
                        <p className="text-xs text-white/70">{era.subtitle}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/60 mr-2" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isProfileOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsProfileOpen(false)}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-gradient-to-br from-[#F0F4FA] to-[#E3E0FA] rounded-3xl shadow-2xl p-8 ring-1 ring-white"
              >
                <button 
                  onClick={() => setIsProfileOpen(false)}
                  className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition-colors bg-white/50 rounded-full p-2"
                >
                  <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8E82E3] to-[#7162CA] text-white font-bold text-3xl shadow-lg flex items-center justify-center mb-4 ring-4 ring-white">
                    J
                  </div>
                  
                  <h2 className="text-2xl font-extrabold text-slate-800">Jay Pandya</h2>
                  <p className="text-[#8E82E3] font-semibold mt-1 flex items-center gap-1.5">
                    <Sparkles size={16} /> AI & Data Science Engineer
                  </p>

                  <div className="mt-6 w-full space-y-4 text-left">
                    <div className="flex items-start gap-3 bg-white/60 p-3 rounded-xl shadow-sm">
                      <GraduationCap className="w-5 h-5 text-[#8E82E3] mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">LJ University</h4>
                        <p className="text-xs text-slate-600 font-medium">BTech CS (AI & Data Science)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white/60 p-3 rounded-xl shadow-sm">
                      <MapPin className="w-5 h-5 text-[#8E82E3] mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Ahmedabad, Gujarat</h4>
                        <p className="text-xs text-slate-600 font-medium">Actively exploring local tech & AI startups.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white/60 p-3 rounded-xl shadow-sm">
                      <Code2 className="w-5 h-5 text-[#8E82E3] mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">About Safar</h4>
                        <ul className="text-xs text-slate-600 font-medium mt-1 space-y-1">
                          <li>• <strong>Music:</strong> Tracks spanning 3 distinct musical eras</li>
                          <li>• <strong>Playlists:</strong> Curated selections and custom queue</li>
                          <li>• <strong>Ad-Free:</strong> Pure uninterrupted listening</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 mt-6 w-full">
                    <a 
                      href="https://github.com/Jay-176" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-3 bg-white hover:bg-slate-50 rounded-full shadow-sm hover:shadow-md transition-all text-slate-600 hover:text-black"
                    >
                      <GithubIcon className="w-5 h-5" />
                    </a>
                    
                    <a 
                      href="https://www.linkedin.com/in/jay-pandya-026022326/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-3 bg-white hover:bg-slate-50 rounded-full shadow-sm hover:shadow-md transition-all text-slate-600 hover:text-[#0A66C2]"
                    >
                      <LinkedinIcon className="w-5 h-5" />
                    </a>
                    
                    <a 
                      href="https://jay-pandya.vercel.app/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex flex-1 items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8E82E3] to-[#7162CA] text-white rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all font-bold tracking-wide group"
                    >
                      <span className="bg-white text-[#8E82E3] rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-black group-hover:bg-[#F0F4FA] transition-colors">
                        JP
                      </span>
                      Portfolio
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
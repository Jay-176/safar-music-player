import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { AudioProvider } from "./context/AudioContext";
import GlobalPlayer from "./components/GlobalPlayer";

import Home from "./pages/Home";
import Sadaabahaar from "./pages/Sadaabahaar";
import Yaadein from "./pages/Yaadein";
import NayaDaur from "./pages/NayaDaur";

// Shared page-transition wrapper so every route enters/exits the same way.
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export function PageShell({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen w-full"
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/sadaabahaar" element={<Sadaabahaar />} />
        <Route path="/yaadein" element={<Yaadein />} />
        <Route path="/naya-daur" element={<NayaDaur />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    // AudioProvider sits above the router: the <audio> element it owns
    // never unmounts, so playback survives every navigation below.
    <AudioProvider>
      <BrowserRouter>
        <div className="relative min-h-screen bg-[#F0F4FA] text-slate-800">
          {/* Ambient lavender/sky wash behind all pages */}
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_-10%,#EDEAFB_0%,transparent_55%),radial-gradient(circle_at_100%_10%,#E3EEFB_0%,transparent_50%)]" />

          {/* Routed page content, transitions above the player */}
          <main className="pb-28">
            <AnimatedRoutes />
          </main>

          {/* Persistent floating player, always mounted */}
          <GlobalPlayer />
        </div>
      </BrowserRouter>
    </AudioProvider>
  );
}

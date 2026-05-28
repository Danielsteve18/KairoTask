import React from 'react';
import { motion } from 'framer-motion';

export const QuasarBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-transparent">
      
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,rgba(0,0,0,0)_60%)]" />

      {/* The Quasar Accretion Disk (Outer Glow) */}
      <motion.div
        className="absolute w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full opacity-60"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0%, rgba(99,102,241,0.1) 20%, rgba(168,85,247,0.4) 40%, rgba(236,72,153,0.8) 50%, rgba(168,85,247,0.4) 60%, rgba(99,102,241,0.1) 80%, transparent 100%)',
          filter: 'blur(40px)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* The Quasar Accretion Disk (Inner Bright Ring) */}
      <motion.div
        className="absolute w-[45vw] h-[45vw] max-w-[450px] max-h-[450px] rounded-full opacity-90 mix-blend-screen"
        style={{
          background: 'conic-gradient(from 180deg, transparent 0%, rgba(99,102,241,0.3) 20%, rgba(168,85,247,0.8) 40%, rgba(255,255,255,1) 50%, rgba(168,85,247,0.8) 60%, rgba(99,102,241,0.3) 80%, transparent 100%)',
          filter: 'blur(20px)',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Photon Ring (Very bright, thin edge just outside event horizon) */}
      <div className="absolute w-[28vw] h-[28vw] max-w-[280px] max-h-[280px] rounded-full border border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.6)]" />

      {/* The Event Horizon (Glassmorphism Core) */}
      <div className="absolute w-[28vw] h-[28vw] max-w-[280px] max-h-[280px] rounded-full bg-white/5 backdrop-blur-[12px] border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] z-0" />

      {/* Scattered stars being pulled in */}
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '100px 100px', opacity: 0.1, filter: 'blur(1px)' }} />
      
    </div>
  );
};

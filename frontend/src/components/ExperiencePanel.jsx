import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ExperiencePanel() {
  return (
    <motion.div
      custom={0.4}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
    >
      <p className="text-sm text-cyan-300">Experiência premium</p>
      <h3 className="mt-1 text-xl font-bold">Design do NexBiz</h3>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-sm text-slate-400">Estilo</p>
          <h4 className="mt-2 font-semibold">Glassmorphism</h4>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-sm text-slate-400">Animações</p>
          <h4 className="mt-2 font-semibold">Framer Motion</h4>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-sm text-slate-400">Componentes</p>
          <h4 className="mt-2 font-semibold">Cards premium</h4>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-sm text-slate-400">Identidade</p>
          <h4 className="mt-2 font-semibold">Visual único</h4>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 font-semibold text-slate-950 shadow-[0_0_30px_rgba(99,102,241,0.35)]"
      >
        Começar personalização
      </motion.button>
    </motion.div>
  );
}
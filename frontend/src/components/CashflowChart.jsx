import React from "react";
import { FiCalendar } from "react-icons/fi";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

function ChartMock() {
  const bars = [45, 72, 58, 90, 66, 78, 96, 82, 68, 88, 75, 92];

  return (
    <div className="mt-6 flex h-64 items-end gap-3 rounded-3xl border border-white/10 bg-slate-950/40 p-5">
      {bars.map((value, index) => (
        <motion.div
          key={index}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: `${value}%`, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.05 * index }}
          className="relative flex-1 overflow-hidden rounded-t-2xl bg-white/5"
        >
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-gradient-to-t from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_25px_rgba(56,189,248,0.35)]"
            style={{ height: `${value}%` }}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function CashflowChart() {
  return (
    <motion.div
      custom={0.2}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-cyan-300">Fluxo de caixa</p>
          <h3 className="mt-1 text-xl font-bold">Performance mensal</h3>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-300">
          <FiCalendar /> Últimos 12 meses
        </div>
      </div>
      <ChartMock />
    </motion.div>
  );
}
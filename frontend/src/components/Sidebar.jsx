import React from "react";
import { FiHome, FiTrendingUp, FiTrendingDown, FiPieChart, FiActivity } from "react-icons/fi";
import { motion } from "framer-motion";

const sidebarItems = [
  { icon: FiHome, label: "Dashboard", active: true },
  { icon: FiTrendingUp, label: "Receitas" },
  { icon: FiTrendingDown, label: "Despesas" },
  { icon: FiPieChart, label: "Relatórios" },
  { icon: FiActivity, label: "Insights IA" },
];

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="hidden w-72 border-r border-white/10 bg-white/5 px-5 py-6 backdrop-blur-2xl lg:block"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-xl font-black text-slate-950 shadow-[0_0_25px_rgba(59,130,246,0.45)]">
          N
        </div>
        <div>
          <h1 className="text-xl font-bold">NexBiz</h1>
          <p className="text-sm text-slate-400">Controle inteligente</p>
        </div>
      </div>

      <nav className="mt-10 space-y-2">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * index }}
              className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all ${
                item.active
                  ? "bg-gradient-to-r from-cyan-400/20 to-violet-500/20 text-white shadow-[0_0_30px_rgba(139,92,246,0.18)]"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="text-lg" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="mt-10 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-400/15 p-3">
            <FiActivity className="text-xl text-cyan-300" />
          </div>
          <div>
            <h3 className="font-semibold">IA Financeira</h3>
            <p className="text-sm text-slate-300">Insights automáticos</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          Detecte padrões, acompanhe tendências e receba alertas inteligentes sobre o caixa.
        </p>
      </div>
    </motion.aside>
  );
}
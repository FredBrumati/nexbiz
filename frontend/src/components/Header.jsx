import React from "react";
import { FiBell, FiSearch, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Painel principal</p>
          <h2 className="mt-2 text-2xl font-bold md:text-4xl">Visão geral do seu negócio</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">
            Uma interface premium, moderna e inteligente para visualizar receitas, despesas e previsões em tempo real.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
            <FiSearch className="text-slate-400" />
            <input
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 md:w-64"
              placeholder="Pesquisar movimentação"
            />
          </div>
          <button className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15">
            <FiBell /> Notificações
          </button>
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_25px_rgba(99,102,241,0.4)] transition hover:scale-[1.02]">
            <FiUser /> Meu perfil
          </button>
        </div>
      </div>
    </motion.header>
  );
}
import React from "react";
import { FiBarChart2 } from "react-icons/fi";
import { motion } from "framer-motion";

const insights = [
  "Sua receita cresceu nas últimas 3 semanas.",
  "Marketing está 14% acima da média mensal.",
  "Seu fluxo de caixa segue positivo para os próximos 15 dias.",
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function InsightsPanel() {
  return (
    <motion.div
      custom={0.28}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-violet-300">Insights inteligentes</p>
          <h3 className="mt-1 text-xl font-bold">Resumo da IA</h3>
        </div>
        <FiBarChart2 className="text-xl text-violet-300" />
      </div>

      <div className="mt-5 space-y-3">
        {insights.map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18 * index }}
            className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm leading-6 text-slate-200"
          >
            {item}
          </motion.div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
        <p className="text-sm font-medium text-emerald-300">Previsão positiva</p>
        <p className="mt-2 text-sm leading-6 text-slate-200">
          Mantendo o ritmo atual, o saldo projetado para o próximo ciclo é de <span className="font-semibold text-white">R$ 6.180,00</span>.
        </p>
      </div>
    </motion.div>
  );
}
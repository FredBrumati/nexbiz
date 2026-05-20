import React from "react";
import {
  FiZap,
  FiTarget,
  FiBell,
  FiTrendingUp,
  FiFileText,
  FiArrowRight,
  FiCpu,
} from "react-icons/fi";
import { motion } from "framer-motion";

const actions = [
  {
    title: "Analisar com IA",
    description: "Peça uma leitura rápida da saúde financeira.",
    icon: FiCpu,
    path: "/insights",
    color: "text-cyan-300",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
  },
  {
    title: "Criar meta",
    description: "Planeje reserva, investimento ou capital de giro.",
    icon: FiTarget,
    path: "/metas",
    color: "text-emerald-300",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  {
    title: "Ver relatórios",
    description: "Acompanhe receitas, despesas e categorias.",
    icon: FiFileText,
    path: "/relatorios",
    color: "text-violet-300",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
];

export default function ExperiencePanel() {
  function navigate(path) {
    window.location.href = path;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-cyan-300">Copiloto NexBiz</p>
            <h3 className="mt-1 text-2xl font-black">
              Próximas ações inteligentes
            </h3>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 p-3 text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.25)]">
            <FiZap className="text-2xl" />
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-300">
          Use os dados cadastrados para tomar decisões melhores. O NexBiz pode
          ajudar a identificar riscos, oportunidades e próximos passos.
        </p>

        <div className="mt-5 rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-400/15 p-3">
              <FiTrendingUp className="text-xl text-cyan-300" />
            </div>

            <div>
              <h4 className="font-bold text-white">Dica estratégica</h4>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                Cadastre movimentações por categoria para a IA gerar análises
                mais precisas sobre gastos, saldo e crescimento.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {actions.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.button
                key={item.title}
                type="button"
                onClick={() => navigate(item.path)}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className={`group flex w-full items-center justify-between rounded-2xl border ${item.border} ${item.bg} p-4 text-left transition hover:scale-[1.01] hover:bg-white/10`}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-950/40 p-3">
                    <Icon className={`text-xl ${item.color}`} />
                  </div>

                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </div>

                <FiArrowRight className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
              </motion.button>
            );
          })}
        </div>

        <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/40 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-yellow-400/10 p-3">
              <FiBell className="text-xl text-yellow-300" />
            </div>

            <div>
              <h4 className="font-bold text-white">Em breve</h4>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Alertas automáticos quando despesas passarem do orçamento,
                saldo cair ou uma categoria crescer demais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
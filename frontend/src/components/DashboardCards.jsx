import React, { useEffect, useState } from "react";
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiDollarSign,
  FiList,
} from "react-icons/fi";
import { motion } from "framer-motion";
import api from "../services/api";
import { formatMoney } from "../utils/formatters";

export default function DashboardCards() {
  const [summary, setSummary] = useState({
    receitas: 0,
    despesas: 0,
    saldo: 0,
    total_movimentacoes: 0,
  });

  useEffect(() => {
    carregarResumo();
  }, []);

  async function carregarResumo() {
    try {
      const response = await api.get("/dashboard/summary");
      setSummary(response.data);
    } catch (error) {
      console.error("Erro ao carregar resumo:", error);
    }
  }

  const cards = [
    {
      title: "Receitas",
      value: formatMoney(summary.receitas),
      subtitle: "Total recebido",
      icon: FiArrowUpRight,
      border: "border-emerald-400/30",
      bg: "bg-gradient-to-br from-emerald-400/20 to-emerald-500/5",
      iconColor: "text-emerald-300",
    },
    {
      title: "Despesas",
      value: formatMoney(summary.despesas),
      subtitle: "Total gasto",
      icon: FiArrowDownRight,
      border: "border-rose-400/30",
      bg: "bg-gradient-to-br from-rose-400/20 to-rose-500/5",
      iconColor: "text-rose-300",
    },
    {
      title: "Saldo",
      value: formatMoney(summary.saldo),
      subtitle: "Resultado atual",
      icon: FiDollarSign,
      border: "border-cyan-400/30",
      bg: "bg-gradient-to-br from-cyan-400/20 to-cyan-500/5",
      iconColor: "text-cyan-300",
    },
    {
      title: "Movimentações",
      value: summary.total_movimentacoes,
      subtitle: "Lançamentos cadastrados",
      icon: FiList,
      border: "border-violet-400/30",
      bg: "bg-gradient-to-br from-violet-400/20 to-violet-500/5",
      iconColor: "text-violet-300",
    },
  ];

  return (
    <section className="mt-6 grid gap-4 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className={`rounded-3xl border ${card.border} ${card.bg} p-6 backdrop-blur-xl transition-all duration-300`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-300">{card.title}</p>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl">
                  {card.value}
                </h2>
                <p className="mt-2 text-sm text-slate-400">{card.subtitle}</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-3">
                <Icon className={`text-2xl ${card.iconColor}`} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}
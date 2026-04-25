import React, { useEffect, useState } from "react";
import { FiArrowUpRight, FiArrowDownRight, FiDollarSign } from "react-icons/fi";
import { motion } from "framer-motion";
import api from "../services/api";

export default function DashboardCards() {
  const [summary, setSummary] = useState({
    receitas: 0,
    despesas: 0,
    saldo: 0,
  });

  useEffect(() => {
    api.get("/dashboard/summary")
      .then((response) => setSummary(response.data))
      .catch((error) => console.error("Erro ao buscar resumo:", error));
  }, []);

  const cards = [
    {
      title: "Receita do mês",
      value: `R$ ${summary.receitas.toFixed(2)}`,
      icon: FiArrowUpRight,
      border: "border-emerald-400/30",
      iconBg: "bg-emerald-400/15",
      iconColor: "text-emerald-300",
    },
    {
      title: "Despesas do mês",
      value: `R$ ${summary.despesas.toFixed(2)}`,
      icon: FiArrowDownRight,
      border: "border-rose-400/30",
      iconBg: "bg-rose-400/15",
      iconColor: "text-rose-300",
    },
    {
      title: "Saldo atual",
      value: `R$ ${summary.saldo.toFixed(2)}`,
      icon: FiDollarSign,
      border: "border-cyan-400/30",
      iconBg: "bg-cyan-400/15",
      iconColor: "text-cyan-300",
    },
  ];

  return (
    <section className="mt-6 grid gap-4 xl:grid-cols-3">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className={`rounded-3xl border ${card.border} bg-white/10 p-5 backdrop-blur-xl`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-300">{card.title}</p>
                <h3 className="mt-3 text-2xl font-bold text-white md:text-3xl">
                  {card.value}
                </h3>
              </div>

              <div className={`rounded-2xl ${card.iconBg} p-3`}>
                <Icon className={`text-2xl ${card.iconColor}`} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}
import React from "react";
import { FiTrendingUp, FiCreditCard } from "react-icons/fi";
import { motion } from "framer-motion";

const transactions = [
  {
    title: "Venda de serviços",
    category: "Receita • Consultoria",
    amount: "+R$ 2.800,00",
    positive: true,
  },
  {
    title: "Fornecedor mensal",
    category: "Despesa • Operacional",
    amount: "-R$ 1.150,00",
    positive: false,
  },
  {
    title: "Campanha de anúncios",
    category: "Despesa • Marketing",
    amount: "-R$ 640,00",
    positive: false,
  },
  {
    title: "Recebimento recorrente",
    category: "Receita • Assinatura",
    amount: "+R$ 1.960,00",
    positive: true,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function TransactionsList() {
  return (
    <motion.div
      custom={0.34}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-emerald-300">Movimentações</p>
          <h3 className="mt-1 text-xl font-bold">Últimas transações</h3>
        </div>
        <button className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
          Ver tudo
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {transactions.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * index }}
            whileHover={{ x: 4 }}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-4"
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-2xl p-3 ${item.positive ? "bg-emerald-400/15" : "bg-rose-400/15"}`}>
                {item.positive ? (
                  <FiTrendingUp className="text-lg text-emerald-300" />
                ) : (
                  <FiCreditCard className="text-lg text-rose-300" />
                )}
              </div>
              <div>
                <p className="font-medium text-white">{item.title}</p>
                <p className="text-sm text-slate-400">{item.category}</p>
              </div>
            </div>
            <p className={`font-semibold ${item.positive ? "text-emerald-300" : "text-rose-300"}`}>
              {item.amount}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
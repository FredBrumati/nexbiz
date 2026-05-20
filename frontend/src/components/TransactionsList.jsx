import React, { useEffect, useState } from "react";
import { FiCreditCard, FiTrendingUp } from "react-icons/fi";
import { motion } from "framer-motion";
import api from "../services/api";
import { formatMoney } from "../utils/formatters";

export default function TransactionsList() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [recentRes, categoriasRes] = await Promise.all([
        api.get("/dashboard/recent"),
        api.get("/categorias/"),
      ]);

      setMovimentacoes(recentRes.data);
      setCategorias(categoriasRes.data);
    } catch (error) {
      console.error("Erro ao carregar movimentações recentes:", error);
    }
  }

  function getCategoriaNome(id) {
    return categorias.find((cat) => cat.id === id)?.nome || "Categoria";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-emerald-300">Movimentações</p>
          <h3 className="mt-1 text-xl font-bold">Últimos lançamentos</h3>
        </div>

        <button
          onClick={() => (window.location.href = "/movimentacoes")}
          className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          Ver tudo
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {movimentacoes.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-center text-slate-400">
            Nenhuma movimentação cadastrada.
          </div>
        )}

        {movimentacoes.map((item, index) => {
          const positive = item.tipo === "receita";

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index }}
              whileHover={{ x: 4 }}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-2xl p-3 ${
                    positive ? "bg-emerald-400/15" : "bg-rose-400/15"
                  }`}
                >
                  {positive ? (
                    <FiTrendingUp className="text-lg text-emerald-300" />
                  ) : (
                    <FiCreditCard className="text-lg text-rose-300" />
                  )}
                </div>

                <div>
                  <p className="font-medium text-white">{item.descricao}</p>
                  <p className="text-sm text-slate-400">
                    {getCategoriaNome(item.categoria_id)} • {item.data_movimentacao}
                  </p>
                </div>
              </div>

              <p
                className={`text-xl font-black tracking-tight ${
                  positive ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {positive ? "+" : "-"} {formatMoney(item.valor)}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
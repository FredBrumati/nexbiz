import React, { useEffect, useState } from "react";
import { FiCalendar } from "react-icons/fi";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../services/api";
import { formatMoney } from "../utils/formatters";

export default function CashflowChart() {
  const [mensal, setMensal] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    carregarGraficos();
  }, []);

  async function carregarGraficos() {
    try {
      const [mensalRes, categoriasRes] = await Promise.all([
        api.get("/dashboard/mensal"),
        api.get("/dashboard/por-categoria"),
      ]);

      setMensal(mensalRes.data);
      setCategorias(categoriasRes.data);
    } catch (error) {
      console.error("Erro ao carregar gráficos:", error);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-cyan-300">Fluxo de caixa</p>
          <h3 className="mt-1 text-xl font-bold">Receitas x despesas</h3>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-300">
          <FiCalendar /> Dados Completos
        </div>
      </div>

      <div className="mt-6 h-80 rounded-3xl border border-white/10 bg-slate-950/40 p-4">
        {mensal.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-400">
            Nenhum dado mensal disponível.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mensal}>
              <defs>
                <linearGradient id="receitasColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="despesasColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="mes" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => `R$ ${value}`} />
              <Tooltip
                formatter={(value) => formatMoney(value)}
                contentStyle={{
                  background: "#020617",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "16px",
                  color: "#fff",
                }}
              />

              <Area
                type="monotone"
                dataKey="receitas"
                stroke="#34d399"
                fillOpacity={1}
                fill="url(#receitasColor)"
              />

              <Area
                type="monotone"
                dataKey="despesas"
                stroke="#fb7185"
                fillOpacity={1}
                fill="url(#despesasColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-6">
        <div>
          <p className="text-sm text-violet-300">Categorias</p>
          <h3 className="mt-1 text-lg font-bold">Totais por categoria</h3>
        </div>

        <div className="mt-4 h-72 rounded-3xl border border-white/10 bg-slate-950/40 p-4">
          {categorias.length === 0 ? (
            <div className="flex h-full items-center justify-center text-slate-400">
              Nenhuma categoria com movimentação.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorias}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="categoria" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip
                  formatter={(value) => formatMoney(value)}
                  contentStyle={{
                    background: "#020617",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "16px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="total" radius={[12, 12, 0, 0]} fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </motion.div>
  );
}
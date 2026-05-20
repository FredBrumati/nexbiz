import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { formatMoney } from "../utils/formatters";

export default function Relatorios() {
  const [mensal, setMensal] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarRelatorios();
  }, []);

  async function carregarRelatorios() {
    try {
      setLoading(true);
      setErro("");

      const [mensalRes, categoriasRes] = await Promise.all([
        api.get("/dashboard/mensal"),
        api.get("/dashboard/por-categoria"),
      ]);

      setMensal(mensalRes.data);
      setCategorias(categoriasRes.data);
    } catch (error) {
      setErro("Erro ao carregar relatórios.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[20%] h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[35%] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <main className="flex-1 px-4 py-6 md:px-8">
          <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
                Análise financeira
              </p>

              <h1 className="mt-2 text-3xl font-black md:text-5xl">
                Relatórios
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
                Visualize receitas, despesas, saldo mensal e distribuição por
                categoria com base nos dados reais cadastrados.
              </p>
            </div>

            <button
              onClick={carregarRelatorios}
              className="rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-bold text-slate-950"
            >
              {loading ? "Atualizando..." : "Atualizar"}
            </button>
          </header>

          {erro && (
            <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300">
              {erro}
            </div>
          )}

          <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl">
            <h2 className="text-2xl font-bold">Fluxo mensal</h2>

            <div className="mt-6 h-80 rounded-3xl border border-white/10 bg-slate-950/40 p-4">
              {mensal.length === 0 ? (
                <div className="flex h-full items-center justify-center text-slate-400">
                  Nenhum dado mensal disponível.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mensal}>
                    <defs>
                      <linearGradient
                        id="relReceitas"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#34d399"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#34d399"
                          stopOpacity={0}
                        />
                      </linearGradient>

                      <linearGradient
                        id="relDespesas"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#fb7185"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#fb7185"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.08)"
                    />
                    <XAxis dataKey="mes" stroke="#94a3b8" />
                    <YAxis
                      stroke="#94a3b8"
                      tickFormatter={(value) => `R$ ${value}`}
                    />
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
                      fill="url(#relReceitas)"
                    />

                    <Area
                      type="monotone"
                      dataKey="despesas"
                      stroke="#fb7185"
                      fillOpacity={1}
                      fill="url(#relDespesas)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl">
            <h2 className="text-2xl font-bold">Resumo mensal em barras</h2>

            <div className="mt-6 h-80 rounded-3xl border border-white/10 bg-slate-950/40 p-4">
              {mensal.length === 0 ? (
                <div className="flex h-full items-center justify-center text-slate-400">
                  Nenhum dado mensal disponível.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mensal}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.08)"
                    />
                    <XAxis dataKey="mes" stroke="#94a3b8" />
                    <YAxis
                      stroke="#94a3b8"
                      tickFormatter={(value) => `R$ ${value}`}
                    />
                    <Tooltip
                      formatter={(value) => formatMoney(value)}
                      contentStyle={{
                        background: "#020617",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "16px",
                        color: "#fff",
                      }}
                    />
                    <Bar
                      dataKey="receitas"
                      radius={[12, 12, 0, 0]}
                      fill="#34d399"
                    />
                    <Bar
                      dataKey="despesas"
                      radius={[12, 12, 0, 0]}
                      fill="#fb7185"
                    />
                    <Bar
                      dataKey="saldo"
                      radius={[12, 12, 0, 0]}
                      fill="#38bdf8"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl">
            <h2 className="text-2xl font-bold">Por categoria</h2>

            <div className="mt-4 space-y-3">
              {categorias.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-center text-slate-400">
                  Nenhuma categoria com movimentação.
                </div>
              )}

              {categorias.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 p-4"
                >
                  <div>
                    <h3 className="font-bold">{item.categoria}</h3>
                    <p
                      className={
                        item.tipo === "receita"
                          ? "text-emerald-300"
                          : "text-rose-300"
                      }
                    >
                      {item.tipo}
                    </p>
                  </div>

                  <strong className="text-xl tracking-tight">
                    {formatMoney(item.total)}
                  </strong>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
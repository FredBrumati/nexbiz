import React, { useEffect, useState } from "react";
import { FiActivity, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

export default function Insights() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    carregarInsights();
  }, []);

  async function carregarInsights() {
    const res = await api.get("/insights/");
    setDados(res.data);
  }

  if (!dados) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-8">Carregando insights...</main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 px-4 py-6 md:px-8">
          <h1 className="text-4xl font-black">Insights IA</h1>
          <p className="mt-2 text-slate-400">
            Análises automáticas baseadas no seu comportamento financeiro.
          </p>

          <section className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-5">
              <p className="text-sm text-emerald-200">Receitas</p>
              <h2 className="mt-2 text-2xl font-bold">R$ {dados.receitas.toFixed(2)}</h2>
            </div>

            <div className="rounded-3xl border border-rose-400/30 bg-rose-400/10 p-5">
              <p className="text-sm text-rose-200">Despesas</p>
              <h2 className="mt-2 text-2xl font-bold">R$ {dados.despesas.toFixed(2)}</h2>
            </div>

            <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-5">
              <p className="text-sm text-cyan-200">Saldo</p>
              <h2 className="mt-2 text-2xl font-bold">R$ {dados.saldo.toFixed(2)}</h2>
            </div>
          </section>

          <section className="mt-6 grid gap-4">
            {dados.insights.map((insight, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
              >
                <div className="flex items-center gap-3">
                  {insight.nivel === "alto" ? (
                    <FiAlertTriangle className="text-2xl text-red-300" />
                  ) : insight.nivel === "medio" ? (
                    <FiActivity className="text-2xl text-yellow-300" />
                  ) : (
                    <FiCheckCircle className="text-2xl text-emerald-300" />
                  )}

                  <div>
                    <h3 className="text-xl font-bold">{insight.titulo}</h3>
                    <p className="mt-1 text-slate-300">{insight.descricao}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
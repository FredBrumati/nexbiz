import React, { useEffect, useState } from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle,
  FiCpu,
  FiRefreshCw,
} from "react-icons/fi";
import { motion } from "framer-motion";
import api from "../services/api";

function getNivelStyle(nivel) {
  if (nivel === "alto") {
    return {
      icon: FiAlertTriangle,
      border: "border-red-400/30",
      bg: "bg-red-500/10",
      text: "text-red-300",
    };
  }

  if (nivel === "medio") {
    return {
      icon: FiActivity,
      border: "border-yellow-400/30",
      bg: "bg-yellow-500/10",
      text: "text-yellow-300",
    };
  }

  return {
    icon: FiCheckCircle,
    border: "border-emerald-400/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-300",
  };
}

export default function InsightsPanel() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarIA();
  }, []);

  async function carregarIA() {
    try {
      setLoading(true);
      const response = await api.get("/ia/dashboard-comentarios");
      setDados(response.data.analise);
    } catch (error) {
      console.error("Erro ao carregar IA:", error);
      setDados({
        comentario_principal: "Não foi possível carregar a análise da IA.",
        risco: "medio",
        pontuacao_saude: 50,
        insights: [],
        recomendacoes: [],
      });
    } finally {
      setLoading(false);
    }
  }

  const risco = dados?.risco || "medio";
  const riscoStyle = getNivelStyle(risco);
  const RiscoIcon = riscoStyle.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-violet-300">IA financeira</p>
          <h3 className="mt-1 text-xl font-bold">Comentários inteligentes</h3>
        </div>

        <button
          onClick={carregarIA}
          className="rounded-2xl border border-white/10 bg-slate-950/40 p-3 text-slate-300 transition hover:bg-white/10"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {!dados ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-5 text-slate-400">
          Analisando dados financeiros...
        </div>
      ) : (
        <>
          <div className={`mt-6 rounded-3xl border ${riscoStyle.border} ${riscoStyle.bg} p-5`}>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3">
                <RiscoIcon className={`text-2xl ${riscoStyle.text}`} />
              </div>

              <div>
                <p className={`text-sm font-semibold ${riscoStyle.text}`}>
                  Risco {risco}
                </p>
                <h4 className="text-3xl font-black">
                  {dados.pontuacao_saude || 0}/100
                </h4>
              </div>
            </div>

            <p className="mt-4 leading-6 text-slate-200">
              {dados.comentario_principal}
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {dados.insights?.map((item, index) => {
              const style = getNivelStyle(item.nivel);
              const Icon = style.icon;

              return (
                <div
                  key={index}
                  className={`rounded-2xl border ${style.border} ${style.bg} p-4`}
                >
                  <div className="flex gap-3">
                    <Icon className={`mt-1 text-xl ${style.text}`} />
                    <div>
                      <h4 className="font-bold">{item.titulo}</h4>
                      <p className="mt-1 text-sm leading-6 text-slate-300">
                        {item.descricao}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-5">
            <div className="flex items-center gap-2">
              <FiCpu className="text-cyan-300" />
              <h4 className="font-bold text-cyan-300">Recomendações da IA</h4>
            </div>

            <div className="mt-3 space-y-2">
              {dados.recomendacoes?.map((item, index) => (
                <p key={index} className="rounded-2xl bg-slate-950/40 p-3 text-sm text-slate-200">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
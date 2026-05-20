import React, { useEffect, useRef, useState } from "react";
import {
  FiMessageCircle,
  FiSend,
  FiX,
  FiCpu,
  FiMinimize2,
  FiTrash2,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

function getErrorMessage(error) {
  const detail = error.response?.data?.detail;

  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).join(" | ");
  }

  return "Não foi possível conversar com a IA agora.";
}

export default function FloatingGroqChat() {
  const [aberto, setAberto] = useState(false);
  const [minimizado, setMinimizado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const [mensagens, setMensagens] = useState([
    {
      role: "assistant",
      content:
        "Olá, eu sou a IA financeira do NexBiz. Posso analisar suas receitas, despesas, saldo, categorias e movimentações recentes. O que você quer entender?",
    },
  ]);

  const fimRef = useRef(null);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, loading, aberto]);

  async function enviarMensagem(e) {
    e.preventDefault();

    const texto = mensagem.trim();

    if (!texto || loading) return;

    const novaMensagemUsuario = {
      role: "user",
      content: texto,
    };

    const historicoAtualizado = [...mensagens, novaMensagemUsuario];

    setMensagens(historicoAtualizado);
    setMensagem("");
    setLoading(true);

    try {
      const response = await api.post("/ia/chat", {
        mensagem: texto,
        historico: historicoAtualizado.slice(-10),
      });

      const respostaIA = {
        role: "assistant",
        content: response.data.resposta,
      };

      setMensagens((prev) => [...prev, respostaIA]);
    } catch (error) {
      setMensagens((prev) => [
        ...prev,
        {
          role: "assistant",
          content: getErrorMessage(error),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function limparChat() {
    setMensagens([
      {
        role: "assistant",
        content:
          "Chat reiniciado. Me pergunte algo sobre seus dados financeiros.",
      },
    ]);
  }

  return (
    <>
      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 text-white shadow-[0_0_60px_rgba(34,211,238,0.18)] backdrop-blur-2xl md:right-8 md:w-[430px]"
          >
            <div className="border-b border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-slate-950">
                    <FiCpu className="text-xl" />
                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                  </div>

                  <div>
                    <h3 className="font-bold">NexBiz IA</h3>
                    <p className="text-xs text-slate-400">
                      Chat financeiro com Groq
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={limparChat}
                    className="rounded-xl border border-white/10 bg-slate-900/70 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                    title="Limpar conversa"
                  >
                    <FiTrash2 />
                  </button>

                  <button
                    type="button"
                    onClick={() => setMinimizado((prev) => !prev)}
                    className="rounded-xl border border-white/10 bg-slate-900/70 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                    title="Minimizar"
                  >
                    <FiMinimize2 />
                  </button>

                  <button
                    type="button"
                    onClick={() => setAberto(false)}
                    className="rounded-xl border border-white/10 bg-slate-900/70 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                    title="Fechar"
                  >
                    <FiX />
                  </button>
                </div>
              </div>
            </div>

            {!minimizado && (
              <>
                <div className="max-h-[460px] min-h-[360px] space-y-4 overflow-y-auto p-4">
                  {mensagens.map((item, index) => {
                    const isUser = item.role === "user";

                    return (
                      <div
                        key={`${item.role}-${index}`}
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                            isUser
                              ? "bg-gradient-to-r from-cyan-400 to-violet-500 font-medium text-slate-950"
                              : "border border-white/10 bg-white/5 text-slate-200"
                          }`}
                        >
                          {item.content}
                        </div>
                      </div>
                    );
                  })}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
                          Analisando seus dados...
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={fimRef} />
                </div>

                <div className="border-t border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {[
                      "Como está meu saldo?",
                      "Qual minha maior despesa?",
                      "Me dê uma recomendação",
                    ].map((sugestao) => (
                      <button
                        key={sugestao}
                        type="button"
                        onClick={() => setMensagem(sugestao)}
                        className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200 transition hover:bg-cyan-500/20"
                      >
                        {sugestao}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={enviarMensagem} className="flex gap-2">
                    <input
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      placeholder="Pergunte sobre seus dados financeiros..."
                      className="flex-1 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                    />

                    <button
                      type="submit"
                      disabled={loading || !mensagem.trim()}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FiSend />
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => {
          setAberto((prev) => !prev);
          setMinimizado(false);
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-6 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.35)] md:right-8"
      >
        {aberto ? <FiX className="text-2xl" /> : <FiMessageCircle className="text-2xl" />}
      </motion.button>
    </>
  );
}
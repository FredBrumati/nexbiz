import React, { useState } from "react";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");

    try {
      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      localStorage.setItem("nexbiz_token", response.data.access_token);
      localStorage.setItem("nexbiz_user", JSON.stringify(response.data.usuario));

      window.location.href = "/dashboard";
    } catch (error) {
      setErro("E-mail ou senha inválidos.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-10%] bottom-[-10%] h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-2xl shadow-2xl"
      >
        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-2xl font-black text-slate-950">
            N
          </div>
          <h1 className="text-3xl font-bold">Entrar no NexBiz</h1>
          <p className="mt-2 text-sm text-slate-300">
            Acesse seu painel financeiro inteligente.
          </p>
        </div>

        {erro && (
          <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300">
            {erro}
          </div>
        )}

        <label className="mb-2 block text-sm text-slate-300">E-mail</label>
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
          <FiMail className="text-slate-400" />
          <input
            type="email"
            className="w-full bg-transparent outline-none placeholder:text-slate-500"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label className="mb-2 block text-sm text-slate-300">Senha</label>
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
          <FiLock className="text-slate-400" />
          <input
            type="password"
            className="w-full bg-transparent outline-none placeholder:text-slate-500"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 font-bold text-slate-950 transition hover:scale-[1.02]">
          Entrar <FiArrowRight />
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">
          Não tem conta?{" "}
          <a href="/cadastro" className="font-semibold text-cyan-300">
            Criar conta
          </a>
        </p>
      </motion.form>
    </div>
  );
}
import React, { useState } from "react";
import { FiUser, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import api from "../services/api";

function getErrorMessage(error) {
  const detail = error.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        const campo = item.loc?.join(" > ");
        return campo ? `${campo}: ${item.msg}` : item.msg;
      })
      .join(" | ");
  }

  return "Não foi possível criar a conta. Verifique os dados.";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setErro("");

    const nomeTratado = nome.trim();
    const emailTratado = email.trim().toLowerCase();

    if (!nomeTratado) {
      setErro("Informe seu nome.");
      return;
    }

    if (nomeTratado.length < 2) {
      setErro("O nome precisa ter pelo menos 2 caracteres.");
      return;
    }

    if (!emailTratado) {
      setErro("Informe seu e-mail.");
      return;
    }

    if (!isValidEmail(emailTratado)) {
      setErro("Informe um e-mail válido.");
      return;
    }

    if (!senha) {
      setErro("Informe uma senha.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (senha.length > 72) {
      setErro("A senha não pode ter mais de 72 caracteres.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        nome: nomeTratado,
        email: emailTratado,
        senha,
      });

      window.location.href = "/";
    } catch (error) {
      setErro(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute left-[30%] top-[20%] h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <motion.form
        onSubmit={handleRegister}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl"
      >
        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-2xl font-black text-slate-950 shadow-[0_0_30px_rgba(45,212,191,0.25)]">
            N
          </div>

          <h1 className="text-3xl font-bold">Criar conta</h1>

          <p className="mt-2 text-sm text-slate-300">
            Comece a organizar suas finanças com inteligência.
          </p>
        </div>

        {erro && (
          <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300">
            {erro}
          </div>
        )}

        <label className="mb-2 block text-sm text-slate-300">Nome</label>
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 transition focus-within:border-cyan-400">
          <FiUser className="text-slate-400" />

          <input
            className="w-full bg-transparent outline-none placeholder:text-slate-500"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="name"
          />
        </div>

        <label className="mb-2 block text-sm text-slate-300">E-mail</label>
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 transition focus-within:border-cyan-400">
          <FiMail className="text-slate-400" />

          <input
            type="email"
            className="w-full bg-transparent outline-none placeholder:text-slate-500"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <label className="mb-2 block text-sm text-slate-300">Senha</label>
        <div className="mb-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 transition focus-within:border-cyan-400">
          <FiLock className="text-slate-400" />

          <input
            type={mostrarSenha ? "text" : "password"}
            className="w-full bg-transparent outline-none placeholder:text-slate-500"
            placeholder="Crie uma senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="new-password"
          />

          <button
            type="button"
            onClick={() => setMostrarSenha((prev) => !prev)}
            className="text-slate-400 transition hover:text-white"
          >
            {mostrarSenha ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <p className="mb-6 text-xs text-slate-500">
          A senha deve ter pelo menos 6 caracteres.
        </p>

        <button
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-4 py-3 font-bold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Criando conta..." : "Criar conta"}
          {!loading && <FiArrowRight />}
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">
          Já tem conta?{" "}
          <a href="/" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
            Entrar
          </a>
        </p>
      </motion.form>
    </div>
  );
}
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiFilter,
  FiPlus,
  FiRefreshCw,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";
import api from "../services/api";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay },
  }),
};

function formatMoney(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function Movimentacoes() {
  const [categorias, setCategorias] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [form, setForm] = useState({
    categoria_id: "",
    tipo: "receita",
    descricao: "",
    valor: "",
    data_movimentacao: "",
    forma_pagamento: "Pix",
    observacao: "",
  });

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);
      setErro("");

      const [categoriasRes, movimentacoesRes] = await Promise.all([
        api.get("/categorias/"),
        api.get("/movimentacoes/"),
      ]);

      setCategorias(categoriasRes.data);
      setMovimentacoes(movimentacoesRes.data);
    } catch {
      setErro("Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!form.categoria_id || !form.descricao || !form.valor || !form.data_movimentacao) {
      setErro("Preencha categoria, descrição, valor e data.");
      return;
    }

    try {
      await api.post("/movimentacoes/", {
        ...form,
        categoria_id: Number(form.categoria_id),
        valor: Number(form.valor),
      });

      setForm({
        categoria_id: "",
        tipo: "receita",
        descricao: "",
        valor: "",
        data_movimentacao: "",
        forma_pagamento: "Pix",
        observacao: "",
      });

      carregarDados();
    } catch {
      setErro("Erro ao salvar movimentação. Verifique os dados.");
    }
  }

  const resumo = useMemo(() => {
    const receitas = movimentacoes
      .filter((mov) => mov.tipo === "receita")
      .reduce((acc, mov) => acc + Number(mov.valor), 0);

    const despesas = movimentacoes
      .filter((mov) => mov.tipo === "despesa")
      .reduce((acc, mov) => acc + Number(mov.valor), 0);

    return {
      receitas,
      despesas,
      saldo: receitas - despesas,
    };
  }, [movimentacoes]);

  const categoriasFiltradas = categorias.filter((cat) => cat.tipo === form.tipo);

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[20%] h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[35%] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 md:px-8">
        <motion.header
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl md:flex-row md:items-center md:justify-between"
        >
          <div>
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <FiArrowLeft /> Voltar ao dashboard
            </button>

            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
              Controle financeiro
            </p>

            <h1 className="mt-2 text-3xl font-black md:text-5xl">
              Movimentações
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">
              Cadastre receitas e despesas, acompanhe lançamentos e mantenha o fluxo de caixa organizado.
            </p>
          </div>

          <button
            onClick={carregarDados}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-bold text-slate-950 shadow-[0_0_30px_rgba(99,102,241,0.35)] transition hover:scale-[1.02]"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Atualizar
          </button>
        </motion.header>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-5 backdrop-blur-xl">
            <p className="text-sm text-emerald-200">Receitas</p>
            <h2 className="mt-2 text-2xl font-bold">{formatMoney(resumo.receitas)}</h2>
          </div>

          <div className="rounded-3xl border border-rose-400/30 bg-rose-400/10 p-5 backdrop-blur-xl">
            <p className="text-sm text-rose-200">Despesas</p>
            <h2 className="mt-2 text-2xl font-bold">{formatMoney(resumo.despesas)}</h2>
          </div>

          <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-5 backdrop-blur-xl">
            <p className="text-sm text-cyan-200">Saldo</p>
            <h2 className="mt-2 text-2xl font-bold">{formatMoney(resumo.saldo)}</h2>
          </div>
        </section>

        {erro && (
          <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300">
            {erro}
          </div>
        )}

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.form
            onSubmit={handleSubmit}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-violet-300">Novo lançamento</p>
                <h2 className="text-2xl font-bold">Cadastrar movimentação</h2>
              </div>
              <FiPlus className="text-2xl text-violet-300" />
            </div>

            <div className="space-y-4">
              <select
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value, categoria_id: "" })}
              >
                <option value="receita">Receita</option>
                <option value="despesa">Despesa</option>
              </select>

              <select
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                value={form.categoria_id}
                onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
              >
                <option value="">Selecione uma categoria</option>
                {categoriasFiltradas.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>

              <input
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                placeholder="Descrição"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              />

              <input
                type="number"
                step="0.01"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                placeholder="Valor"
                value={form.valor}
                onChange={(e) => setForm({ ...form, valor: e.target.value })}
              />

              <input
                type="date"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                value={form.data_movimentacao}
                onChange={(e) => setForm({ ...form, data_movimentacao: e.target.value })}
              />

              <select
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                value={form.forma_pagamento}
                onChange={(e) => setForm({ ...form, forma_pagamento: e.target.value })}
              >
                <option value="Pix">Pix</option>
                <option value="Cartão">Cartão</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Boleto">Boleto</option>
                <option value="Transferência">Transferência</option>
              </select>

              <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-bold text-slate-950">
                <FiPlus /> Salvar movimentação
              </button>
            </div>
          </motion.form>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-300">Histórico</p>
                <h2 className="text-2xl font-bold">Últimas movimentações</h2>
              </div>
              <FiFilter className="text-2xl text-slate-300" />
            </div>

            <div className="space-y-3">
              {movimentacoes.map((mov) => {
                const isReceita = mov.tipo === "receita";
                const categoria = categorias.find((cat) => cat.id === mov.categoria_id);

                return (
                  <div
                    key={mov.id}
                    className="rounded-2xl border border-white/10 bg-slate-950/50 p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-bold text-white">{mov.descricao}</h3>
                        <p className="mt-1 text-sm text-slate-400">
                          {categoria?.nome || "Categoria"} • {mov.forma_pagamento || "Sem forma"}
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <p className={`text-lg font-black ${isReceita ? "text-emerald-300" : "text-rose-300"}`}>
                          {isReceita ? "+" : "-"} {formatMoney(mov.valor)}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-sm text-slate-400 md:justify-end">
                          <FiCalendar /> {mov.data_movimentacao}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
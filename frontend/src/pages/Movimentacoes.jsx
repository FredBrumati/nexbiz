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
  FiTrendingUp,
  FiTrash2,
  FiZap,
} from "react-icons/fi";
import api from "../services/api";
import {
  formatMoney,
  moneyInputMask,
  parseMoney,
} from "../utils/formatters";

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

  return "Erro ao processar solicitação.";
}

export default function Movimentacoes() {
  const [categorias, setCategorias] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [iaLoading, setIaLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [form, setForm] = useState({
    categoria_id: "",
    tipo: "receita",
    descricao: "",
    valor: "",
    data_movimentacao: "",
    forma_pagamento: "Pix",
    observacao: "",
  });

  const [filtros, setFiltros] = useState({
    tipo: "",
    categoria_id: "",
    data_inicio: "",
    data_fim: "",
  });

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);
      setErro("");

      const params = {};

      if (filtros.tipo) params.tipo = filtros.tipo;
      if (filtros.categoria_id) params.categoria_id = filtros.categoria_id;
      if (filtros.data_inicio) params.data_inicio = filtros.data_inicio;
      if (filtros.data_fim) params.data_fim = filtros.data_fim;

      const [categoriasRes, movimentacoesRes] = await Promise.all([
        api.get("/categorias/"),
        api.get("/movimentacoes/", { params }),
      ]);

      setCategorias(categoriasRes.data);
      setMovimentacoes(movimentacoesRes.data);
    } catch (error) {
      setErro(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function sugerirComIA() {
    setErro("");
    setSucesso("");

    if (!form.descricao.trim()) {
      setErro("Digite uma descrição antes de usar a IA.");
      return;
    }

    try {
      setIaLoading(true);

      const response = await api.get("/ia/classificar", {
        params: {
          descricao: form.descricao,
        },
      });

      const resultado = response.data.resultado;

      setForm((prev) => ({
        ...prev,
        tipo: resultado.tipo || prev.tipo,
        categoria_id: response.data.categoria_id || prev.categoria_id,
      }));

      setSucesso(
        `IA sugeriu: ${resultado.tipo || "tipo não identificado"} / ${
          resultado.categoria_nome || "categoria não encontrada"
        }`
      );
    } catch (error) {
      setErro(getErrorMessage(error));
    } finally {
      setIaLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (
      !form.categoria_id ||
      !form.descricao.trim() ||
      !form.valor ||
      !form.data_movimentacao
    ) {
      setErro("Preencha categoria, descrição, valor e data.");
      return;
    }

    const valorConvertido = parseMoney(form.valor);

    if (valorConvertido <= 0) {
      setErro("O valor precisa ser maior que zero.");
      return;
    }

    if (valorConvertido > 10000000) {
      setErro("O valor máximo permitido é R$ 10.000.000,00.");
      return;
    }

    const payload = {
      categoria_id: Number(form.categoria_id),
      tipo: form.tipo,
      descricao: form.descricao.trim(),
      valor: valorConvertido,
      data_movimentacao: form.data_movimentacao,
      forma_pagamento: form.forma_pagamento || null,
      observacao: form.observacao?.trim() || null,
    };

    try {
      await api.post("/movimentacoes/", payload);

      setForm({
        categoria_id: "",
        tipo: "receita",
        descricao: "",
        valor: "",
        data_movimentacao: "",
        forma_pagamento: "Pix",
        observacao: "",
      });

      setSucesso("Movimentação criada com sucesso.");
      carregarDados();
    } catch (error) {
      setErro(getErrorMessage(error));
    }
  }

  async function deletarMovimentacao(id) {
    if (!window.confirm("Deseja excluir esta movimentação?")) return;

    try {
      setErro("");
      setSucesso("");

      await api.delete(`/movimentacoes/${id}`);

      setSucesso("Movimentação excluída com sucesso.");
      carregarDados();
    } catch (error) {
      setErro(getErrorMessage(error));
    }
  }

  function limparFiltros() {
    setFiltros({
      tipo: "",
      categoria_id: "",
      data_inicio: "",
      data_fim: "",
    });

    setTimeout(() => carregarDados(), 100);
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

  const categoriasFiltradasForm = categorias.filter(
    (cat) => cat.tipo === form.tipo
  );

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[20%] h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[35%] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 md:px-8">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
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
              Cadastre receitas e despesas, use IA para sugerir categorias e
              acompanhe seu fluxo financeiro.
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
          <div className="rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-emerald-400/20 to-emerald-500/5 p-5">
            <p className="text-sm text-emerald-200">Receitas filtradas</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
              {formatMoney(resumo.receitas)}
            </h2>
          </div>

          <div className="rounded-3xl border border-rose-400/30 bg-gradient-to-br from-rose-400/20 to-rose-500/5 p-5">
            <p className="text-sm text-rose-200">Despesas filtradas</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
              {formatMoney(resumo.despesas)}
            </h2>
          </div>

          <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/20 to-cyan-500/5 p-5">
            <p className="text-sm text-cyan-200">Saldo filtrado</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
              {formatMoney(resumo.saldo)}
            </h2>
          </div>
        </section>

        {erro && (
          <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            {sucesso}
          </div>
        )}

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl">
          <div className="mb-4 flex items-center gap-3">
            <FiFilter className="text-cyan-300" />
            <h2 className="text-xl font-bold">Filtros</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            <select
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              value={filtros.tipo}
              onChange={(e) =>
                setFiltros({ ...filtros, tipo: e.target.value })
              }
            >
              <option value="">Todos os tipos</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
            </select>

            <select
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              value={filtros.categoria_id}
              onChange={(e) =>
                setFiltros({ ...filtros, categoria_id: e.target.value })
              }
            >
              <option value="">Todas categorias</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome} ({cat.tipo})
                </option>
              ))}
            </select>

            <input
              type="date"
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              value={filtros.data_inicio}
              onChange={(e) =>
                setFiltros({ ...filtros, data_inicio: e.target.value })
              }
            />

            <input
              type="date"
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              value={filtros.data_fim}
              onChange={(e) =>
                setFiltros({ ...filtros, data_fim: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={carregarDados}
                className="rounded-2xl bg-cyan-500 px-4 py-3 font-bold text-slate-950"
              >
                Filtrar
              </button>

              <button
                type="button"
                onClick={limparFiltros}
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-bold text-white"
              >
                Limpar
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            onSubmit={handleSubmit}
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
                onChange={(e) =>
                  setForm({
                    ...form,
                    tipo: e.target.value,
                    categoria_id: "",
                  })
                }
              >
                <option value="receita">Receita</option>
                <option value="despesa">Despesa</option>
              </select>

              <select
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                value={form.categoria_id}
                onChange={(e) =>
                  setForm({ ...form, categoria_id: e.target.value })
                }
              >
                <option value="">Selecione uma categoria</option>
                {categoriasFiltradasForm.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>

              <input
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                placeholder="Descrição. Ex: paguei anúncio no Instagram"
                value={form.descricao}
                onChange={(e) =>
                  setForm({ ...form, descricao: e.target.value })
                }
              />

              <button
                type="button"
                onClick={sugerirComIA}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-5 py-3 font-bold text-cyan-300 transition hover:bg-cyan-500/20"
              >
                <FiZap className={iaLoading ? "animate-pulse" : ""} />
                {iaLoading ? "Analisando com IA..." : "Sugerir categoria com IA"}
              </button>

              <div className="relative">
                <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300" />

                <input
                  type="text"
                  className="w-full rounded-2xl border border-cyan-400/20 bg-slate-950/70 py-3 pl-12 pr-4 text-xl font-bold tracking-wide text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                  placeholder="0,00"
                  value={form.valor}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      valor: moneyInputMask(e.target.value),
                    })
                  }
                />
              </div>

              <input
                type="date"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                value={form.data_movimentacao}
                onChange={(e) =>
                  setForm({ ...form, data_movimentacao: e.target.value })
                }
              />

              <select
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                value={form.forma_pagamento}
                onChange={(e) =>
                  setForm({ ...form, forma_pagamento: e.target.value })
                }
              >
                <option value="Pix">Pix</option>
                <option value="Cartão">Cartão</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Boleto">Boleto</option>
                <option value="Transferência">Transferência</option>
              </select>

              <textarea
                className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                placeholder="Observação opcional"
                rows="3"
                value={form.observacao}
                onChange={(e) =>
                  setForm({ ...form, observacao: e.target.value })
                }
              />

              <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-bold text-slate-950">
                <FiPlus /> Salvar movimentação
              </button>
            </div>
          </form>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-300">Histórico</p>
                <h2 className="text-2xl font-bold">Últimas movimentações</h2>
              </div>

              <FiFilter className="text-2xl text-slate-300" />
            </div>

            <div className="space-y-3">
              {movimentacoes.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-6 text-center text-slate-400">
                  Nenhuma movimentação encontrada.
                </div>
              )}

              {movimentacoes.map((mov) => {
                const isReceita = mov.tipo === "receita";
                const categoria = categorias.find(
                  (cat) => cat.id === mov.categoria_id
                );

                return (
                  <div
                    key={mov.id}
                    className="rounded-2xl border border-white/10 bg-slate-950/50 p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`rounded-2xl p-3 ${
                            isReceita
                              ? "bg-emerald-400/15"
                              : "bg-rose-400/15"
                          }`}
                        >
                          {isReceita ? (
                            <FiTrendingUp className="text-xl text-emerald-300" />
                          ) : (
                            <FiCreditCard className="text-xl text-rose-300" />
                          )}
                        </div>

                        <div>
                          <h3 className="font-bold text-white">
                            {mov.descricao}
                          </h3>

                          <p className="mt-1 text-sm text-slate-400">
                            {categoria?.nome || "Categoria"} •{" "}
                            {mov.forma_pagamento || "Sem forma"}
                          </p>
                        </div>
                      </div>

                      <div className="text-left md:text-right">
                        <p
                          className={`text-2xl font-black tracking-tight ${
                            isReceita
                              ? "text-emerald-300"
                              : "text-rose-300"
                          }`}
                        >
                          {isReceita ? "+" : "-"} {formatMoney(mov.valor)}
                        </p>

                        <p className="mt-1 flex items-center gap-2 text-sm text-slate-400 md:justify-end">
                          <FiCalendar /> {mov.data_movimentacao}
                        </p>

                        <button
                          onClick={() => deletarMovimentacao(mov.id)}
                          className="mt-2 inline-flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300 hover:bg-red-500/20"
                        >
                          <FiTrash2 /> Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
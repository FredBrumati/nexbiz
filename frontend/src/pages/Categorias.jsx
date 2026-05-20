import React, { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiTag, FiRefreshCw } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
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

  return "Erro ao processar a categoria.";
}

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [form, setForm] = useState({
    nome: "",
    tipo: "receita",
  });

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    try {
      setLoading(true);
      setErro("");

      const response = await api.get("/categorias/");
      setCategorias(response.data);
    } catch (error) {
      setErro(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function criarCategoria(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const nomeTratado = form.nome.trim();

    if (!nomeTratado) {
      setErro("Informe o nome da categoria.");
      return;
    }

    if (!["receita", "despesa"].includes(form.tipo)) {
      setErro("Tipo inválido. Use receita ou despesa.");
      return;
    }

    try {
      await api.post("/categorias/", {
        nome: nomeTratado,
        tipo: form.tipo,
      });

      setForm({
        nome: "",
        tipo: "receita",
      });

      setSucesso("Categoria criada com sucesso.");
      carregarCategorias();
    } catch (error) {
      setErro(getErrorMessage(error));
    }
  }

  async function deletarCategoria(id) {
    const confirmar = window.confirm("Deseja excluir esta categoria?");

    if (!confirmar) return;

    try {
      setErro("");
      setSucesso("");

      await api.delete(`/categorias/${id}`);

      setSucesso("Categoria excluída com sucesso.");
      carregarCategorias();
    } catch (error) {
      setErro(getErrorMessage(error));
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
          <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
                Organização financeira
              </p>

              <h1 className="mt-2 text-3xl font-black md:text-5xl">
                Categorias
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">
                Crie categorias para separar receitas e despesas, facilitando
                filtros, relatórios e análises da IA.
              </p>
            </div>

            <button
              onClick={carregarCategorias}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-bold text-slate-950 shadow-[0_0_30px_rgba(99,102,241,0.35)] transition hover:scale-[1.02]"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              Atualizar
            </button>
          </header>

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

          <form
            onSubmit={criarCategoria}
            className="mt-6 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl md:grid-cols-[1fr_180px_160px]"
          >
            <input
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500 transition focus:border-cyan-400"
              placeholder="Ex: Vendas, Marketing, Aluguel..."
              value={form.nome}
              onChange={(e) =>
                setForm({
                  ...form,
                  nome: e.target.value,
                })
              }
            />

            <select
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              value={form.tipo}
              onChange={(e) =>
                setForm({
                  ...form,
                  tipo: e.target.value,
                })
              }
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>

            <button className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 font-bold text-slate-950 transition hover:scale-[1.02]">
              <FiPlus />
              Criar
            </button>
          </form>

          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categorias.length === 0 && !loading && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-400 backdrop-blur-2xl">
                Nenhuma categoria cadastrada ainda.
              </div>
            )}

            {categorias.map((cat) => {
              const isReceita = cat.tipo === "receita";

              return (
                <div
                  key={cat.id}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl transition hover:bg-white/10"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-2xl p-3 ${
                          isReceita
                            ? "bg-emerald-400/15"
                            : "bg-rose-400/15"
                        }`}
                      >
                        <FiTag
                          className={`text-xl ${
                            isReceita
                              ? "text-emerald-300"
                              : "text-rose-300"
                          }`}
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-white">{cat.nome}</h3>
                        <p
                          className={
                            isReceita ? "text-emerald-300" : "text-rose-300"
                          }
                        >
                          {cat.tipo}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => deletarCategoria(cat.id)}
                      className="rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-red-300 transition hover:bg-red-500/20"
                      title="Excluir categoria"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        </main>
      </div>
    </div>
  );
}
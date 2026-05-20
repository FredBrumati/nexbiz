import os
import json
import re
from groq import Groq


GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None


def extrair_json(texto: str):
    if not texto:
        return None

    texto = texto.strip()
    texto = texto.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(texto)
    except Exception:
        pass

    match = re.search(r"\{.*\}", texto, re.DOTALL)

    if match:
        try:
            return json.loads(match.group(0))
        except Exception:
            return None

    return None


def groq_chat(system_prompt: str, user_prompt: str) -> str:
    if not client:
        raise RuntimeError("GROQ_API_KEY não configurada.")

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.25,
    )

    return response.choices[0].message.content


def classificar_movimentacao(descricao: str, categorias: list[dict]) -> dict:
    system_prompt = """
Você é uma IA financeira do NexBiz.
Classifique uma movimentação financeira com base na descrição e categorias disponíveis.

Responda somente JSON válido, sem markdown.

Formato obrigatório:
{
  "tipo": "receita" ou "despesa",
  "categoria_nome": "nome exato da categoria disponível",
  "confianca": 0,
  "explicacao": "explicação curta"
}
"""

    user_prompt = f"""
Descrição:
{descricao}

Categorias disponíveis:
{json.dumps(categorias, ensure_ascii=False)}
"""

    try:
        resposta = groq_chat(system_prompt, user_prompt)
        dados = extrair_json(resposta)

        if dados:
            return dados

    except Exception:
        pass

    descricao_lower = descricao.lower()

    if any(palavra in descricao_lower for palavra in ["venda", "recebi", "serviço prestado", "cliente pagou"]):
        tipo = "receita"
    else:
        tipo = "despesa"

    categoria_nome = None

    for categoria in categorias:
        nome = categoria["nome"].lower()

        if nome in descricao_lower:
            categoria_nome = categoria["nome"]
            tipo = categoria["tipo"]
            break

    if not categoria_nome and categorias:
        categoria_compativel = next(
            (cat for cat in categorias if cat["tipo"] == tipo),
            categorias[0]
        )
        categoria_nome = categoria_compativel["nome"]

    return {
        "tipo": tipo,
        "categoria_nome": categoria_nome,
        "confianca": 60,
        "explicacao": "Classificação estimada por regras locais."
    }


def gerar_comentarios_dashboard(resumo: dict, mensal: list, categorias: list, recentes: list) -> dict:
    system_prompt = """
Você é a IA financeira do NexBiz, um sistema para microempresas.

Analise os dados reais do usuário e gere comentários objetivos, úteis e curtos.

Responda somente JSON válido, sem markdown.

Formato obrigatório:
{
  "comentario_principal": "comentário curto sobre a situação financeira",
  "risco": "baixo" | "medio" | "alto",
  "pontuacao_saude": 0,
  "insights": [
    {
      "titulo": "título curto",
      "descricao": "explicação prática",
      "nivel": "baixo" | "medio" | "alto"
    }
  ],
  "recomendacoes": [
    "recomendação curta",
    "recomendação curta"
  ]
}
"""

    user_prompt = f"""
Resumo financeiro:
{json.dumps(resumo, ensure_ascii=False)}

Resumo mensal:
{json.dumps(mensal, ensure_ascii=False)}

Resumo por categoria:
{json.dumps(categorias, ensure_ascii=False)}

Movimentações recentes:
{json.dumps(recentes, ensure_ascii=False)}
"""

    try:
        resposta = groq_chat(system_prompt, user_prompt)
        dados = extrair_json(resposta)

        if dados:
            return dados

    except Exception:
        pass

    receitas = float(resumo.get("receitas", 0))
    despesas = float(resumo.get("despesas", 0))

    if receitas == 0 and despesas == 0:
        return {
            "comentario_principal": "Ainda não há dados suficientes para uma análise financeira completa.",
            "risco": "medio",
            "pontuacao_saude": 50,
            "insights": [
                {
                    "titulo": "Sem movimentações suficientes",
                    "descricao": "Cadastre receitas e despesas para receber análises financeiras mais úteis.",
                    "nivel": "medio"
                }
            ],
            "recomendacoes": [
                "Cadastre suas primeiras movimentações.",
                "Crie categorias para organizar melhor o caixa."
            ]
        }

    if despesas > receitas:
        return {
            "comentario_principal": "As despesas estão acima das receitas. É importante revisar os principais gastos.",
            "risco": "alto",
            "pontuacao_saude": 35,
            "insights": [
                {
                    "titulo": "Caixa em atenção",
                    "descricao": "O saldo está negativo ou próximo de ficar comprometido.",
                    "nivel": "alto"
                }
            ],
            "recomendacoes": [
                "Revise as maiores categorias de despesa.",
                "Evite novos gastos não essenciais neste período."
            ]
        }

    return {
        "comentario_principal": "O saldo está positivo e o fluxo financeiro demonstra boa estabilidade.",
        "risco": "baixo",
        "pontuacao_saude": 82,
        "insights": [
            {
                "titulo": "Saldo positivo",
                "descricao": "As receitas estão superando as despesas no período analisado.",
                "nivel": "baixo"
            }
        ],
        "recomendacoes": [
            "Mantenha o controle das despesas recorrentes.",
            "Reserve parte do saldo positivo para capital de giro."
        ]
    }


def conversar_chat_financeiro(
    mensagem: str,
    resumo: dict,
    mensal: list,
    categorias: list,
    recentes: list,
    historico: list
) -> str:
    system_prompt = """
Você é o assistente financeiro inteligente do NexBiz.

Você conversa com o usuário sobre os dados financeiros reais dele.
Use os dados fornecidos para responder de forma prática, objetiva e em português do Brasil.

Você pode:
- explicar receitas, despesas e saldo;
- apontar maiores gastos;
- sugerir melhorias;
- analisar categorias;
- ajudar o usuário a entender o dashboard;
- sugerir ações para microempresas e MEIs.

Regras:
- Não invente números que não estejam nos dados.
- Se não houver dados suficientes, diga isso claramente.
- Seja direto e útil.
- Não use markdown exagerado.
- Não dê consultoria jurídica, contábil ou fiscal definitiva.
- Não peça senha, token ou chave de API.
"""

    contexto = {
        "resumo_financeiro": resumo,
        "resumo_mensal": mensal,
        "resumo_por_categoria": categorias,
        "movimentacoes_recentes": recentes,
        "historico_da_conversa": historico[-8:] if historico else []
    }

    user_prompt = f"""
Dados disponíveis:
{json.dumps(contexto, ensure_ascii=False, default=str)}

Mensagem do usuário:
{mensagem}

Responda como um assistente financeiro dentro do sistema NexBiz.
"""

    try:
        return groq_chat(system_prompt, user_prompt)
    except Exception as erro:
        return f"Não consegui consultar a IA agora. Verifique se a GROQ_API_KEY está configurada corretamente. Detalhe: {str(erro)}"
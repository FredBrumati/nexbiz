INSERT INTO usuarios (nome, email, senha_hash)
VALUES ('Usuário Teste', 'teste@nexbiz.com', 'senha_hash_teste');

INSERT INTO categorias (usuario_id, nome, tipo) VALUES
(1, 'Vendas', 'receita'),
(1, 'Serviços', 'receita'),
(1, 'Marketing', 'despesa'),
(1, 'Fornecedor', 'despesa'),
(1, 'Aluguel', 'despesa');

INSERT INTO movimentacoes (
    usuario_id,
    categoria_id,
    tipo,
    descricao,
    valor,
    data_movimentacao,
    forma_pagamento,
    observacao
) VALUES
(1, 1, 'receita', 'Venda de produto', 2500.00, '2026-04-01', 'Pix', 'Venda inicial'),
(1, 2, 'receita', 'Serviço prestado', 1800.00, '2026-04-05', 'Cartão', 'Cliente recorrente'),
(1, 3, 'despesa', 'Anúncios Instagram', 450.00, '2026-04-08', 'Cartão', 'Campanha mensal'),
(1, 4, 'despesa', 'Compra de mercadorias', 900.00, '2026-04-10', 'Boleto', 'Fornecedor principal'),
(1, 5, 'despesa', 'Aluguel da loja', 1200.00, '2026-04-15', 'Pix', 'Despesa fixa');

INSERT INTO relatorios (
    usuario_id,
    periodo_inicio,
    periodo_fim,
    total_receitas,
    total_despesas,
    saldo
) VALUES
(1, '2026-04-01', '2026-04-30', 4300.00, 2550.00, 1750.00);

INSERT INTO insights_ia (
    usuario_id,
    titulo,
    descricao,
    tipo,
    nivel
) VALUES
(1, 'Receita em crescimento', 'Sua receita teve bom desempenho neste mês em comparação ao volume de despesas.', 'financeiro', 'baixo'),
(1, 'Atenção aos custos fixos', 'O aluguel representa uma parte relevante das despesas do mês.', 'alerta', 'medio');

INSERT INTO previsoes_fluxo_caixa (
    usuario_id,
    data_previsao,
    saldo_previsto,
    confianca
) VALUES
(1, '2026-05-01', 2100.00, 82.50);
USE nexbiz;

ALTER TABLE movimentacoes
MODIFY valor DECIMAL(15,2) NOT NULL;

ALTER TABLE metas_financeiras
MODIFY valor_meta DECIMAL(15,2) NOT NULL,
MODIFY valor_atual DECIMAL(15,2) DEFAULT 0;

ALTER TABLE orcamentos_categoria
MODIFY valor_limite DECIMAL(15,2) NOT NULL;

ALTER TABLE movimentacoes_recorrentes
MODIFY valor DECIMAL(15,2) NOT NULL;

ALTER TABLE relatorios
MODIFY total_receitas DECIMAL(15,2) DEFAULT 0,
MODIFY total_despesas DECIMAL(15,2) DEFAULT 0,
MODIFY saldo DECIMAL(15,2) DEFAULT 0;
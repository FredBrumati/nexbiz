# NexBiz

**NexBiz** é uma plataforma web de controle financeiro inteligente desenvolvida para microempresas, MEIs, autônomos e pequenos negócios que precisam organizar suas finanças de forma simples, visual e estratégica.

O projeto combina registro de receitas e despesas, categorização financeira, dashboards interativos, relatórios, gráficos, insights automáticos e integração com IA via Groq para apoiar a tomada de decisão.

---

## Visão Geral

Muitos microempreendedores ainda controlam suas finanças de forma manual, usando anotações, planilhas simples ou aplicativos pouco integrados à realidade do negócio. Isso dificulta a visualização do fluxo de caixa, o entendimento dos principais gastos e a tomada de decisões com base em dados.

O NexBiz propõe uma solução acessível, moderna e inteligente para esse problema.

A aplicação permite que o usuário registre movimentações financeiras, organize categorias, acompanhe indicadores em tempo real e utilize inteligência artificial para interpretar os dados financeiros cadastrados.

---

## Objetivo do Projeto

O principal objetivo do NexBiz é ajudar pequenos empreendedores a responder perguntas como:

- Quanto meu negócio recebeu?
- Quanto meu negócio gastou?
- Qual é meu saldo atual?
- Em quais categorias estou gastando mais?
- Meu fluxo financeiro está saudável?
- O que posso melhorar no meu controle financeiro?
- Quais decisões posso tomar com base nos dados?

Além disso, o projeto busca demonstrar a aplicação prática de tecnologias modernas em uma solução real de gestão financeira.

---

## Público-Alvo

O NexBiz foi pensado para:

- MEIs;
- microempresas;
- pequenos comércios;
- prestadores de serviço;
- autônomos;
- empreendedores em fase inicial;
- usuários que precisam de controle financeiro simples e visual.

---

## Principais Funcionalidades

### Autenticação de usuários

O sistema possui cadastro e login de usuários com autenticação via JWT, garantindo que cada usuário visualize apenas seus próprios dados financeiros.

Funcionalidades incluídas:

- Cadastro de usuário;
- Login;
- Proteção de rotas privadas;
- Token JWT;
- Separação de dados por usuário.

### Gestão de categorias

O usuário pode criar categorias personalizadas para organizar suas receitas e despesas.

Exemplos:

- Vendas;
- Serviços;
- Marketing;
- Aluguel;
- Fornecedores;
- Transporte;
- Assinaturas.

As categorias são usadas para melhorar os relatórios, gráficos e análises feitas pela IA.

### Gestão de movimentações financeiras

O NexBiz permite cadastrar receitas e despesas com informações detalhadas.

Campos principais:

- Tipo da movimentação;
- Categoria;
- Descrição;
- Valor;
- Data;
- Forma de pagamento;
- Observação.

Também é possível:

- Listar movimentações;
- Filtrar por tipo;
- Filtrar por categoria;
- Filtrar por período;
- Excluir movimentações;
- Visualizar resumo financeiro filtrado.

O sistema suporta valores de até **R$ 10.000.000,00** por movimentação.

### Dashboard financeiro

O dashboard apresenta uma visão geral dos principais indicadores financeiros do usuário.

Indicadores exibidos:

- Total de receitas;
- Total de despesas;
- Saldo atual;
- Quantidade de movimentações cadastradas;
- Movimentações recentes;
- Gráficos financeiros;
- Comentários inteligentes da IA.

O objetivo do dashboard é permitir que o usuário entenda rapidamente a situação financeira do negócio.

### Relatórios e gráficos

O sistema conta com relatórios visuais para facilitar a análise dos dados.

Relatórios disponíveis:

- Receitas por mês;
- Despesas por mês;
- Saldo mensal;
- Movimentações por categoria;
- Comparação entre receitas e despesas;
- Gráficos em área e barras.

Os gráficos tornam a análise mais clara e ajudam o usuário a identificar tendências financeiras.

### Insights com Inteligência Artificial

O NexBiz possui integração com IA via Groq para gerar análises financeiras com base nos dados reais cadastrados no sistema.

A IA pode gerar:

- Comentário principal sobre a situação financeira;
- Avaliação de risco;
- Pontuação de saúde financeira;
- Insights por categoria;
- Recomendações práticas;
- Diagnóstico financeiro;
- Análise de receitas, despesas e saldo.

A análise não é baseada em mensagens fixas. Ela considera os dados reais do usuário, como movimentações, categorias, resumo financeiro e histórico recente.

### Chat financeiro com IA

O projeto também possui um chat flutuante integrado à IA.

Esse chat permite que o usuário converse com o assistente financeiro do NexBiz diretamente pela interface.

Exemplos de perguntas:

- Como está meu saldo?
- Qual minha maior despesa?
- Minhas despesas estão altas?
- O que posso melhorar?
- Faça um resumo financeiro rápido.
- Estou financeiramente saudável?
- Quais categorias mais impactam meu caixa?

O chat utiliza os dados reais do usuário para responder de forma contextualizada.

### Sugestão automática de categoria com IA

Ao cadastrar uma movimentação, o usuário pode digitar uma descrição e pedir para a IA sugerir automaticamente:

- Se é receita ou despesa;
- A categoria mais provável;
- O nível de confiança;
- Uma explicação curta.

Exemplo:

```txt
paguei anúncio no Instagram
```

Sugestão da IA:

```txt
Tipo: despesa
Categoria: Marketing
Confiança: alta
```

Essa funcionalidade torna o cadastro mais rápido e inteligente.

---

## Diferenciais do Projeto

O NexBiz se diferencia por unir controle financeiro tradicional com inteligência artificial aplicada.

Principais diferenciais:

- Interface moderna e responsiva;
- Dashboard visual;
- Gráficos reais;
- Dados separados por usuário;
- Chat com IA financeira;
- Comentários inteligentes no dashboard;
- Classificação automática de movimentações;
- Arquitetura full stack;
- Backend com API REST;
- Banco relacional MySQL;
- Autenticação JWT;
- Foco em microempreendedores.

---

## Tecnologias Utilizadas

### Frontend

- React;
- React Router DOM;
- Tailwind CSS;
- Axios;
- Recharts;
- Framer Motion;
- React Icons.

### Backend

- Python;
- FastAPI;
- SQLAlchemy;
- PyMySQL;
- JWT;
- Bcrypt;
- Pydantic;
- Groq SDK.

### Banco de Dados

- MySQL.

### Inteligência Artificial

- Groq API;
- Modelo configurável via variável de ambiente.

---

## Arquitetura do Sistema

A arquitetura do NexBiz segue uma estrutura em camadas:

```txt
Usuário
  ↓
Frontend React
  ↓
API Backend FastAPI
  ↓
Banco de Dados MySQL
  ↓
Serviço de IA Groq
```

### Frontend

Responsável pela experiência do usuário, telas, formulários, dashboard, gráficos e interação com a IA.

### Backend

Responsável pelas regras de negócio, autenticação, validações, comunicação com o banco de dados e integração com a Groq.

### Banco de Dados

Responsável por armazenar usuários, categorias, movimentações, relatórios, metas, alertas e informações financeiras.

### Inteligência Artificial

Responsável por interpretar os dados financeiros e gerar respostas, comentários e sugestões.

---

## Estrutura Geral do Projeto

```txt
nexbiz/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── security.py
│   ├── database/
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

## Principais Telas

### Login

Tela de autenticação do usuário.

### Cadastro

Tela para criação de nova conta.

### Dashboard

Tela principal com indicadores financeiros, gráficos, movimentações recentes e comentários da IA.

### Movimentações

Tela para cadastrar, listar, filtrar e excluir receitas e despesas.

### Categorias

Tela para criar e gerenciar categorias financeiras.

### Relatórios

Tela com gráficos e relatórios financeiros.

### Insights IA

Tela dedicada à análise financeira inteligente com recomendações, pontuação e diagnóstico.

### Chat IA

Componente flutuante disponível nas áreas logadas para conversar com a IA financeira.

---

## Configuração do Ambiente

### Pré-requisitos

Antes de rodar o projeto, é necessário ter instalado:

- Node.js;
- npm;
- Python;
- MySQL;
- Git.

---

## Configuração do Backend

Acesse a pasta do backend:

```bash
cd backend
```

Crie o ambiente virtual:

```bash
python -m venv venv
```

Ative o ambiente virtual no Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Caso o PowerShell bloqueie a execução:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\venv\Scripts\Activate.ps1
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Caso precise instalar manualmente:

```bash
pip install fastapi uvicorn sqlalchemy pymysql python-dotenv python-jose bcrypt cryptography email-validator groq
pip freeze > requirements.txt
```

---

## Configuração do `.env`

Crie o arquivo `.env` dentro da pasta `backend`.

Exemplo:

```env
DATABASE_URL=mysql+pymysql://root:SUA_SENHA@localhost:3306/nexbiz

SECRET_KEY=sua_chave_secreta_grande
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

GROQ_API_KEY=sua_chave_da_groq
GROQ_MODEL=llama-3.3-70b-versatile
```

### Observações

- `DATABASE_URL` deve conter usuário, senha, host, porta e banco.
- `SECRET_KEY` é usada para assinar tokens JWT.
- `GROQ_API_KEY` é necessária para usar as funcionalidades de IA.
- `GROQ_MODEL` pode ser alterado conforme o modelo disponível na Groq.

---

## Configuração do Banco de Dados

Acesse o MySQL e execute os scripts SQL.

Exemplo usando MySQL Shell ou terminal:

```sql
SOURCE C:/caminho/do/projeto/backend/database/schema.sql;
SOURCE C:/caminho/do/projeto/backend/database/seed.sql;
```

Em caminhos do Windows, prefira usar `/` em vez de `\`.

Exemplo correto:

```sql
SOURCE C:/Users/seu_usuario/Downloads/nexbiz/backend/database/schema.sql;
```

---

## Rodando o Backend

Dentro da pasta `backend`, com o ambiente virtual ativo:

```bash
uvicorn app.main:app --reload
```

Se o comando `uvicorn` não funcionar:

```bash
python -m uvicorn app.main:app --reload
```

A API ficará disponível em:

```txt
http://127.0.0.1:8000
```

A documentação Swagger ficará disponível em:

```txt
http://127.0.0.1:8000/docs
```

---

## Configuração do Frontend

Acesse a pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Caso precise instalar manualmente:

```bash
npm install axios react-router-dom react-icons framer-motion recharts
```

Se estiver usando Tailwind CSS:

```bash
npm install -D tailwindcss@3 postcss autoprefixer
```

---

## Rodando o Frontend

Dentro da pasta `frontend`:

```bash
npm start
```

A aplicação ficará disponível em:

```txt
http://localhost:3000
```

---

## Fluxo de Uso

1. O usuário acessa a tela de cadastro.
2. Cria uma conta.
3. Realiza login.
4. Acessa o dashboard.
5. Cria categorias financeiras.
6. Registra receitas e despesas.
7. Visualiza os indicadores no dashboard.
8. Analisa gráficos e relatórios.
9. Usa a IA para obter recomendações.
10. Conversa com o chat financeiro.

---

## Segurança

O projeto utiliza autenticação baseada em JWT.

Cada rota protegida exige um token válido no cabeçalho da requisição.

Exemplo:

```txt
Authorization: Bearer token_do_usuario
```

Além disso:

- Senhas são armazenadas com hash;
- Dados financeiros são vinculados ao usuário logado;
- Rotas privadas são protegidas no frontend;
- A API valida os dados recebidos com Pydantic.

---

## Exemplos de Endpoints

### Autenticação

```txt
POST /auth/register
POST /auth/login
```

### Categorias

```txt
GET /categorias/
POST /categorias/
PUT /categorias/{id}
DELETE /categorias/{id}
```

### Movimentações

```txt
GET /movimentacoes/
POST /movimentacoes/
GET /movimentacoes/{id}
PUT /movimentacoes/{id}
DELETE /movimentacoes/{id}
```

### Dashboard

```txt
GET /dashboard/summary
GET /dashboard/recent
GET /dashboard/mensal
GET /dashboard/por-categoria
GET /dashboard/overview
```

### Inteligência Artificial

```txt
GET /ia/classificar
GET /ia/dashboard-comentarios
POST /ia/chat
```

---

## Exemplos de Uso da IA

### Classificação de movimentação

```txt
GET /ia/classificar?descricao=paguei anuncio no instagram
```

Resposta esperada:

```json
{
  "descricao": "paguei anuncio no instagram",
  "resultado": {
    "tipo": "despesa",
    "categoria_nome": "Marketing",
    "confianca": 95,
    "explicacao": "Anúncio no Instagram é uma despesa de marketing."
  },
  "categoria_id": 3
}
```

### Chat financeiro

```txt
POST /ia/chat
```

Body:

```json
{
  "mensagem": "Qual minha maior despesa?",
  "historico": []
}
```

Resposta esperada:

```json
{
  "resposta": "Sua maior despesa está relacionada à categoria Aluguel, com base nas movimentações cadastradas.",
  "resumo": {
    "receitas": 4300,
    "despesas": 3469.9,
    "saldo": 830.1,
    "total_movimentacoes": 7
  }
}
```

---

## Banco de Dados

O banco de dados foi modelado para suportar a evolução do sistema.

Entidades principais:

- Usuários;
- Categorias;
- Movimentações;
- Metas financeiras;
- Orçamentos por categoria;
- Movimentações recorrentes;
- Alertas;
- Insights de IA;
- Relatórios.

Essa estrutura permite expandir o sistema para novas funcionalidades sem alterar completamente a arquitetura.

---

## Possíveis Melhorias Futuras

Algumas melhorias planejadas ou possíveis:

- Metas financeiras completas;
- Orçamentos mensais por categoria;
- Alertas automáticos;
- Importação de planilhas CSV/Excel;
- Exportação de relatórios em PDF;
- Exportação de dados para Excel;
- Recorrências automáticas;
- Notificações inteligentes;
- Multiempresa;
- Painel administrativo;
- Modo claro e escuro;
- Gráficos avançados;
- Previsão de fluxo de caixa;
- OCR de notas fiscais;
- Integração com bancos;
- Análise de sazonalidade;
- Recomendações financeiras mais avançadas.

---

## Proposta de Valor

O NexBiz entrega valor ao transformar dados financeiros simples em informações úteis para o empreendedor.

Em vez de apenas armazenar receitas e despesas, o sistema ajuda o usuário a entender seus números, identificar riscos, visualizar tendências e tomar decisões melhores.

A proposta central é:

```txt
Controle financeiro simples, visual e inteligente para pequenos negócios.
```

---

## Status do Projeto

O projeto está em desenvolvimento ativo.

Funcionalidades já implementadas:

- Autenticação;
- Categorias;
- Movimentações;
- Dashboard;
- Gráficos;
- Relatórios;
- IA financeira;
- Chat com IA;
- Classificação automática;
- Integração com banco MySQL;
- Interface moderna com React.

Funcionalidades em evolução:

- Metas;
- Alertas;
- Orçamentos;
- Recorrências;
- Relatórios exportáveis;
- Previsão financeira.

---

## Considerações sobre IA

As respostas da IA são geradas com base nos dados financeiros disponíveis no sistema.

A IA deve ser usada como apoio à análise e tomada de decisão, não como substituto para orientação contábil, fiscal ou financeira profissional.

O sistema não deve solicitar senhas, tokens ou dados sensíveis no chat.

---

## Autor

Projeto desenvolvido pelos alunos:

- **Gustavo Vasconcelos**
- **Felipe Piovesan**
- **Frederico Brumati**
- **Ruan Gimenes**
- **Vitor Zuchieri**

Área de interesse:

- Desenvolvimento web;
- Análise de dados;
- Automação;
- Inteligência artificial aplicada;
- Soluções para pequenos negócios.

---

## Licença

Este projeto é de uso educacional e demonstrativo.

A licença pode ser definida conforme a necessidade.

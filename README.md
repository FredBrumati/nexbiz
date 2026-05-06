# 💰 NexBiz

Sistema Full Stack para controle financeiro inteligente de microempresas, desenvolvido com **React, FastAPI e MySQL**.

O projeto possui autenticação JWT, dashboard financeiro moderno, gerenciamento de receitas e despesas e arquitetura preparada para futuras integrações com IA.

---

#  Tecnologias Utilizadas

## Frontend

* React
* TailwindCSS
* React Router DOM
* Axios
* Framer Motion
* React Icons

## Backend

* FastAPI
* SQLAlchemy
* JWT Authentication
* bcrypt
* Pydantic

## Banco de Dados

* MySQL 8

---

#  Principais Funcionalidades

*  Autenticação JWT
*  Controle de receitas e despesas
*  Dashboard financeiro
*  Categorias personalizadas
*  Rotas protegidas
*  Estrutura preparada para IA financeira

---

#  Arquitetura

```txt id="9s2lf5"
Frontend (React)
        ↓
API REST (FastAPI)
        ↓
Banco de Dados (MySQL)
```

---

# 📁 Estrutura do Projeto

```txt id="nyh0mi"
nexbiz/
│
├── backend/
│   ├── app/
│   ├── database/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

# ▶️ Como Rodar o Projeto

## Backend

```bash id="j4jqrr"
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Swagger:

```txt id="km57p6"
http://127.0.0.1:8000/docs
```

---

## Frontend

```bash id="k8c6gz"
cd frontend
npm install
npm start
```

Frontend:

```txt id="t34g8f"
http://localhost:3000
```

---

# 🛡️ Segurança

* JWT Authentication
* Senhas criptografadas com bcrypt
* Rotas protegidas
* Isolamento de dados por usuário

---

# 📈 Próximas Melhorias

* Dashboard com gráficos reais
* IA financeira
* Deploy cloud
* Docker
* Relatórios PDF

---

# 📷 Preview


---

#  Autor

Projeto desenvolvido para fins acadêmicos e evolução profissional em Desenvolvimento Full Stack.
Frontend moderno com React e backend robusto com FastAPI.

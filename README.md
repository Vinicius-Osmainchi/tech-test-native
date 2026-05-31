# Native IP — Tech Test Fullstack

API REST em Node.js + dashboard React para consulta e edição de clientes, com atualização em tempo real via WebSocket.

## Visão geral

Este repositório é um monorepo com:

| Pacote | Descrição |
|--------|-----------|
| `backend/` | API REST, autenticação JWT, WebSocket (Socket.IO) |
| `frontend/` | Dashboard React com cards por cidade, listagem paginada e edição de clientes |

**Stack:** TypeScript, Express, Prisma, MySQL, React, Vite, Ant Design, Tailwind CSS, Socket.IO.

Documentação detalhada por camada:

- [Backend](./backend/README.md)
- [Frontend](./frontend/README.md)

---

## Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose

Para desenvolvimento local (opcional):

- [Node.js](https://nodejs.org/) 20+
- npm

---

## Como executar (Docker)

Com um único comando, sobe **MySQL**, **API** e **dashboard**:

```bash
docker compose up --build
```

Aguarde os containers iniciarem e acesse:

| Serviço | URL |
|---------|-----|
| **Aplicação (frontend + API via proxy)** | http://localhost:8080 |

**Credenciais de login** (padrão do `.env` / Docker):

| Campo | Variável | Valor padrão |
|-------|----------|--------------|
| Email | `ADMIN_EMAIL` | `admin@email.com` |
| Senha | `ADMIN_PASSWORD` | `admin` |

O frontend (Nginx) serve o dashboard e faz proxy de `/api` (API), `/docs` (Swagger) e `/socket.io` para o backend. As rotas React (`/login`, `/dashboard`, etc.) ficam no frontend — não conflitam com a API.

**Documentação da API (Swagger):** http://localhost:8080/docs

**Alterações no código:** o container do frontend serve arquivos estáticos gerados no build. Mudanças no frontend **não aparecem automaticamente** — é preciso rebuildar:

```bash
docker compose up --build
```

Para desenvolvimento com hot reload (sem rebuild a cada alteração), use o frontend local com `npm run dev` (veja [desenvolvimento local](#desenvolvimento-local-opcional)).

Para parar:

```bash
docker compose down
```

Para resetar o banco (apaga volumes):

```bash
docker compose down -v
```

---

## Desenvolvimento local (opcional)

Útil para hot reload durante o desenvolvimento.

**1. Banco de dados**

```bash
docker compose up db -d
```

**2. Backend**

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
```

Crie `backend/.env` a partir do template:

```bash
cd backend
cp .env.example .env
```

```bash
npm run dev
```

**3. Frontend**

```bash
cd frontend
npm install
npm run dev
```

Acesse http://localhost:5173/login — o Vite faz proxy de `/api` para a API em `localhost:3000`.

> **Importante:** a API usa o prefixo `/api`. O frontend usa `/login` só como rota React; chamadas HTTP vão para `/api/login`.

---

## Autenticação

Todos os endpoints de clientes exigem JWT no header `Authorization: Bearer <token>`.

**Login**

```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@email.com",
  "password": "admin"
}
```

**Resposta**

```json
{
  "token": "<jwt>"
}
```

No frontend, faça login em `/login` com as mesmas credenciais. O token é armazenado em `localStorage` e enviado automaticamente nas requisições.

---

## Modelagem do banco

- **`cities`** — normalizada (agrupamento e navegação por cidade no dashboard)
- **`customers`** — `company` e `title` como colunas de texto (atributos do cliente, sem tabelas separadas)

Empresa e cargo não foram extraídos para tabelas próprias: não há requisito de agrupar ou filtrar por eles, e o volume de dados do teste não justifica joins extras.

---

## Endpoints da API

Via Docker, as rotas da API são acessíveis pelo mesmo host do frontend (`http://localhost:8080`). Em desenvolvimento local, a API responde diretamente em `http://localhost:3000`.

Documentação interativa: **http://localhost:8080/docs** (Docker) ou **http://localhost:3000/docs** (local).

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/login` | Autenticação (público) |
| `GET` | `/api/customers/totals-by-city` | Total de clientes agrupados por cidade |
| `GET` | `/api/customers?city={cidade}&page={n}&limit={n}` | Clientes de uma cidade (paginado) |
| `GET` | `/api/customers/:id` | Detalhes de um cliente |
| `PUT` | `/api/customers/:id` | Atualizar um cliente |

### Exemplos de resposta

**Total por cidade**

```json
[
  { "city": "Warner, NH", "customers_total": 20 }
]
```

**Listagem por cidade**

```json
{
  "customers": [
    {
      "id": 1,
      "first_name": "Laura",
      "last_name": "Richards",
      "email": "lrichards0@reverbnation.com",
      "company": "Meezzy"
    }
  ],
  "total": 20
}
```

**Cliente por ID**

```json
{
  "id": 1,
  "first_name": "Laura",
  "last_name": "Richards",
  "email": "lrichards0@reverbnation.com",
  "gender": "Female",
  "company": "Meezzy",
  "city": "Warner, NH",
  "title": "Biostatistician III"
}
```

Ao editar um cliente (`PUT /api/customers/:id`), a API emite o evento WebSocket `customer_updated`, atualizando o dashboard em tempo real.

---

## Frontend — rotas

| Rota | Página |
|------|--------|
| `/login` | Login |
| `/dashboard` | Cards com total de clientes por cidade |
| `/city/:cityName` | Lista paginada de clientes da cidade |
| `/customer/:id` | Detalhes e edição do cliente |

---

## Scripts úteis (raiz)

Requer Node.js instalado localmente:

```bash
# Type-check de backend e frontend
npm run type-check

# Build de produção
npm run build
```

Scripts específicos de cada pacote estão nos READMEs de [backend](./backend/README.md) e [frontend](./frontend/README.md).

---

## Testes

Testes unitários da API (use cases):

```bash
cd backend
npm test
```

A pipeline de CI (GitHub Actions) executa lint, testes e build a cada push/PR na branch `main`.

---

## Estrutura do repositório

```
tech-test-native/
├── backend/            # API REST + Prisma + Dockerfile
├── frontend/           # Dashboard React + Dockerfile (Nginx)
├── docker-compose.yml  # Orquestra db + backend + frontend
└── .github/workflows/ci.yml
```

---

## Dados iniciais

Os clientes são carregados a partir de `backend/prisma/customers.json` via seed do Prisma. O schema normaliza cidades em uma tabela `cities` relacionada a `customers`.

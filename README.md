# Fullstack Customer Dashboard — Node.js & React

Uma solução Fullstack (API REST em Node.js + Dashboard React) para consulta e edição de clientes, com atualizações em tempo real via WebSocket. Projetado com foco em Clean Architecture, performance e experiência do desenvolvedor.

## 📌 Visão Geral

Este repositório é um monorepo que contém:

| Pacote      | Descrição                                                                         |
| ----------- | --------------------------------------------------------------------------------- |
| `backend/`  | API REST estruturada via Vertical Slicing, Autenticação JWT e WebSockets.         |
| `frontend/` | Dashboard SPA construído com React, consumindo a API com paginação em tempo real. |

**Stack Principal:** TypeScript, Express 5, Prisma ORM, MySQL, React, Vite, Tailwind CSS, Ant Design e Socket.IO.

Documentação detalhada por camada:

- [Backend](./backend/README.md)
- [Frontend](./frontend/README.md)

---

## 🧠 Arquitetura e Decisões Técnicas (Trade-offs)

Para demonstrar maturidade na engenharia de software, este projeto foi construído evitando _overengineering_, mas mantendo uma base sólida para escalabilidade:

- **Clean Architecture & Vertical Slicing:** O backend está organizado por domínios (ex: `customers`), separando responsabilidades em _Controllers_, _UseCases_ e _Repositories_. A injeção de dependência via construtor garante que os casos de uso sejam testáveis e totalmente desacoplados do Prisma ORM.
- **Modelagem de Banco de Dados (YAGNI):** A tabela de cidades (`cities`) foi normalizada em uma relação 1:N com `customers` para garantir a performance e integridade do agrupamento de dados no Dashboard. Por outro lado, campos como `company` e `title` foram mantidos na tabela de clientes aplicando o princípio _You Aren't Gonna Need It_ (YAGNI), evitando a complexidade de _JOINs_ desnecessários onde o negócio não exige.
- **Tratamento Global de Erros:** Utilização do Express 5 integrado a um Middleware Global e classes de erros customizadas (`AppError`). Isso mantém os _Controllers_ enxutos e garante respostas HTTP padronizadas.
- **Comunicação em Tempo Real:** Uso de WebSockets (`Socket.IO`) para atualizar o dashboard reativamente quando um cliente é editado, evitando a sobrecarga de banco de dados causada por requisições de _Long Polling_.
- **Frontend Desacoplado:** Uso intensivo de _Custom Hooks_ (ex: `useCityCustomers`) para isolar a lógica de requisições, estados e WebSockets, mantendo os componentes de UI puros e focados apenas na renderização.

---

## 🚀 Como Executar (Docker)

**Pré-requisitos:** [Docker](https://www.docker.com/) e Docker Compose instalados.

Com um único comando, a infraestrutura completa sobe (MySQL, API e Frontend):

```bash
docker compose up --build -d
```

Aguarde os containers iniciais e acesse:

| Serviço                              | URL                        |
| ------------------------------------ | -------------------------- |
| **Aplicação (Frontend + API Proxy)** | http://localhost:8080      |
| **Documentação da API (Swagger)**    | http://localhost:8080/docs |

**Credenciais de Acesso:**

| Campo | Variável         | Valor Padrão      |
| ----- | ---------------- | ----------------- |
| Email | `ADMIN_EMAIL`    | `admin@email.com` |
| Senha | `ADMIN_PASSWORD` | `admin`           |

_(Nota: O Nginx serve o frontend e atua como proxy reverso, roteando as chamadas de `/api`, `/docs` e `/socket.io` diretamente para o backend)._

---

## 💻 Desenvolvimento Local

Para desenvolvimento com _Hot Reload_ e testes manuais, você precisará do [Node.js](https://nodejs.org/) (v20+).

**1. Banco de dados:**

```bash
docker compose up db -d
```

**2. Backend:**

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

**3. Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173/login`. (O Vite está configurado para fazer o proxy de `/api` para a porta 3000).

---

## 🔐 Autenticação

Todos os endpoints de clientes exigem JWT no header: `Authorization: Bearer <token>`.

**Login (Geração de Token)**

```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@email.com",
  "password": "admin"
}
```

_O frontend gerencia o token via `localStorage` e o injeta automaticamente nas requisições subsequentes usando interceptadores do Axios._

---

## 🌐 Endpoints da API (Resumo)

| Método | Rota                                              | Descrição                                     |
| ------ | ------------------------------------------------- | --------------------------------------------- |
| `POST` | `/api/login`                                      | Autenticação e emissão de JWT.                |
| `GET`  | `/api/customers/totals-by-city`                   | Contagem agregada de clientes por cidade.     |
| `GET`  | `/api/customers?city={cidade}&page={n}&limit={n}` | Listagem paginada por cidade.                 |
| `GET`  | `/api/customers/:id`                              | Detalhes de um cliente específico.            |
| `PUT`  | `/api/customers/:id`                              | Edição de cliente (Dispara evento WebSocket). |

---

## 🛠️ Qualidade de Código e Testes

O repositório possui rigorosas verificações de qualidade:

- **Testes Unitários:** Testes de comportamento cobrindo regras de negócio e ramificações de erro (Jest).
- **CI/CD:** _GitHub Actions_ executa Linting, Type-Checking e a suíte de testes em cada PR direcionado à branch `main`.

**Rodar os testes localmente:**

```bash
cd backend
npm test
```

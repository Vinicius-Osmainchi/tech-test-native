# Backend — Tech Test Native

API REST em **Node.js** e **TypeScript** para gerenciamento de clientes, com autenticação JWT e notificações em tempo real via Socket.IO.

Para executar o projeto completo com um comando, consulte o [README da raiz](../README.md).

---

## Tecnologias

| Tecnologia | Uso |
|------------|-----|
| Express 5 | Servidor HTTP |
| Prisma 6 | ORM e migrations (MySQL) |
| jsonwebtoken | Autenticação JWT |
| Socket.IO | Evento `customer_updated` após edição de cliente |
| Jest | Testes unitários dos use cases |

---

## Arquitetura

O código segue **vertical slicing** por módulo de negócio, inspirado em Clean Architecture:

```
src/
├── modules/
│   ├── auth/           # Login e geração de JWT
│   └── customers/      # CRUD e consultas de clientes
│       ├── domain/     # Tipos de domínio
│       ├── useCases/   # Regras de negócio
│       └── infra/      # Controllers e rotas HTTP
├── shared/
│   ├── errors/         # AppError
│   └── infra/          # Express app, Prisma, middlewares
└── main/
    └── server.ts       # Entry point
```

Cada use case concentra a lógica de negócio. Controllers são finos: validam entrada, delegam ao use case e formatam a resposta HTTP.

---

## Banco de dados

**Provider:** MySQL 8

**Modelos principais:**

- `City` — nome único da cidade (entidade de agrupamento usada no dashboard e nas listagens)
- `Customer` — dados do cliente, relacionado a `City` via `city_id`

**Por que `company` e `title` ficam em `Customer`?**

Cidade foi normalizada porque é eixo central do produto (cards, filtros, rotas). Empresa e cargo são atributos descritivos do cliente — não há agrupamento, relatório ou CRUD por empresa/cargo no escopo. Tabelas `companies` / `titles` adicionariam joins e complexidade no seed sem ganho funcional para este teste (overengineering).

**Seed:** `prisma/seed.ts` lê `prisma/customers.json` e popula as tabelas.

### Comandos Prisma

```bash
npx prisma generate    # Gera o client
npx prisma db push     # Aplica schema no banco
npx prisma db seed     # Popula dados iniciais
npx prisma studio      # Interface visual (opcional)
```

---

## Variáveis de ambiente

Crie um arquivo `.env` na pasta `backend/` (necessário apenas para desenvolvimento local). Use o template:

```bash
cp .env.example .env
```

Conteúdo:

```env
DATABASE_URL="mysql://root:root@localhost:3306/tech_test"
JWT_SECRET="test_secret"
ADMIN_EMAIL="admin@email.com"
ADMIN_PASSWORD="admin"
```

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string MySQL |
| `JWT_SECRET` | Chave para assinar e validar JWT |
| `ADMIN_EMAIL` | E-mail do usuário administrativo |
| `ADMIN_PASSWORD` | Senha do usuário administrativo |

No Docker Compose, essas variáveis são injetadas automaticamente no serviço `backend`.

---

## Docker

O `Dockerfile` builda a aplicação para produção. No `docker compose up`, o backend:

1. Aguarda o MySQL ficar saudável
2. Executa `prisma db push` e `prisma db seed`
3. Inicia o servidor na porta `3000` (rede interna)

O frontend (Nginx) expõe a aplicação em http://localhost:8080 e faz proxy das rotas da API para este serviço.

---

## Executar localmente

**Pré-requisito:** MySQL rodando (ex.: container Docker na porta 3306).

```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

A API ficará disponível em http://localhost:3000

---

## Documentação da API (Swagger)

Interface interativa disponível em:

| Ambiente | URL |
|----------|-----|
| Local | http://localhost:3000/docs |
| Docker | http://localhost:8080/docs |

Spec OpenAPI em JSON: `/docs/openapi.json`

No Swagger UI, use **Authorize** com o token obtido em `POST /api/login` (`Bearer <token>`).

As requisições usam automaticamente o mesmo host do Swagger (ex.: `http://localhost:8080` no Docker). Não selecione `localhost:3000` no Docker — o backend não é exposto nessa porta.

---

## API

### Autenticação

```http
POST /api/login
Content-Type: application/json

{ "email": "admin@email.com", "password": "admin" }
```

Retorna `{ "token": "..." }`. Envie em todas as rotas de clientes:

```http
Authorization: Bearer <token>
```

### Clientes

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/customers/totals-by-city` | Totais agrupados por cidade |
| `GET` | `/api/customers?city=&page=&limit=` | Listagem paginada por cidade |
| `GET` | `/api/customers/:id` | Detalhes de um cliente |
| `PUT` | `/api/customers/:id` | Atualizar cliente |

**Query params da listagem:**

| Param | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `city` | string | — | Nome da cidade (ex.: `Warner, NH`) |
| `page` | number | `1` | Página atual |
| `limit` | number | `10` | Itens por página |

**WebSocket:** após um `PUT` bem-sucedido, o servidor emite `customer_updated` para todos os clientes conectados.

### Tratamento de erros

Erros de negócio lançam `AppError` com status HTTP apropriado. O middleware global `errorHandler` retorna:

```json
{ "error": "mensagem descritiva" }
```

---

## Scripts

```bash
npm run dev          # Servidor com hot reload (tsx)
npm run build        # Compila TypeScript → dist/
npm run type-check   # Verificação de tipos
npm run test         # Testes unitários (Jest)
npm run lint         # ESLint
npm run format       # Prettier
```

---

## Testes

Testes unitários cobrem os use cases de clientes e autenticação, com Prisma mockado:

```bash
npm test
```

Não há testes de integração HTTP; a cobertura foca na lógica de negócio isolada.

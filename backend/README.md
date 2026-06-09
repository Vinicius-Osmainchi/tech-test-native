# Backend — Customer Management API

API REST construída em **Node.js** e **TypeScript** para gerenciamento de clientes, projetada com foco em Clean Architecture, Autenticação JWT segura e notificações reativas em tempo real via Socket.IO.

Para executar o projeto completo com um único comando (Fullstack via Docker), consulte o [README da raiz](../README.md).

---

## 🛠️ Tecnologias e Ecossistema

| Tecnologia             | Uso                                                                       |
| ---------------------- | ------------------------------------------------------------------------- |
| **Express 5**          | Servidor HTTP de alta performance (com suporte nativo a promises).        |
| **Prisma ORM 6**       | Modelagem de dados, tipagem estática e migrations (MySQL).                |
| **jsonwebtoken (JWT)** | Autenticação Stateless e controle de acesso a rotas protegidas.           |
| **Socket.IO**          | Comunicação WebSocket bidirecional para atualizações de UI em tempo real. |
| **Jest**               | Framework de testes para garantir a integridade das regras de negócio.    |

---

## 🧠 Arquitetura e Padrões de Projeto

O código foi desenhado para ser testável, coeso e altamente escalável. A estrutura adota **Vertical Slicing** (fatiamento por domínio de negócio) e aplica os princípios de **Clean Architecture** (SOLID, especificamente a Inversão de Dependência):

```text
src/
├── modules/
│   ├── auth/           # Domínio de Autenticação (Login e JWT)
│   └── customers/      # Domínio de Clientes
│       ├── domain/     # Entidades e tipagens puras do negócio
│       ├── useCases/   # Casos de uso (Regras de negócio isoladas)
│       └── infra/      # Detalhes de implementação externa
│           ├── database/ # Repositórios (Isolamento do Prisma ORM)
│           └── http/     # Controllers e Rotas Express
├── shared/
│   ├── errors/         # Classes de erro customizadas (AppError)
│   └── infra/          # Configurações globais (App, Middlewares, Socket)
└── main/
    └── server.ts       # Entry point da aplicação
```

### 🛡️ O Padrão de Repositório e Casos de Uso

- **Controllers Finos:** Responsáveis apenas por receber a requisição HTTP, instanciar as dependências e devolver a resposta.
- **UseCases (Agnósticos):** Toda a lógica de negócio vive aqui. Eles não sabem que o banco de dados é MySQL ou Prisma. Eles dependem apenas de contratos.
- **Repositórios (Infra):** A única camada que interage de fato com o banco de dados. Isso permite que a aplicação seja amplamente testada através de Mocks, sem necessidade de levantar um banco real.

---

## 💾 Banco de Dados e Trade-offs (YAGNI)

**Provider:** MySQL 8

**Modelos principais:**

- `City` — Entidade normalizada contendo o nome único da cidade. Base para agrupamento de dados de alta performance.
- `Customer` — Tabela principal, relacionada à `City` via `city_id`.

**Decisão de Arquitetura: Por que `company` e `title` não são tabelas separadas?**
Aplicamos o princípio **YAGNI (You Aren't Gonna Need It)**. A cidade foi normalizada porque é o eixo central da navegação e relatórios do produto. Empresa e cargo são apenas atributos descritivos do perfil. Criar tabelas adicionais para eles adicionaria complexidade de joins desnecessária, configurando um _overengineering_ para o escopo atual de negócio.

### Comandos Prisma

- `npx prisma generate`: Gera o client tipado (Roda automaticamente no install)
- `npx prisma db push`: Sincroniza o schema com o banco de dados
- `npx prisma db seed`: Popula o banco com os dados iniciais de teste
- `npx prisma studio`: Abre a interface visual de administração do banco

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
npx prisma studio
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do backend copiando o template (necessário apenas para desenvolvimento local):

```bash
cp .env.example .env
```

| Variável         | Descrição                                   |
| ---------------- | ------------------------------------------- |
| `DATABASE_URL`   | Connection string do MySQL local.           |
| `JWT_SECRET`     | Chave criptográfica para assinar os tokens. |
| `ADMIN_EMAIL`    | Credencial padrão injetada pelo Seed.       |
| `ADMIN_PASSWORD` | Senha padrão injetada pelo Seed.            |

_(Nota: No ambiente Docker Compose, essas variáveis são resolvidas e injetadas automaticamente na rede)._

---

## 🐳 Execução via Docker

No `docker compose up`, o ciclo de vida deste contêiner realiza as seguintes etapas:

1. Aguarda o `Healthcheck` do MySQL garantir que o banco está pronto.
2. Executa as migrações (`prisma db push`) e popula o banco (`prisma db seed`).
3. Inicia a API na porta `3000` (exposta apenas na rede interna do Docker).

---

## 💻 Desenvolvimento Local

**Pré-requisito:** Uma instância do MySQL rodando na porta 3306.

```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

A API ficará disponível em `http://localhost:3000`.

---

## 📖 Documentação Interativa (Swagger)

A API é auto-documentada usando o padrão OpenAPI.

| Ambiente   | URL                          |
| ---------- | ---------------------------- |
| **Local**  | `http://localhost:3000/docs` |
| **Docker** | `http://localhost:8080/docs` |

No Swagger UI, utilize o botão **Authorize** informando o token JWT (`Bearer <token>`) gerado na rota de Login para testar os endpoints protegidos diretamente pelo navegador. O redirecionamento de diretório `/docs/` está configurado nativamente.

---

## 🌐 Endpoints Principais

### Autenticação

```http
POST /api/login
Content-Type: application/json

{ "email": "admin@email.com", "password": "admin" }
```

Retorna a chave JWT que deve ser enviada via Header (`Authorization: Bearer <token>`) nas rotas abaixo.

### Clientes

| Método | Rota                                | Descrição                                         |
| ------ | ----------------------------------- | ------------------------------------------------- |
| `GET`  | `/api/customers/totals-by-city`     | Retorna o volume agrupado de clientes por cidade. |
| `GET`  | `/api/customers?city=&page=&limit=` | Listagem paginada (Evita over-fetching).          |
| `GET`  | `/api/customers/:id`                | Detalhes em profundidade de um cliente.           |
| `PUT`  | `/api/customers/:id`                | Atualiza o cliente e dispara o evento WebSocket.  |

### Tratamento de Erros e Resiliência

A aplicação conta com um _Error Handler Global_. Exceções não mapeadas retornam 500, enquanto regras de negócio quebradas (ex: cliente não encontrado) lançam instâncias de `AppError` com o _Status Code_ adequado e tipado:

```json
{
  "code": "CUSTOMER_NOT_FOUND",
  "message": "Customer not found"
}
```

---

## 🧪 Qualidade e Testes

A suíte de testes unitários foca onde o valor está: as regras de negócio (`UseCases`). A camada de infraestrutura (Banco de Dados/Prisma) é 100% mockada através da abstração dos Repositórios, garantindo testes independentes e ultrarrápidos.

_(Executa a suíte Jest)_

```bash
npm run test
```

## 📜 Scripts Úteis

- `npm run dev`: Inicia servidor com tsx (Hot Reload)
- `npm run build`: Transpila o projeto para JavaScript (dist/)
- `npm run type-check`: Varredura estática de tipagem do TypeScript
- `npm run lint`: Validação de regras e padronização (ESLint)
- `npm run format`: Formatação padronizada de código (Prettier)

```bash
npm run dev
npm run build
npm run type-check
npm run lint
npm run format
```

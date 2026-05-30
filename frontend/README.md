# Frontend — Tech Test Native

Dashboard em **React** e **TypeScript** para visualizar clientes por cidade, navegar listagens paginadas e editar detalhes, com atualização em tempo real via WebSocket.

Para executar o projeto completo com um comando, consulte o [README da raiz](../README.md).

---

## Tecnologias

| Tecnologia | Uso |
|------------|-----|
| React 19 | UI |
| Vite 8 | Build e dev server |
| React Router 7 | Navegação |
| Ant Design 6 | Componentes (cards, tabela, formulário) |
| Tailwind CSS 4 | Estilização utilitária |
| Axios | Requisições HTTP |
| Socket.IO Client | Atualização do dashboard em tempo real |
| Nginx | Servidor estático e proxy reverso (Docker) |

---

## Arquitetura

```
src/
├── data/
│   └── services/       # Comunicação com API e WebSocket
│       ├── api.ts          # Instância Axios + interceptor JWT
│       ├── AuthService.ts
│       ├── CustomerService.ts
│       └── socket.ts
├── domain/
│   └── models/         # Tipos compartilhados (ex.: AuthToken)
└── presentation/
    ├── components/     # AuthGuard e componentes reutilizáveis
    ├── pages/          # Telas + hooks de cada página
    └── routes/         # Definição de rotas
```

Cada página segue o padrão **componente + hook** (`index.tsx` + `use*.ts`), separando UI da lógica de dados.

---

## Páginas e rotas

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/login` | `Login` | Autenticação com JWT |
| `/dashboard` | `Dashboard` | Cards clicáveis com total de clientes por cidade |
| `/city/:cityName` | `CityCustomers` | Tabela paginada; clique na linha abre detalhes |
| `/customer/:id` | `CustomerDetails` | Formulário de edição do cliente |

Rotas protegidas passam pelo `AuthGuard`, que redireciona para `/login` se não houver token em `localStorage` (`@TechTest:token`).

---

## Integração com a API

As requisições usam URLs relativas (`baseURL` vazio), o que permite:

- **Docker:** Nginx faz proxy de `/api`, `/docs` e `/socket.io` para o backend
- **Dev local:** Vite proxy encaminha `/api` para `localhost:3000` (base URL do Axios: `/api`)

O interceptor do Axios anexa automaticamente o header:

```http
Authorization: Bearer <token>
```

**WebSocket:** conecta na mesma origem da aplicação. O dashboard e a listagem por cidade escutam o evento `customer_updated` e recarregam os dados após uma edição.

Opcionalmente, defina `VITE_API_URL` para apontar a outro host (ex.: em deploy customizado).

---

## Docker

O `Dockerfile` faz build de produção com Vite e serve os arquivos estáticos via Nginx. A configuração em `nginx.conf` inclui:

- Fallback SPA (`try_files` → `index.html`)
- Proxy reverso para a API e WebSocket do backend

No `docker compose up`, acesse http://localhost:8080

> **Nota:** alterações no código do frontend exigem `docker compose up --build` para refletir na tela. Para hot reload, use `npm run dev` localmente.

---

## Executar localmente

**Pré-requisito:** API rodando em http://localhost:3000

```bash
npm install
npm run dev
```

Acesse http://localhost:5173 e faça login com:

| Campo | Valor |
|-------|-------|
| Email | `admin@email.com` |
| Senha | `admin` |

---

## Scripts

```bash
npm run dev          # Dev server com HMR
npm run build        # Build de produção (dist/)
npm run preview      # Preview do build
npm run type-check   # Verificação de tipos
npm run lint         # ESLint
npm run format       # Prettier
```

---

## Fluxo do usuário

1. **Login** — obtém JWT e armazena no `localStorage`
2. **Dashboard** — cards exibem `{ city, customers_total }`; clique navega para a cidade
3. **Lista por cidade** — paginação de 10 itens; clique no cliente abre detalhes
4. **Detalhes** — formulário de edição; ao salvar, a API emite WebSocket e o dashboard atualiza automaticamente

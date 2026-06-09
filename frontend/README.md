# Frontend — Customer Dashboard

Dashboard Single Page Application (SPA) construído com **React** e **TypeScript** para gerenciamento de clientes. Focado em performance, reatividade em tempo real e arquitetura escalável.

Para executar o projeto completo via Docker, consulte o [README da raiz](../README.md).

---

## 🛠️ Tecnologias e Ecossistema

| Tecnologia           | Uso                                                      |
| -------------------- | -------------------------------------------------------- |
| **React 19**         | Renderização da Interface de Usuário                     |
| **Vite 8**           | Build tool ultrarrápido e Dev Server                     |
| **React Router 7**   | Roteamento declarativo no client-side                    |
| **Ant Design 6**     | Biblioteca de componentes robusta (Tabelas, Formulários) |
| **Tailwind CSS 4**   | Estilização utilitária e responsiva                      |
| **Axios**            | Cliente HTTP configurado com interceptadores             |
| **Socket.IO Client** | Sincronização de dados em tempo real (WebSockets)        |
| **Nginx**            | Servidor web estático e Proxy Reverso (Ambiente Docker)  |

---

## 🧠 Arquitetura e Decisões de Design

Para garantir que o projeto seja fácil de manter e escalar, o frontend foi estruturado aplicando princípios de **Clean Architecture** adaptados para o ecossistema React:

    src/
    ├── data/
    │   └── services/       # Camada de comunicação (API, HTTP, WebSockets)
    ├── domain/
    │   └── models/         # Interfaces e Tipagens de domínio compartilhadas
    └── presentation/
        ├── components/     # Componentes visuais burros (Dumb Components) e Guards
        ├── pages/          # Páginas roteáveis (Smart Components)
        └── routes/         # Configuração centralizada de navegação

### O Padrão de Isolamento (Custom Hooks)

Em vez de misturar JSX, requisições HTTP e controle de estado no mesmo arquivo, cada página segue o padrão de **Separação de Lógica e Apresentação**:

- `index.tsx`: Focado 100% na UI, renderização e uso de componentes do Ant Design/Tailwind.
- `use[PageName].ts`: Um Custom Hook dedicado que encapsula todo o ciclo de vida, chamadas de API e escuta de WebSockets.

---

## 🚦 Páginas e Fluxo de Usuário

A navegação é protegida por um componente `AuthGuard`. Se um usuário não autenticado tentar acessar rotas internas, será redirecionado imediatamente para o `/login`.

| Rota              | Componente        | Responsabilidade                                                                 |
| ----------------- | ----------------- | -------------------------------------------------------------------------------- |
| `/login`          | `Login`           | Autenticação, emissão e armazenamento do JWT.                                    |
| `/dashboard`      | `Dashboard`       | Visão panorâmica: Cards reativos com o agrupamento total de clientes por cidade. |
| `/city/:cityName` | `CityCustomers`   | Data Table com paginação nativa (Server-side) listando os clientes da cidade.    |
| `/customer/:id`   | `CustomerDetails` | Formulário de edição. Salvar dispara um evento global de atualização.            |

---

## 🔌 Integração, API e Tempo Real

As requisições HTTP foram desenhadas para funcionar de forma fluida tanto localmente quanto em contêineres:

- **Estratégia de Proxy:** A base URL do Axios é uma rota relativa (`/api`). No Docker, o **Nginx** intercepta e redireciona para o backend. No desenvolvimento local, o **Vite** assume o papel de proxy. Isso resolve problemas de CORS e mantém o código agnóstico de ambiente.
- **Interceptador JWT:** O Axios está configurado para injetar automaticamente o cabeçalho `Authorization: Bearer <token>` em todas as requisições protegidas, lendo o token diretamente do `localStorage`.
- **Reatividade (WebSocket):** O frontend estabelece uma conexão com o Socket.IO. Sempre que a API emite o evento `customer_updated` (indicando que outro usuário editou um cliente), o Dashboard e as listagens recarregam seus dados silenciosamente em background, mantendo a tela atualizada sem necessidade de F5.

---

## 🐳 Docker e Produção

O `Dockerfile` desta camada utiliza um build multi-stage:

1. Compila a aplicação estática e minificada usando o Vite.
2. Serve os arquivos resultantes usando um contêiner **Nginx** otimizado.

O arquivo `nginx.conf` inclui:

- Resolução de Fallback para SPA (`try_files $uri /index.html`).
- Proxy Reverso para `/api`, `/docs` e handshake do `/socket.io`.

_(Nota: Para refletir alterações de código no contêiner, é necessário rodar `docker compose up --build`)._

---

## 💻 Como Executar Localmente (Dev Mode)

Para usufruir do _Hot Module Replacement (HMR)_ durante o desenvolvimento:

**Pré-requisito:** Certifique-se de que a API (Backend) esteja rodando em `http://localhost:3000`.

    npm install
    npm run dev

Acesse `http://localhost:5173` no navegador e faça login com:

- **Email:** `admin@email.com`
- **Senha:** `admin`

---

## 📜 Scripts Disponíveis

    npm run dev          # Inicia o servidor de desenvolvimento Vite com HMR
    npm run build        # Gera o bundle otimizado para produção na pasta dist/
    npm run preview      # Simula o servidor de produção localmente
    npm run type-check   # Executa o compilador TS para validação estática de tipos
    npm run lint         # Executa a verificação de regras do ESLint
    npm run format       # Formata o código fonte com o Prettier

# Tech Test - Backend

Este é o ecossistema de backend da aplicação, desenvolvido em **Node.js** utilizando **TypeScript** e seguindo os princípios de uma **Arquitetura Modular Orientada a Recursos (Feature-Driven / Vertical Slicing)**.

---

## 🏗️ Arquitetura e Design de Software

O projeto adota uma abordagem moderna de **Clean Architecture**, utilizando uma divisão vertical por módulos (*Vertical Slicing*). 

### Pilares da Escolha Arquitetural
1. **Alta Coesão**: Todas as responsabilidades de um mesmo contexto de negócio são agrupadas sob o mesmo módulo (`src/modules/nome-do-modulo`). Isso elimina a necessidade de navegar por pastas globais distantes para dar manutenção a um único recurso.
2. **Baixo Acoplamento**: Mantemos a regra de ouro da Clean Architecture intacta. A lógica de negócio e os casos de uso são independentes de frameworks, drivers e ferramentas externas (como Express ou Prisma).
3. **Escalabilidade Pragmática**: Evita o *overengineering* de dezenas de pastas vazias na raiz desde o primeiro dia. O projeto cresce de forma orgânica.

---

## 🛠️ Tecnologias e Decisões de Libs

* **Express**: Escolhido por sua maturidade, estabilidade e flexibilidade no ecossistema Node.js.
* **Prisma ORM (v6)**: Acoplado para a comunicação com o banco MySQL. Proporciona tipagem estática ponta a ponta gerada automaticamente a partir do schema de dados.
* **jsonwebtoken (JWT)**: Adotado para controle de autenticação via credenciais administrativas seguras mapeadas no `.env`.
* **Jest & ts-jest**: Framework de testes unitários. A execução foi otimizada via `isolatedModules`, reduzindo o tempo de inicialização de testes para a escala de milissegundos.

---

## 🚀 Integração Contínua (CI/CD)

* **Husky (Local)**: Valida as mensagens de commit (*Commitlint*) e intercepta o comando `git push`, impedindo o envio em caso de falhas de tipagem estática ou quebra de testes.
* **GitHub Actions (Nuvem)**: Pipeline automatizada a cada push para a branch `main`, garantindo qualidade do build final.

---

## 🔧 Como Executar o Projeto

1. Inicie o banco de dados na raiz do monorepo:
   ```bash
   docker compose up -d
   ```
2. Acesse a pasta `backend`, instale as dependências e gere o cliente do Prisma:
   ```bash
   npm install
   npx prisma generate
   ```
3. Execute o seed para alimentar a base de dados MySQL:
   ```bash
   npx prisma db seed
   ```
4. Execute o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## 🧪 Executando a Suíte de Testes

Para rodar os testes unitários isolados:
```bash
npm run test
```
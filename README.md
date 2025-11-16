# 🚚 RocketLog – API de Entregas

A **RocketLog** é uma API REST para gerenciamento de entregas, com perfis de **vendedor** e **cliente**, autenticação por **JWT**, controle de **autorização por role**, gerenciamento de **status de pedidos** e registro de **logs de entrega**.

Ela foi construída com foco em **boas práticas**, **organização de código**, **testes automatizados** e **integração com PostgreSQL via Docker**.

---

## ✨ Funcionalidades

- Cadastro de usuários com senha criptografada (Bcrypt)
- Autenticação com **JSON Web Token (JWT)**
- Perfis de usuário com **roles** (ex.: `client`, `sale`)
- Criação e listagem de **entregas (deliveries)**
- Atualização de **status da entrega**: `processing`, `shipped`, `delivered`
- Registro de **logs de entrega** (movimentações e mensagens)
- Controle de acesso por **autorização** (apenas perfis específicos podem acessar certas rotas)
- Validação de dados com **Zod**
- Testes automatizados com **Jest + Supertest**
- Integração com **Prisma ORM** e **PostgreSQL** via Docker

---

## 🛠️ Stack Tecnológica

- **Node.js**
- **TypeScript**
- **Express**
- **PostgreSQL** (via Docker + imagem `bitnami/postgresql`)
- **Prisma ORM**
- **Zod** (validação)
- **Bcryptjs** (hash de senha)
- **JWT (jsonwebtoken)** (autenticação)
- **Jest** + **Supertest** (testes)
- **Docker / Docker Compose**

---

## 🚀 Como rodar o projeto localmente

✅ Pré-requisitos

- Node.js (versão LTS)
- npm ou yarn
- Docker + Docker Compose
- PostgreSQL (via Docker – já configurado no docker-compose.yml)

1️⃣ Clonar o repositório
- git clone https://github.com/SEU-USUARIO/17.api-entregas.git
- cd api-entregas

2️⃣ Instalar as dependências
- bash 
-Copiar código
- npm install

3️⃣ Subir o banco de dados com Docker
- docker compose up -d
# ou, dependendo da versão:
**docker-compose up -d**
Isso vai subir um container com o PostgreSQL na porta 5432 usando a imagem bitnami/postgresql.

4️⃣ Configurar as variáveis de ambiente
- Crie um arquivo .env na raiz do projeto (se ainda não existir):
- env

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rocketlog?schema=public"

# JWT
JWT_SECRET="uma_chave_bem_segura_aqui"
O DATABASE_URL deve bater com a configuração do seu docker-compose.yml e do schema.prisma.

5️⃣ Rodar as migrações (Prisma)
- npx prisma migrate dev

Isso vai:
- criar o banco rocketlog (se ainda não existir),
- criar as tabelas de User, Delivery, DeliveryLog, enums etc.
- Você pode visualizar o banco com:
  - npx prisma studio

6️⃣ Iniciar o servidor
- npm run dev
- Saída esperada:
  `O SERVIDOR ESTA RODANDO: PORTA 3333`

Por padrão, a API fica disponível em:
http://localhost:3333

7️⃣ Rodar os testes
- npm test
- Utiliza Jest + Supertest

**Testa as rotas de criação de usuário, validações e autenticação**

## 🔐 Autenticação e Autorização
JWT
- O usuário faz login na rota /sessions

- Em caso de sucesso, a API retorna: dados do usuário e um token JWT

Esse token deve ser enviado no header:
- Authorization: Bearer SEU_TOKEN_AQUI

### Middleware ensureAuthenticated
- Verifica se o token está presente e válido
- Decodifica o token e anexa user.id e user.role ao request

### Middleware verifyUserAuthorization
- Recebe uma lista de roles permitidas
- Exemplo: apenas usuários com role sale podem criar entregas

## 📚 Principais Recursos da API

### 👤 Usuários
POST /users
- Criação de usuário.
- Validação com Zod (nome, email, senha)
- Senha é hashada com bcryptjs
- Role padrão: client

### 🔑 Sessões (Autenticação)
POST /sessions
Login do usuário.
- Validação de usuario por email, de senha correspondente
- Geração de token, com tempo de expiração 

### 📦 Deliveries (Entregas)
POST /deliveries
- Criação de entrega (apenas para usuários com role sale).
- Também é possível configurar o include para mostrar informações do usuário associado à entrega.

### 🏷️ Status da entrega
PATCH /deliveries/:id/status
- Atualiza o status da entrega.
- Valida se o status é um valor válido do enum
- Registra alterações conforme regras de negócio

### 📝 Logs de Entrega
**POST /delivery-logs**
- Cria um novo log para uma entrega.
- Regras:
  - Verifica se a entrega existe
  - Verifica se o status permite logs (ex.: não criar logs para entregas ainda em processing, ou já delivered)
  - Apenas usuários com role adequada (ex.: sale) podem criar logs

**GET /delivery-logs/:deliveryId**
- Lista os logs de uma entrega específica.
- Regras:
  - Cliente só pode ver logs de entregas que são dele
  - Vendedor pode ver logs de entregas que gerencia

## 🧪 Testes (Jest + Supertest)
O projeto conta com testes automatizados para:

- Criação de usuário:
  - sucesso (201)
  - email duplicado (400)
  - email inválido (validação Zod)
  - Autenticação de sessão (em construção/expansão)

## 👩‍💻 Autoria
Projeto desenvolvido por Amanda
Focado em estudo de:
  - Node.js + TypeScript
  - Boas práticas de APIs REST
  - Autenticação e autorização
  - Banco de dados relacional com Prisma ORM
  - Testes automatizados em aplicações back-end

## 🎯 Objetivo do Projeto
- Este projeto foi desenvolvido para solidificar conhecimentos de:
  - arquitetura de APIs REST
  - autenticação e autorização
  - ORM relacional (Prisma)
  - testes automatizados
  - fluxos completos de CRUD
  - uso de Docker para desenvolvimento

## 🖥️ Insominia
- Criação de usuário (POST /users)
- ![alt text](in-user-create.png)

- Erro de email duplicado (POST /users)
- ![alt text](in-user-error.png)

- Login de usuarios (POST /sessions)
- ![alt text](in-session-create.png)

- Uso do token no header (Authorization: Bearer) para criação de entrega feita por pessoa autorizada
  - http://localhost:3333/deliveries
  - ![alt text](in-deliveries-token.png)

- Listagem de entregas (GET /deliveries) por pessoa autorizada
  - ![alt text](in-deliveries-list.png)

- Atualização de status (PATCH /deliveries/:id/status) por pessoa autorizada
- ![alt text](in-deliveries-update-status.png)

- Visualização de logs (GET /delivery-logs/:deliveryId)
-![alt text](in-deliveriesLogs-show.png)

## 🧠 Fluxo mental completo
-![alt text](src/assets/fluxo-mental.jpg)



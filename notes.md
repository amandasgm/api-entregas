# API DE ENTREGAS - ROCKETLOG
A API terá perfis de vendedor e cliente, com níveis de acesso definidos. Vamos implementar o envio de pedidos, gerenciar status como "processando", "enviado" e "entregue", e registrar as movimentações da entrega. Isso permitirá que os usuários acompanhem o status de suas entregas em tempo real.

## Criando o projeto
### 1. package.json
  -  `npm init -y` 
  - 1.1 Configurando o package.json

### 2. express 
Express é um framework (ou biblioteca) para Node.js usado para criar servidores e APIs web de forma simples, rápida e organizada.
 - `npm i express`
 - `npm i --save-dev @types/express` 

### 3. pasta src
  - 3.1 server.ts - servidor
  - 3.2 app.ts - aplicação
    - 3.2.1 configurações basicas
      - Importa o framework Express, que facilita criar e gerenciar servidores HTTP no Node.js (como rotas, middlewares, etc)
      - Converte automaticamente o corpo das requisições (body) em JSON.
      - Exporta a aplicação app
  
### 4. typescript 
  - `npm i typescript @types/node -D`
  - 4.1 tsx
    - `npm i tsx -D`
  - 4.2 criando as configurações do tsconfig.json
    - `npx tsc --init` 
    - configuracoes padrao:![alt text](src/assets/tsconfig.png)
    - 4.2.1
      - passando o "app" como "@/app" no server

### 5. middleware
Gerenciador de exeções na aplicação
  - 5.1 -> criando a pasta middlewares
   #### 5.2 error-handling.ts 
   Para erros personalizados
  - 5.3 AppError.ts
    - criando uma CLASSE para personalizar o erro e adicionamos a classe no middleware
  - 5.4 express-async-errors (a aula diz para instalar)
    - OBS: Desde o v5 DO EXPRESS, ele trata promises rejeitadas/async handlers nativamente: você pode escrever async (req, res) e qualquer throw ou rejeição vai para o middleware de erro, ou seja: **NAO PRECISA INSTALAR**
  - 5.5 passando o error-handling.ts  para a aplicação

### 6. Zod
-  O Zod serve para validar dados (ex: corpo de requisição, query params, variáveis de ambiente)
-  E também para gerar tipos TypeScript automaticamente a partir dessas validações.
- `npm i zod`

### 7. Routes e Controller
  #### ROUTES
  Define os caminhos (rotas da API)
  - É onde você diz “quando o cliente acessar tal URL, chame tal controller”.
    - 7.2 Router de Usuarios
    - 7.3 Router Index: centraliza todas as rotas aqui (users, products, orders...)
      - 7.3.1 Importamos os router para a aplicação: app.ts
      - HIERARQUIA DE ARQUIVOS:
      ![alt text](src/assets/hierarquia.png)

  #### CONTROLLERS
  Recebe e responde requisições
  - Os controllers são responsáveis por:
    - são responsáveis por lidar com as requisições e respostas HTTP
    - e devolver o resultado
    - **Define as CRUD**

    - 7.1 Controller para gerenciar Usuarios
      - 7.1.2 POST: metodo de criação de usuarios

### 8. Criando projeto no Insomnia
  - 8.1 New colletion - Rocket Log
  - 8.2 Base Enviroment -> Shared enviroment -> dev
    - ![alt text](src/assets/insomnia-enviroment.png)
  - 8.3 Enviroment: 
    - `{"RESOURCE": "users}`

## Banco de dados

![alt text](src/assets/relaction-db.png)
- drawsql.app: https://drawsql.app/teams/amanda-18/diagrams/api-de-entregas-rocketlog
### 9. Docker
  -> docker ps -a: lista todos os containers
  -> docker image ls: lista todas as imagens
  - 9.1 Criação do Docker Compose
    - 9.1.1 Cria o arquivo na raiz do projeto e configura: 
    - ![alt text](src/assets/docker-config.png)
    - 9.1.2 Cria o docker compose
    `docker-compose up -d`
  - 9.2 Rodando o banco de dados (beekeeper)

### 10. Prisma ORM
  - 10.1 Instalando
    - `npm i prisma -D`
      - 10.1.1 Inicializando: inicializa o projeto com as configurações basicas para poder usar o Prisma com O postgres como banco de dados
        - `npx prisma init --datasource-provider postgresql`
        - muda a database_url => *DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rocketlog?schema=public"*
      - 10.1.2 adicionando no package.json a varivel de ambiente(env) no script
        - antes: `"dev": "tsx watch src/server.ts"`
        - depois: `"dev": "tsx watch --env-file .env src/server.ts"`

  - 10.2 Modelo das tabelas (prisma/schema.prisma)
    - 10.2.1 Usuarios
      - Por padrao, todo novo usuario é um cliente (UserRole: client)
      - ![alt text](src/assets/model-user.png)
    - 10.2.2 Deliveries
      - Por padrao, todo novo delivery esta "processando" (DeliveryStatus: processing )
      - A relação com a tabela de usuario é definida: `user User @relation(fields: [userId], references: [id])`
      - **OBS: A RELAÇÃO SEMPRE PRECISAR SER ESTABELECIDA NAS DUAS TABELAS QUE ESTÃO SE RELACIONANDO**
      - Adicionando a relação na tabela de User: `deliveries Delivery[]`
      - ![alt text](src/assets/model-delivery.png)
    - 10.2.3 Delivery Log
      - Relacionamento com o delivery: `delivery Delivery @relation(fields: [deliveryId], references: [id]`: cada delivery tem um delivery_log (status), mas um delivery log so pode estar associado a um delivery
      - **OBS: A RELAÇÃO SEMPRE PRECISAR SER ESTABELECIDA NAS DUAS TABELAS QUE ESTÃO SE RELACIONANDO**
      - Adicionando a relação na tabela de Delivery: `deliveryLogs DeliveryLog[]`
      - ![alt text](src/assets/model-log.png)

    - **Roles e Status(enum): opções para uma das colunas da tabela**
      ![alt text](src/assets/enum-tables.png)

  - 10.3 Migrates
    - 10.3.1 criando as tabelas ja modeladas no prisma
      - `npx prisma migrate dev` -> create-table [nome do banco de dados]
      - visualizando as tabelas pelo Prisma Studio  
        - 10.3.2 `npx prisma studio`





      
## Usuários
### 11. ZOD - Validação
#### 11.1 Validando dados do usuario
  - 11.1.1 importando o zod para trabalhar com a validação de usuarios
  - Definimos que os campos preenchidos:
    - z.string() = sejam string
    - trim() = ignorem espaços em branco
    - min(x) = tenham um minimo de caracters
    - email() = seja do tipo email(zod tem essa propriedade)


  - OBS => Quando alguém envia um formulário ou JSON (ex: { "name": "Juliete", "email": "juliete@email.com", "password": "1234" }), esses dados chegam dentro de request.body.

  `const { name, email, password } = bodySchema.parse(request.body)`
      => 1. Pega o corpo da requisição (request.body);
        2. Valida ele usando o schema (bodySchema);
        3. Extrai (desestrutura) as variáveis name, email e password já validadas — prontas pra usar.
        4. “Fazer o parse” é ler e interpretar um dado. 
  `![alt text](src/assets/zod-user.png)

#### 11.2 Criptografando senha do usuario
  - 11.2.1 BCRYPT
    - instalando: `npm i bcryptjs`
    - instalando tipagem: `npm install -D @types/bcryptjs`
    - importamos e seguimos: `const hashedPassword = await hash(password, 8);`

### 12. Prisma Database
- configuração e inicialização do Prisma Client, que é o responsável por conectar sua aplicação Node.js ao banco de dados.
  - 12.1 importando o prisma client e configurando => database/prisma.ts
  - 12.2 importando o prisma database no controller de usuarios

### 13. Cadastrando usuarios no bando de dados
  - 13.1 Verificando se o email ja existe, importando o AppError para personalizar a mensagem de erro
  ![alt text](src/assets/zod-email-existe.png)
  - 13.2 Criando usuario no banco de dados
    - ![alt text](src/assets/creating-user.png)
    - 13.2.1 Nao retornando a senha no banco de dados
      - `const { password: _, ...userWithoutPassword } = user;`

- METHOD DE POST / CREATE
![alt text](src/assets/user-create.png)

### 14. Criando controller e rota de autenticação
  - criando o arquivo `session-controller.ts` + `session-routes.ts` => **importamos o routes no index.ts**
  - criamos no insomnia a pasta sessions e o enviroment para "RESOURCE": "sessions"
  - 14.1 VALIDAÇOES
    - 14.1.2 Usamos o email para encontrar o usuario
      - `const user = await prisma.user.findFirst({ where: { email, password } });`
    - 14.1.3 Caso 1:  nao tem nenhum usuario com esse email
      - `if (!user) { throw new AppError("Email ou senha inválidos", 401);}`
    - 14.1.4 caso 2: Comparação da senha fornecida com a senha armazenada no banco de dados. Em um cenário real, a senha armazenada deve ser hashada e você deve usar uma função de comparação de hash
      - `const passwordMatches = await compare(password, user.password);`
      - 14.1.4.1 Caso a senha não corresponda
        - `if (!passwordMatches) {throw new AppError("Email ou senha inválidos", 401);}`

#### 15. TOKEN DE AUTENTICAÇÃO
  - 🔐 O que é o “token do usuário”

  - Depois que o usuário faz login (ou seja, envia e-mail e senha corretos), o servidor precisa de uma forma segura de reconhecer esse usuário nas próximas requisições — sem que ele precise enviar a senha toda hora.

  - 👉 Aí entra o token, que é um código digital único (geralmente um JWT, JSON Web Token).
  Ele representa a sessão autenticada desse usuário.

  - 15.1 JSON WEB TOKEN
    - instalando: `npm i jsonwebtoken`
    - 15.1.2 criando pasta **configs -> auth.ts**
      - ![alt text](src/assets/auth-config.png)
      - Esse trecho de código define a configuração de autenticação com JWT (JSON Web Token) — uma forma muito comum de autenticar usuários em aplicações Node.js.
      - `expiresIn: '1d'`
        - Indica o tempo de expiração do token.
        - '1d' = 1 dia (você também pode usar '2h', '30m', etc.).
        - Depois desse tempo, o usuário precisa fazer login de novo para gerar outro token.
    - 15.1.3 .env => JWT_SECRET= chave_super_secreta
      - ** tem um site chamado hash-generate que gera hashs de segurança

  - 15.2 passando o token de autenticação para o controller
    - 15.2.1 sign() => A função sign() do pacote jsonwebtoken serve para gerar um token JWT — ou seja, criar o token que **identifica um usuário** autenticado.
      - precisamos instalar a tipagem = `npm i --save-dev @types/jsonwebtoken`
  
    - 15.2.1 o secret nao pode ser undefined, temos que resolver:
      - 15.2.1.a ![alt text](src/assets/secre-undefined.png)
      - 15.2.1.b criamos o arquivo env.ts e passamos as configurações
      - 15.2.1.c no auth.ts importamos e mudamos as configuraçoes do secret
        ![alt text](src/assets/secret.png)


  - 15.3 retornando a resposta completa da sessao com o usuario autenticado

## Autenticação e Autorização 
### 16. Autenticação


#### 16.1 Middleware de autenticação de token
- Vai verificar se o usuário está autenticado antes de permitir o acesso a certas rotas.
![alt text](src/assets/middleware-autheticated.png)

- 16.1.1 Importações
  - verify → função do jsonwebtoken, usada pra validar o token JWT enviado pelo usuário.

  - authConfig → normalmente contém a chave secreta (secret) e o tempo de expiração do token.

  - AppError → uma classe customizada pra lançar erros padronizados (ex: mensagens e status HTTP).

- 16.1.2 Interface
  - Essa interface define o formato dos dados dentro do token JWT (as “claims”).
  Por exemplo: role → papel do usuário (ex: client, sale, admin etc.), sub → normalmente o ID do usuário (vem do “subject” do token JWT).

  ** payload: É o conteúdo que você define ao gerar o token, com informações sobre o usuário.
  ![alt text](src/assets/exemplo-payload.png)

- 16.1.3 Middleware
- Funçoes:
  - Ler o token JWT do cabeçalho da requisição (geralmente Authorization: Bearer <token>).
  - Verificar se o token é válido usando verify() do jsonwebtoken.
  - Decodificar o token e extrair o sub (ID do usuário) e o role.
  - Anexar essas informações ao request, pra que os controllers saibam quem é o usuário logado.
  - Chamar next() se estiver tudo certo, ou lançar AppError se o token estiver ausente ou inválido.

- FORMATO DO TOKEN NO CABEÇALHO: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...`

  - a. verifica se o token esta presente no cabeçalho
  - b. se estiver presente, verifica se é valido
  - c. seguir para a proxima etapa

- EM RESUMO
![alt text](src/assets/middleware-auth-step1.png)
![alt text](src/assets/middleware-auth-step2.png)
![alt text](src/assets/middleware-auth-step3.png)

  

  ** no request user... ele vai reclamar de tipagem, nesse momento precisamos criar uma tipagem para ele
    - 16.1.3.1 types/express.d.ts
    - ![alt text](src/assets/express-types.png)



#### 17. Deliveries
- 17.1 Criando controller e o arquivo base com metodo post
  ##### No insomnia: 
    - 1. Criamos a pasta de Deliveries
    - 2. Criamos o metodo post
    - 3. definimos o enviroment - sempre
    - 4. em "auth" habilitamos a utilização do token e fazemos a requisição pegar automaticamente o valor correspondente para retornar
    ![alt text](src/assets/insomnia-token-automatic.png)
      - **o token precisa vir do metodo post onde ele foi criado**

- 17.2 Criando a rota
  - 17.2.1 na rota adicionamos o `ensureAuthenticated` para usuarios autenticados

  ### 18. Autorização
  Vamos verificar se o usuario tem autorização para consultar oq ele esta tentando consultar 
  - 18.1.1 `verify-user-authorization.ts`
  - 18.1.2 dentro de deliveries-routes.ts passamos o middleware de autorização **deliveriesRoutes.post("/", ensureAuthenticated, `verifyUserAuthorization(['sale'])`, deliveriesController.create);**
    - Dentro dele passamos o array de que tipo de role esta autorizada a entrar em URL com rotas /deliveries
    

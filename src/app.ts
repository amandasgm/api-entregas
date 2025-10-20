import express from 'express';

import { router } from './routes'; // importando as rotas para a aplicação
import { errorHandling } from './middlewares/error-handling';

const app = express(); // aplicação express

app.use(express.json()); // convertendo as requisições para JSON

app.use(router); // rotas da aplicação

app.use(errorHandling); // middleware de tratamento de erros

export { app };
// 7.3 Centralizamos as rotas da aplicação aqui
import { Router } from 'express';
import { usersRoutes } from './users-routes';
import { sessionsRoutes } from './sessions-routes';

const router = Router();

// ! Rotas de usuários
router.use('/users', usersRoutes);

// ! Rotas de sessões
router.use('/sessions', sessionsRoutes);

// Podemos adicionar mais rotas aqui, como productsRoutes, ordersRoutes, etc.

export { router };
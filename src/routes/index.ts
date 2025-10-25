// 7.3 Centralizamos as rotas da aplicação aqui
import { Router } from 'express';

import { usersRoutes } from './users-routes';
import { sessionsRoutes } from './sessions-routes';
import { deliveriesRoutes } from './deliveries-routes';


const router = Router();

// ! Rotas de usuários
router.use('/users', usersRoutes);

// ! Rotas de sessões
router.use('/sessions', sessionsRoutes);

// ! Rotas de entregas
router.use('/deliveries', deliveriesRoutes);

export { router };
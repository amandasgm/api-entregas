// 7.2 Rotas de Usuários
import { Router } from 'express';
import { UsersController } from '../controllers/users-controller';

const usersRoutes = Router();
const usersController = new UsersController();

usersRoutes.post('/', usersController.create); // post / create

export { usersRoutes };
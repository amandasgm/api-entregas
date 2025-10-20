// 7.1 Controller para gerenciar usuários
import { Request, Response, NextFunction } from 'express';

class UsersController {

  // 7.1.2 POST / CREATE
  create(request: Request, response: Response, next: NextFunction){
    return response.json({ message: 'Usuario criado' });
  }

}

export { UsersController };
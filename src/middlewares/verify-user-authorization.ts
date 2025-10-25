// 18. verifica se o usuario tem autorização para acessar determinada rota
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/AppError';

function verifyUserAuthorization(role: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // verifica se o usuario esta autenticado, ou seja, se o usuario existe na requisição
    if(!req.user) {
      throw new AppError('Usuário não autenticado', 401);
    }

    // verifica se o usuario tem a role necessária para acessar a rota
    if(!role.includes(req.user.role)) {
      throw new AppError('Usuário não autorizado', 401);
    }

    return next();
  }
}  

export { verifyUserAuthorization };
// 16.1 Middleware de autenticação de token

// importaçoes
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { authConfig } from '@/configs/auth';
import { AppError } from '@/utils/AppError';

// 16.1.2 Interface para o formato do payload do token
interface TokenPayload {
  role: string;
  sub: string;
}

// 16.1.3 Middleware para garantir que o usuário está autenticado
export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  try {

    // a. Verificar se o token está presente 
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new AppError('Token ausente.', 401);
    }

    // b. Verificar se o token é válido
    const [, token] = authHeader.split(' '); // Bearer <token>

    const { role, sub:user_id } = verify(token, authConfig.jwt.secret) as TokenPayload;
    request.user = {
      id: user_id,
      role
    };

    // c. Prosseguir para o próximo middleware ou rota
    return next();

  } catch (error) {
    throw new AppError('Token inválido.', 401);
  }
}
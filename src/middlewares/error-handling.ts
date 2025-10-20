// 5.2 Middleware de Tratamento de Erros
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { ZodError } from 'zod';

export function errorHandling(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.error(error); // mostra o erro no console

  // Se o erro for uma instância de AppError, retorna a resposta com o status e a mensagem do erro
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({message: error.message});
  }

  // Se o erro for uma instância de ZodError, retorna um erro de validação 400
  if(error instanceof ZodError) {
    return response.status(400).json({
      message: 'Validation error por Zod',
      issues: error.format(),
    });
  }

  // Se não for um AppError nem ZodError, retorna um erro genérico 500
  return response.status(500).json({message: 'Internal server error'});
}  
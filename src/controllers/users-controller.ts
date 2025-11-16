// 7.1 Controller para gerenciar usuários
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { hash } from 'bcryptjs'; // 11.2.1 Importando bcryptjs para hashing de senhas
import { prisma } from "@/database/prisma"; // 12.2
import { AppError } from '@/utils/AppError';


class UsersController {

  // 7.1.2 POST / CREATE
  async create(request: Request, response: Response, next: NextFunction) {
    
    // Validação dos dados de entrada usando Zod
    const bodySchema = z.object({
      name: z.string().trim().min(2),
      email: z.string().email(),
      password: z.string().min(6)
    });
    const { name, email, password } = bodySchema.parse(request.body); 

    // 13.1 verificar se o email já existe no banco de dados
    const userWithSameEmail = await prisma.user.findFirst({ where: { email } }); 
    if (userWithSameEmail) {
      throw new AppError('Este email já está em uso.');
    }

    // 11.2.2 Criptografar a senha antes de salvar no banco de dados
    const hashedPassword = await hash(password, 8);

    //  13.2 Lógica para salvar o usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    // 13.2.1 Retornar o usuário criado (sem a senha)
    const { password: _, ...userWithoutPassword } = user;

    return response.status(201).json(userWithoutPassword);
  }
}


export { UsersController };
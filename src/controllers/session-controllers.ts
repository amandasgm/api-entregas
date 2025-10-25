import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { compare } from "bcryptjs";
import { authConfig } from "@/configs/auth";
import { sign } from "jsonwebtoken";

class SessionControllers {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = bodySchema.parse(request.body); 

    // usa o email para encontrar o usuário
    const user = await prisma.user.findFirst({ where: { email } }); 

    // 14.1.3 Validação: "caso nao tenha nenhum usuário com esse email"
    if (!user) {
      throw new AppError("Email ou senha inválidos", 401);
    }

    // 14.1.4 Comparação da senha fornecida com a senha armazenada no banco de dados
    const passwordMatches = await compare(password, user.password);

    // 14.1.4.1 caso a senha não corresponda
    if (!passwordMatches) {
      throw new AppError("Email ou senha inválidos", 401);
    }

    // 15.2 Gerando o token de autenticação JWT
    const { secret, expiresIn } = authConfig.jwt;

    // 15.2.1 sign() => A função sign() do pacote jsonwebtoken serve para gerar um token JWT — ou seja, criar o token que **identifica um usuário** autenticado.
    const token = sign({ role: user.role ?? "client" }, secret, {
      subject: user.id,
      expiresIn,
    })

    // 15.3 Retornando a resposta sem a senha do usuário
    const { password: _, ...userWithoutPassword } = user;

    return response.json({ message: 'Sessão criada com sucesso', token, user: userWithoutPassword });
  }
}

export { SessionControllers };
import { Request, Response } from 'express';
import { prisma } from '@/database/prisma';
import { z } from 'zod';


class DeliveriesController {
  async create(request: Request, response: Response) {
    // 18.1.1 validação dos dados de entrada usando zod
    const bodySchema = z.object({
      user_id: z.string().uuid(),
      description: z.string().min(5),
    });

    const { user_id, description } = bodySchema.parse(request.body);

    // 18.1.2 Logica para criar a entrega no banco de dados
    await prisma.delivery.create({
      data: {
        userId: user_id, // usuário que está associado à entrega
        description: description,
      },
    });

    return response.status(201).json({ message: 'Delivery created' });
  }

  async index(request: Request, response: Response) {
    // 18.2.1 lógica para listar todas as entregas do banco de dados
    const deliveries = await prisma.delivery.findMany({
      include: {
        user: { select: { name: true, email: true } }, // inclui os dados do usuário associado à entrega,
      },
    });

    return response.json(deliveries);
  }
}

export { DeliveriesController };
// 19. status do controller de entregas
import { Request, Response } from 'express';
import { prisma } from '@/database/prisma';
import { z } from 'zod';

class DeliveriesStatusController {
  async update(request: Request, response: Response) {

    // 19.1 validação dos dados de entrada usando zod
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });
    // validação do body
    const bodySchema = z.object({
      status: z.enum(['processing', 'shipped', 'delivered']),
    });

    // extrai os dados validados
    const { id } = paramsSchema.parse(request.params);
    const { status } = bodySchema.parse(request.body);

    // 19.2 Logica para atualizar o status da entrega no banco de dados
    await prisma.delivery.update({
      data: {
        status: status, // "é o status que quero atualizar"
      }, where: {
        id: id, // "é o id da entrega que quero atualizar"
      },
    });

    //20.4 Registrando no Log Alteração do Status
    await prisma.deliveryLog.create({
      data: {
        deliveryId: id,
        description: `Delivery status changed to ${status}`,
      },
    });

    return response.status(200).json({ message: 'Delivery status updated' });
  }
}

export { DeliveriesStatusController };
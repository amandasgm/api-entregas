// 20 controller de logs de entregas
import { Request, Response, NextFunction } from 'express';  
import { z } from 'zod';
import { prisma } from '@/database/prisma';
import { AppError } from '@/utils/AppError';

class DeliveryLogsController {
  
  // 20.1 criando o log da entrega
  async create(request: Request, response: Response, next: NextFunction) {
    // a. validação dos dados de entrada usando zod
    const bodySchema = z.object({
      description: z.string().min(5),
      delivery_id: z.string().uuid(),
    });

    const { description, delivery_id } = bodySchema.parse(request.body);

    // b. busca um unico registo ONDE o id seja igual ao delivery_id
    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
    });

    // c. Verifica se a entrega existe
    if (!delivery) {
      throw new AppError('Delivery not found', 404);
    }

    //20.3 condição: se um pedido ja foi entregue, ele não pode receber novos logs
    if(delivery.status === 'delivered') {
      throw new AppError('Delivered deliveries cannot receive new logs', 400);
    }

    // d. Verifica se a entrega está em status 'processing'
    if(delivery.status === 'processing') {
      throw new AppError('Change to shipped status before creating log', 400);
    }

    // e. Logica para criar o log da entrega
    const deliveryLog = await prisma.deliveryLog.create({
      data: {
        description,
        deliveryId: delivery_id,
      },
    });

    return response.status(201).json({ message: 'Delivery log created' });
    
  }

  // 20.2 mostrando os logs da entrega
  async show(request: Request, response: Response, next: NextFunction) {

    // a. validação dos dados de entrada usando zod
    const paramsSchema = z.object({
      delivery_id: z.string().uuid(),
    });

    const { delivery_id } = paramsSchema.parse(request.params);

    // b. busca um unico registo ONDE o id seja igual ao delivery_id
    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
      include: { 
        user: true,
        logs: { select: { description: true } },  // d. Logica para mostrar os logs da entrega, somente a descrição
      }
    });

    // c. Verifica se o usuário é um cliente e se ele é o proprietário da entrega
    if(request.user?.role === "client" && request.user.id !== delivery?.userId) {
      throw new AppError('The user can only view their own delivery logs', 403);
    }

    return response.status(200).json({ delivery});
  }

}

export { DeliveryLogsController };
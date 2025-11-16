// 20.1.1 rotas de logs de entregas
import { Router } from "express";

import { DeliveryLogsController } from "@/controllers/delivery-logs-controller";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const deliveryLogsRoutes = Router();
const deliveryLogsController = new DeliveryLogsController(); // instanciando o controller de status


// ! Rota para criar um novo log de entrega (apenas para usuários autenticados)
deliveryLogsRoutes.post("/", ensureAuthenticated, verifyUserAuthorization(['sale']),deliveryLogsController.create);

// ! Rota para mostrar os logs de uma entrega específica (apenas para usuários autenticados)
deliveryLogsRoutes.get("/:delivery_id/show", ensureAuthenticated, verifyUserAuthorization(['sale', 'client']), deliveryLogsController.show);

export { deliveryLogsRoutes };
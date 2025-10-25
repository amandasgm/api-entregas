import { Router } from "express";

import { DeliveriesController } from "@/controllers/deliveries-controller";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const deliveriesRoutes = Router();
const deliveriesController = new DeliveriesController(); // instanciando o controller

// Rota para criar uma nova entrega (apenas para usuários autenticados)
deliveriesRoutes.post("/", ensureAuthenticated, verifyUserAuthorization(['sale']), deliveriesController.create);

export { deliveriesRoutes };
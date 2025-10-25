import { Router } from "express";

import { DeliveriesController } from "@/controllers/deliveries-controller";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";


const deliveriesRoutes = Router();
const deliveriesController = new DeliveriesController(); // instanciando o controller

// Usando o middleware para garantir que o usuário está autenticado
deliveriesRoutes.use(ensureAuthenticated,verifyUserAuthorization(['sale']));

// ! Rota para criar uma nova entrega (apenas para usuários autenticados)
deliveriesRoutes.post("/", deliveriesController.create);

// ! Rota para listar todas as entregas (apenas para usuários autenticados)
deliveriesRoutes.get("/", deliveriesController.index);

export { deliveriesRoutes };
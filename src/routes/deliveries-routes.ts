import { Router } from "express";

import { DeliveriesController } from "@/controllers/deliveries-controller";
import { DeliveriesStatusController } from "@/controllers/deliveries-status-controller";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";


const deliveriesRoutes = Router();
const deliveriesController = new DeliveriesController(); // instanciando o controller
const deliveriesStatusController = new DeliveriesStatusController(); // instanciando o controller de status


// Usando o middleware para garantir que o usuário está autenticado
deliveriesRoutes.use(ensureAuthenticated,verifyUserAuthorization(['sale']));

// ! Rota para criar uma nova entrega (apenas para usuários autenticados)
deliveriesRoutes.post("/", deliveriesController.create);

// ! Rota para listar todas as entregas (apenas para usuários autenticados)
deliveriesRoutes.get("/", deliveriesController.index);

// ! Rota para atualizar o status de uma entrega (apenas para usuários autenticados)
deliveriesRoutes.patch("/:id/status", deliveriesStatusController.update);

export { deliveriesRoutes };
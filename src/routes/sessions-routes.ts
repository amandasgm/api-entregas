import { Router } from "express";
import { SessionControllers } from "../controllers/session-controllers";

const sessionsRoutes = Router() 
const sessionControllers = new SessionControllers()

sessionsRoutes.post('/', sessionControllers.create); // post / create

export { sessionsRoutes };
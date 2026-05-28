import {Router} from 'express'
import {ServiceController} from '../controllers/Services.controller'
import { AuthenticationVerify } from '../middlewares/Auth.middleware';

export const serviceRouter = Router();

const serviceController = new ServiceController();

serviceRouter.get("/services/:id_service", serviceController.getService);
serviceRouter.get("/services", serviceController.getAllServices);
serviceRouter.post("/services", AuthenticationVerify, serviceController.createService);
serviceRouter.patch("/services/:id_service", AuthenticationVerify, serviceController.updateService);
serviceRouter.delete("/services/:id_service", AuthenticationVerify, serviceController.deleteService);
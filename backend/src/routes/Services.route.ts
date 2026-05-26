import {Router} from 'express'
import {ServiceController} from '../controllers/Services.controller'

export const serviceRouter = Router();

const serviceController = new ServiceController();

serviceRouter.get("/services/:id_service", serviceController.getService);
serviceRouter.get("/services", serviceController.getAllServices);
serviceRouter.post("/services", serviceController.createService);
serviceRouter.patch("/services/:id_service", serviceController.updateService);
serviceRouter.delete("/services/:id_service", serviceController.deleteService);
import {Router} from 'express'
import {AppointmentController} from '../controllers/Appointment.controller'
import { AuthenticationVerify } from '../middlewares/Auth.middleware';

export const appointmentRouter = Router()

const appointmentController = new AppointmentController();

appointmentRouter.get("/appointments/user/:id_user", AuthenticationVerify , appointmentController.getAppointmentByUser);
appointmentRouter.get("/appointments/barber/:id_barber", AuthenticationVerify , appointmentController.getAppointmentsByBarber);
appointmentRouter.get("/appointments/:id_appointment", AuthenticationVerify , appointmentController.getAppointment)
appointmentRouter.get("/appointments", AuthenticationVerify , appointmentController.getAllAppointments);
appointmentRouter.post("/appointments",AuthenticationVerify ,appointmentController.createAppointment);
appointmentRouter.post("/appointments/guest", appointmentController.createAppointmentAsGuest);
appointmentRouter.patch("/appointments/:id_appointment", AuthenticationVerify , appointmentController.updateAppointment);
appointmentRouter.delete("/appointments/:id_appointment",AuthenticationVerify , appointmentController.deleteAppointment);

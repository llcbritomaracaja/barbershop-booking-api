import {Router} from 'express'
import {AppointmentController} from '../controllers/Appointment.controller'

export const appointmentRouter = Router()

const appointmentController = new AppointmentController();

appointmentRouter.get("/appointments/user/:id_user", appointmentController.getAppointmentByUser);
appointmentRouter.get("/appointments/barber/:id_barber", appointmentController.getAppointmentsByBarber);
appointmentRouter.get("/appointments/:id_appointment", appointmentController.getAppointment)
appointmentRouter.get("/appointments", appointmentController.getAllAppointments);
appointmentRouter.post("/appointments", appointmentController.createAppointment);
appointmentRouter.patch("/appointments/:id_appointment", appointmentController.updateAppointment);
appointmentRouter.delete("/appointments/:id_appointment", appointmentController.deleteAppointment);

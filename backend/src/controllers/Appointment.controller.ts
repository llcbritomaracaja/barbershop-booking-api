import {AppointmentService} from "../services/Appointment.service"
import {Response, Request} from 'express'
import { NotBarberError } from "../errors/NotBarberError"
import { Appointment } from "../entities/Appointments.entity"
import { User } from "../entities/Users.entity"
import { UserService } from "../services/Users.service"
import { Service } from "../entities/Services.entity"
import { ServiceServices } from "../services/Services.service"

export class AppointmentController{
    appointmentService: AppointmentService
    userService: UserService
    serviceServices: ServiceServices

    constructor(appointmentService = new AppointmentService(), userService = new UserService(), serviceServices = new ServiceServices()){
        this.appointmentService = appointmentService,
        this.userService = userService,
        this.serviceServices = serviceServices
    }

    getAppointment = async(request: Request, response: Response) => { 
        try{
            const {id_appointment} = request.params
            const id = Number(id_appointment);

            const appointment = await this.appointmentService.getAppointment(id);

            if (!appointment) return response.status(404).json({message: "Agendamento não encontrado."})
            
            const id_authUser = request.user?.id_user
            const role_authUser = request.user?.role

            if (appointment.user?.id_user === id_authUser || role_authUser === "ADMIN" || role_authUser === "BARBER") {
                
                return response.status(200).json({
                    id_appointment: appointment.id_appointment,
                    date: appointment.appointment_date,
                    hour: appointment.appointment_hour,
                    id_barber: appointment.barber?.id_user,
                    barber: appointment.barber?.name,
                    id_user: appointment.user?.id_user,
                    user_name: appointment.user?.name,
                    user_email: appointment.user?.email,
                    user_number: appointment.user?.number,
                    id_service: appointment.service?.id_service,
                    service: appointment.service?.name
                })
            } else return response.status(403).json({message: "Não autorizado."})

        } catch {
            return response.status(500).json({ message: "Erro ao buscar agendamento "})
        }
    }

    getAppointmentByUser = async(request: Request, response: Response) => { 

        try {

            const {id_user} = request.params
            const id = Number(id_user)

            if(!id_user) return response.status(400).json({message: "ID do usuário não informado."})

            const id_authUser = request.user?.id_user;
            const role = request.user?.role

            if (id_authUser === id || role === "ADMIN" || role === "BARBER"){
                const appointments = await this.appointmentService.getAppointmentByUser(id);

                if(!appointments || appointments.length === 0) return response.status(200).json([]);

                const appointmentsMap = appointments.map(a => ({
                    id_appointment: a.id_appointment,
                    id_barber: a.barber?.id_user,
                    barber_name: a.barber?.name,
                    barber_email: a.barber?.email,
                    id_user: a.user?.id_user,
                    user_name: a.user?.name,
                    user_email: a.user?.email,
                    date: a.appointment_date,
                    hour: a.appointment_hour,
                    id_service: a.service?.id_service,
                    service_name: a.service?.name,
                    service_description: a.service?.description,
                    service_price: a.service?.price
                }))

                return response.status(200).json(appointmentsMap) 
            } else return response.status(403).json({message: "Não autorizado."})

        } catch (e) {
            return response.status(500).json({message: "Erro ao buscar agendamentos de usuário."})
            console.log(e)
        }
    }

    getAppointmentsByBarber = async(request: Request, response: Response)=> {
        try {
            const {id_barber} = request.params;
            const id = Number(id_barber);

            if(!id_barber) return response.status(400).json({message:"ID de barbeiro não informado."})

            const id_authBarber = request.user?.id_user
            const role = request.user?.role

            if (id_authBarber === id || role === "ADMIN" || role === "BARBER"){
                
                const appointments = await this.appointmentService.getAppointmentByBarber(id);

                if (!appointments || appointments.length === 0) return response.status(200).json([])

                const appointmentsMap = appointments.map(a => ({
                        id_appointment: a.id_appointment,
                        id_barber: a.barber?.id_user,
                        barber_name: a.barber?.name,
                        barber_email: a.barber?.email,
                        id_user: a.user?.id_user,
                        user_name: a.user?.name,
                        user_email: a.user?.email,
                        date: a.appointment_date,
                        hour: a.appointment_hour,
                        id_service: a.service?.id_service,
                        service_name: a.service?.name,
                        service_description: a.service?.description,
                        service_price: a.service?.price
                }))

                return response.status(200).json(appointmentsMap)
            } else return response.status(403).json({ message: "Não autorizado."})

        } catch {
            return response.status(500).json({message: "Erro ao buscar agendamentos de barbeiro."})
        }
    }

    getAllAppointments = async(request: Request, response: Response) => {
        try {

            const role = request.user?.role

            if (role !== "ADMIN") return response.status(403).json({message: "Não autorizado."})
                
            const appointments = await this.appointmentService.getAllAppointments();

            if (!appointments || appointments.length === 0) return response.status(200).json([]);

            const appointmentsMap = appointments.map(a => ({
                id_appointment: a.id_appointment,
                barber: a.barber,
                user: a.user,
                date: a.appointment_date,
                hour: a.appointment_hour,
                service: a.service
            }))
            
            return response.status(200).json(appointmentsMap)
        } catch {
            return response.status(500).json({ message: "Erro ao listar agendamentos."})
        }
    }

    createAppointment = async(request: Request, response: Response) => {
        try {

            const id_user = Number(request.user?.id_user)
            const role = request.user?.role

            const {appointment_date, appointment_hour, id_barber, id_service} = request.body;

            if (!appointment_hour || !appointment_date || !id_barber || !id_service) return response.status(400).json({message: "Preencha todas as informações de agendamento."})

            const appointment = {
                appointment_date,
                appointment_hour,
                id_user,
                id_barber,
                id_service
            }

            await this.appointmentService.createAppointment(appointment);

            const user = await this.userService.getUser(id_user)
            const barber = await this.userService.getUser(id_barber)
            const service = await this.serviceServices.getService(id_service)

            await this.appointmentService.createAppointmentNotification( user?.email as string, "Seu agendamento foi confirmado!", user?.name as string, barber?.name as string, appointment_date as string, appointment_hour as string, service?.name as string)
            await this.appointmentService.createAppointmentNotification(barber?.email as string, "Você recebeu um novo agendamento.", user?.name as string, barber?.name as string, appointment_date as string, appointment_hour as string, service?.name as string)


            return response.status(201).json({message: "Agendamento criado com sucesso!"})
            
        } catch (error:any) {

            console.log(error)

            if(error instanceof(NotBarberError)) return response.status(400).json({message: "Não foi possível marcar um agendamento com o ID fornecido por não se tratar de um barbeiro."})

            if (error.code === "23505") return response.status(409).json({message: "Esse horário já está ocupado."})

            return response.status(500).json({message: "Erro ao criar agendamento."})
        }
    }

    createAppointmentAsGuest = async(request:Request, response:Response) => {
        try {
            const {appointment_date, appointment_hour, guest_name, guest_email, guest_number, id_barber, id_service} = request.body

            if (!appointment_date || !appointment_hour || !guest_name || !guest_email || !guest_number || !id_barber || !id_service) return response.status(400).json({ message: "Preencha todas as informações de agendamento."})

            const appointment = {
                appointment_date,
                appointment_hour,
                guest_name,
                guest_email,
                guest_number,
                id_barber,
                id_service
            }

            const barber = await this.userService.getUser(id_barber)
            const service = await this.serviceServices.getService(id_service);

            await this.appointmentService.createAppointmentAsGuest(appointment);
            await this.appointmentService.createAppointmentNotification( barber?.name as string,"Você recebeu um novo agendamento.", guest_name as string, barber?.name as string, appointment_date as string, appointment_hour as string, service?.name as string)
            
            return response.status(200).json({message: "Agendamento como visitante criado com sucesso!"})
        } catch (error: any) {
            
            if (error instanceof(NotBarberError) ) return response.status(400).json({ message: "Não foi possível criar um agendamento com o ID fornecido por não se tratar de um barbeiro."})

            if (error.code === "23505") return response.status(409).json({message: "Esse horário já esta ocupado."})
            return response.status(500).json({ message: "Erro ao criar agendamento como visitante."})
        }
    }

    updateAppointment = async(request: Request, response: Response) => {
        try {
            const {id_appointment} = request.params;
            const id = Number(id_appointment);

            if (!id) return response.status(400).json({message: "ID de agendamento não informado."})

            const id_authUser = request.user?.id_user
            const role = request.user?.role

            const oldAppointment = await this.appointmentService.getAppointment(id)

            if(!oldAppointment)return response.status(400).json({message: "Nenhum agendamento foi encontrado com esse ID."})
            
            if (oldAppointment?.user?.id_user === id_authUser || role === "ADMIN" || role === "BARBER"){
                const appointment = request.body;

                if (!appointment || Object.keys(appointment).length === 0) return response.status(400).json({message: "Nenhuma alteração feita."})

                const updatedAppointment = await this.appointmentService.updateAppointment(id, appointment);

                if (!updatedAppointment) return response.status(400).json({message: "Agendamento inexistente para ser atualizado."})

                if (updatedAppointment.user) await this.appointmentService.updateAppointmentNotification(updatedAppointment.user?.email as string, oldAppointment as Appointment, updatedAppointment as Appointment)
                if (updatedAppointment.guest_email) await this.appointmentService.updateAppointmentNotification(updatedAppointment.guest_email as string, oldAppointment as Appointment, updatedAppointment as Appointment)

                await this.appointmentService.updateAppointmentNotification(updatedAppointment.barber?.email as string, oldAppointment as Appointment, updatedAppointment as Appointment)

                return response.status(200).json({message: "Agendamento atualizado com sucesso!",
                    appointment_date: updatedAppointment.appointment_date,
                    appointment_hour: updatedAppointment.appointment_hour,
                    user_name: updatedAppointment.user?.name,
                    user_email: updatedAppointment.user?.email,
                    user_number: updatedAppointment.user?.number,
                    service_name: updatedAppointment.service?.name,
                })

            } else return response.status(403).json({ message: "Não autorizado."})
        } catch (error:any) {
            
            if (error.code === "23505") return response.status(409).json({message: "Esse horário já está ocupado."})

            return response.status(500).json({ message: "Erro ao atualizar agendamento." })
        }
    }

    deleteAppointment = async(request: Request, response: Response) => {
        try {
            const role = request.user?.role
            const id_user = request.user?.id_user

            const {id_appointment} = request.params;

            const id = Number(id_appointment);

            if(!id) return response.status(400).json({message: "ID de agendamento não informado."})

            const appointment = await this.appointmentService.getAppointment(id);

            if(!appointment) return response.status(404).json({message: "Nenhum agendamento foi encontrado para ser deletado."})

            if (appointment?.user?.id_user === id_user || role === "ADMIN" || role === "BARBER" ) {

                const success = await this.appointmentService.deleteAppointment(id);

                if (appointment.user) await this.appointmentService.deleteAppointmentNotification(appointment.user?.email as string, appointment as Appointment)
                if (appointment.guest_name) await this.appointmentService.deleteAppointmentNotification(appointment.guest_email as string, appointment as Appointment)

                await this.appointmentService.deleteAppointmentNotification(appointment.barber?.email as string, appointment as Appointment)

                return response.status(204).send();
            } else return response.status(403).json({message: "Não autorizado."})

        } catch  {
            return response.status(500).json({message: "Erro ao deletar agendamento."})
        }
    }

}
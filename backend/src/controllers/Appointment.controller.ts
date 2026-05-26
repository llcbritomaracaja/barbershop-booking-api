import {AppointmentService} from "../services/Appointment.service"
import {Response, Request} from 'express'

export class AppointmentController{
    appointmentService: AppointmentService

    constructor(appointmentService = new AppointmentService()){
        this.appointmentService = appointmentService
    }

    getAppointment = async(request: Request, response: Response) => { 
        try{
            const {id_appointment} = request.params

            const id = Number(id_appointment);

            const appointment = await this.appointmentService.getAppointment(id);

            if (!appointment) return response.status(404).json({message: "Agendamento não encontrado."})
            
            return response.status(200).json({
                id_appointment: appointment.id_appointment,
                date: appointment.appointment_date,
                hour: appointment.appointment_hour,
                barber: appointment.barber,
                user: appointment.user,
                service: appointment.service
            })

        } catch {
            return response.status(500).json({ message: "Erro ao buscar agendamento "})
        }
    }

    getAppointmentByUser = async(request: Request, response: Response) => { 

        try {

            const {id_user} = request.params

            if(!id_user) return response.status(400).json({message: "ID do usuário não informado."})

            const id = Number(id_user)
            
            const appointments = await this.appointmentService.getAppointmentByUser(id);

            if(!appointments || appointments.length === 0) return response.status(200).json([]);

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
            return response.status(500).json({message: "Erro ao buscar agendamentos de usuário."})
        }
    }

    getAppointmentsByBarber = async(request: Request, response: Response)=> {
        try {
            const {id_barber} = request.params;
            if(!id_barber) return response.status(400).json({message:"ID de barbeiro não informado."})
            
            const id = Number(id_barber);
            
            const appointments = await this.appointmentService.getAppointmentByBarber(id);

            if (!appointments || appointments.length === 0) return response.status(200).json([])

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
            return response.status(500).json({message: "Erro ao buscar agendamentos de barbeiro."})
        }
    }

    getAllAppointments = async(request: Request, response: Response) => {
        try {
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
            const appointmentData = request.body;

            if (!appointmentData.appointment_hour || !appointmentData.appointment_date) return response.status(400).json({message: "Preencha todas as informações de agendamento."})

            const appointment = await this.appointmentService.createAppointment(appointmentData);

            return response.status(201).json({message: "Agendamento criado com sucesso!"})
        } catch  {
            return response.status(500).json({message: "Erro ao criar agendamento."})
        }
    }

    // updateAppointment 
    updateAppointment = async(request: Request, response: Response) => {
        try {
            const {id_appointment} = request.params;
            const id = Number(id_appointment);

            if (!id) return response.status(400).json({message: "ID de agendamento não informado."})

            const appointment = request.body;

            if (!appointment || Object.keys(appointment).length === 0) return response.status(400).json({message: "Nenhuma alteração feita."})

            const updatedAppointment = await this.appointmentService.updateAppointment(id, appointment);

            if (!updatedAppointment) return response.status(400).json({message: "Agendamento inexistente para ser atualizado."})

            return response.status(200).json(updatedAppointment)

        } catch  {
            return response.status(500).json({ message: "Erro ao atualizar agendamento." })
        }
    }

    deleteAppointment = async(request: Request, response: Response) => {
        try {
            const {id_appointment} = request.params;
            const id = Number(id_appointment);

            if (!id) return response.status(400).json({message: "ID de agendamento não informado."})

            const success = await this.appointmentService.deleteAppointment(id);

            if (!success) return response.status(404).json({message: "Nenhum agendamento foi encontrado para ser deletado."})

            return response.status(204).send();
        } catch  {
            return response.status(500).json({message: "Erro ao deletar agendamento."})
        }
    }
}
import {AppointmentRepository} from "../repositories/Appointments.repository";
import {Appointment} from "../entities/Appointments.entity";
import { User } from "../entities/Users.entity";
import { Service } from "../entities/Services.entity";
import { UserRepository } from "../repositories/Users.repository";
import { NotBarberError } from "../errors/NotBarberError";
import { ServicesRepository } from "../repositories/Services.repository";
import {Resend} from 'resend';
export class AppointmentService{
    appointmentRepository: AppointmentRepository
    userRepository: UserRepository
    servicesRepository: ServicesRepository

    constructor(appointmentRepository = new AppointmentRepository(), userRepository = new UserRepository(), servicesRepository = new ServicesRepository()){
        this.appointmentRepository = appointmentRepository
        this.userRepository = userRepository
        this.servicesRepository = servicesRepository
    }

    getAppointment = async(id_appointment:number): Promise<Appointment | null> => {
        return await this.appointmentRepository.getAppointment(id_appointment);
    }

    getAllAppointments = async(): Promise<Appointment [] | null> => {
        return await this.appointmentRepository.getAllAppointments();
    }

    getAppointmentByUser = async(id_user:number): Promise<Appointment[] | null> => {
        return await this.appointmentRepository.getAppointmentByUser(id_user);
    }

    getAppointmentByBarber = async(id_barber:number): Promise<Appointment [] | null> => {
        return await this.appointmentRepository.getAppointmentByBarber(id_barber);
    }


    createAppointment = async(appointmentData: any): Promise<Appointment> => {

        const appointment: Partial<Appointment> = {
            appointment_date: appointmentData.appointment_date,
            appointment_hour: appointmentData.appointment_hour,
            user: {id_user: appointmentData.id_user} as User,
            barber: {id_user: appointmentData.id_barber} as User,
            service: {id_service: appointmentData.id_service} as Service
        }


        const user = await this.userRepository.getUser(Number(appointment.user?.id_user))

        const barber = await this.userRepository.getUser(Number(appointment.barber?.id_user))

        const service = await this.servicesRepository.getService(Number(appointment.service?.id_service))

        if (!user || !barber || !service) throw new Error();
        
        if (barber?.role === "BARBER" || barber?.role === "ADMIN") {
            return await this.appointmentRepository.createAppointment(appointment);
        } else throw new NotBarberError();

    }

    createAppointmentAsGuest = async(appointmentData: any): Promise<Appointment> => {
        const appointment: Partial<Appointment> ={
            appointment_date: appointmentData.appointment_date,
            appointment_hour: appointmentData.appointment_hour,
            guest_name: appointmentData.guest_name,
            guest_email: appointmentData.guest_email,
            guest_number: appointmentData.guest_number,
            barber: {id_user: appointmentData.id_barber} as User,
            service: {id_service: appointmentData.id_service} as Service
        }

        const barber = await this.userRepository.getUser(Number(appointment.barber?.id_user))
        const service = await this.servicesRepository.getService(Number(appointment.service?.id_service))

        if (!barber || !service ) throw new Error()
        
        if (barber?.role === "BARBER" || barber?.role === "ADMIN") {
            return await this.appointmentRepository.createAppointmentAsGuest(appointment)
        } else throw new NotBarberError();
    }

    createAppointmentNotification = async(toEmail:string, subject:string, user_name:string, barber_name:string, date:string, hour:string, service_name:string) => {
        const resend_apikey = process.env.RESEND_APIKEY as string
        const resend = new Resend(resend_apikey)

        const resend_email = process.env.RESEND_EMAIL as string

        await resend.emails.send({
            from: resend_email,
            to: toEmail,
            subject: subject ,
            html: `
              <h1>Agendamento marcado.</h1>

                        <ul>
                            <li><strong>Barbeiro:</strong> ${barber_name}</li>
                            <li><strong>Cliente:</strong> ${user_name}</li>
                            <li><strong>Data:</strong> ${new Date(date).toLocaleDateString("pt-BR")}</li>
                            <li><strong>Horário:</strong> ${hour}</li>
                            <li><strong>Serviço:</strong> ${service_name}</li>
                        </ul>
                        <hr>
                        <p>
                            Em caso de dúvidas, entre em contato via <a href="https://www.instagram.com/mr.costabarbearia/"> Instagram</a>.
                        </p>
            `
        })

    }

    updateAppointment = async(id_appointment:number, appointmentData: Partial<Appointment>): Promise<Appointment | null> => {
        return await this.appointmentRepository.updateAppointment(id_appointment, appointmentData);
    }

    updateAppointmentNotification = async(toEmail:string, oldInfo:Appointment, updatedInfo:Appointment) => {
        const resend_apikey = process.env.RESEND_APIKEY as string
        const resend = new Resend(resend_apikey);

        const resend_email = process.env.RESEND_EMAIL as string

        await resend.emails.send({
                        from: resend_email,
                        to: toEmail,
                        subject: `Um dos seus agendamentos foi atualizado.`,
                        html:`
                            <h1>Agendamento atualizado.</h1>
        
                            <p>
                                O agendamento de <strong>${updatedInfo.user ? updatedInfo.user?.name : updatedInfo.guest_name}</strong> foi atualizado com sucesso.
                            </p>
        
                            <hr>
        
                            <h2>Antes</h2>
        
                            <ul>
                            <li> <strong>Barbeiro:</strong> ${oldInfo.barber?.name} </li>
                            <li> <strong>Data:</strong> ${new Date (oldInfo.appointment_date).toLocaleDateString("pt-BR")} </li>
                            <li> <strong>Horário:</strong> ${oldInfo.appointment_hour} </li>
                            <li> <strong>Serviço: </strong> ${oldInfo.service?.name} </li>
                            </ul>
        
                            <h2>
                                Agora
                            </h2>
        
                            <ul>
                                <li> <strong>Barbeiro:</strong> ${updatedInfo.barber?.name} </li>
                                <li><strong>Data:</strong> ${new Date(updatedInfo.appointment_date).toLocaleDateString("pt-BR")} </li>
                                <li><strong>Horário:</strong> ${updatedInfo.appointment_hour}</li>
                                <li><strong>Serviço:</strong> ${updatedInfo.service?.name}</li>
                            </ul>
        
                            <hr>
        
                            <p>
                                Em caso de dúvidas, entre em contato via <a href="https://www.instagram.com/mr.costabarbearia/"> Instagram</a>.
                            </p>
                            `                    
                    })
    }

    
    deleteAppointment = async(id_appointment:number): Promise<boolean> => {
        return await this.appointmentRepository.deleteAppointment(id_appointment)
    }

    deleteAppointmentNotification = async (toEmail:string, appointment: Appointment) => {
        const resend_apikey = process.env.RESEND_APIKEY as string
        const resend = new Resend(resend_apikey)
        const resend_email = process.env.RESEND_EMAIL as string

        await resend.emails.send({
            from: resend_email,
            to: toEmail,
            subject: "Agendamento cancelado.",
            html: `
                    <h1>Agendamento cancelado.</h1>

                        <p>
                            <strong>${appointment.user ? appointment.user?.name : appointment.guest_name}</strong> cancelou o seguinte agendamento:
                        </p>

                        <ul>
                            <li><strong>Barbeiro:</strong> ${appointment.barber?.name}</li>
                            <li><strong>Data:</strong> ${new Date(appointment.appointment_date).toLocaleDateString("pt-BR")}</li>
                            <li><strong>Horário:</strong> ${appointment.appointment_hour}</li>
                            <li><strong>Serviço:</strong> ${appointment.service?.name}</li>
                        </ul>

                        <hr>

                        <p>
                            Em caso de dúvidas, entre em contato via <a href="https://www.instagram.com/mr.costabarbearia/"> Instagram</a>.
                        </p>
            `
        })

    }


}
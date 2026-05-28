import {AppointmentRepository} from "../repositories/Appointments.repository";
import {Appointment} from "../entities/Appointments.entity";
import { User } from "../entities/Users.entity";
import { Service } from "../entities/Services.entity";
import { UserRepository } from "../repositories/Users.repository";
import { NotBarberError } from "../errors/NotBarberError";
import { ServicesRepository } from "../repositories/Services.repository";
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

    updateAppointment = async(id_appointment:number, appointmentData: Partial<Appointment>): Promise<Appointment | null> => {
        return await this.appointmentRepository.updateAppointment(id_appointment, appointmentData);
    }

    deleteAppointment = async(id_appointment:number): Promise<boolean> => {
        return await this.appointmentRepository.deleteAppointment(id_appointment)
    }
}
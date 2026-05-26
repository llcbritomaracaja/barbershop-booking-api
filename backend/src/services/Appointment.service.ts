import {AppointmentRepository} from "../repositories/Appointments.repository";
import {Appointment} from "../entities/Appointments.entity";

export class AppointmentService{
    appointmentRepository: AppointmentRepository

    constructor(appointmentRepository = new AppointmentRepository()){
        this.appointmentRepository = appointmentRepository
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

    createAppointment = async(appointmentData: Partial<Appointment>): Promise<Appointment> => {
        return await this.appointmentRepository.createAppointment(appointmentData)
    }

    updateAppointment = async(id_appointment:number, appointmentData: Partial<Appointment>): Promise<Appointment | null> => {
        return await this.appointmentRepository.updateAppointment(id_appointment, appointmentData);
    }

    deleteAppointment = async(id_appointment:number): Promise<boolean> => {
        return await this.appointmentRepository.deleteAppointment(id_appointment)
    }
}
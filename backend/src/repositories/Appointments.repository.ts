import {Appointment} from '../entities/Appointments.entity'
import {Repository} from 'typeorm';
import {AppDataSource} from '../app-data-source'

export class AppointmentRepository{
    private manager:Repository<Appointment>

    constructor(){this.manager = AppDataSource.getRepository(Appointment)}

    getAllAppointments = async ():Promise<Appointment[] | null> => {
        return await this.manager.find({
            relations: {
                user: true,
                barber: true,
                service: true
            }
        })
    }

    getAppointment = async(id_appointment: number): Promise<Appointment | null> => {
        return await this.manager.findOne({
            where:
             {
                id_appointment:id_appointment
            },
            relations:
            {
                user: true,
                barber: true,
                service: true
            }
        })};

        getAppointmentByUser = async(id_user:number): Promise <Appointment[] | null> => {

            return await this.manager.find({
                where: {
                    user: {id_user}
                },
                relations: {
                    user: true,
                    barber: true,
                    service: true
                }
            })
        }

        getAppointmentByBarber = async(id_barber: number): Promise<Appointment[] | null> => {
            return await this.manager.find({
                where:{
                    barber: {id_user: id_barber}
                },
                relations:{
                    user:true,
                    barber:true,
                    service:true
                }
            })
        }

        createAppointment = async (data: Partial<Appointment>): Promise<Appointment> => {
            const appointment = new Appointment();
            Object.assign(appointment, data);
            return await this.manager.save(appointment);
        };

        // updateAppointment = async(id_appointment: number, appointment_date: string, appointment_hour: string): Promise<Appointment | null> => {
        //     await this.manager.update({id_appointment}, {appointment_date, appointment_hour})
        //     return await this.getAppointment(id_appointment);
        // }

        updateAppointment = async(id_appointment: number, appointment: Partial<Appointment>): Promise <Appointment | null> => {  
            await this.manager.update(id_appointment, appointment)
            return await this.getAppointment(id_appointment)
        }

        deleteAppointment = async(id_appointment: number): Promise<boolean> => {
            const result = await this.manager.delete(id_appointment)
            return result.affected !== 0;
        }
}
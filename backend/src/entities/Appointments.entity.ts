import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./Users.entity";
import {Service} from "./Services.entity"


@Entity("appointments")
export class Appointment {
    @PrimaryGeneratedColumn()
    id_appointment!: number;

    @Column ({nullable: false, type: "date"})
    appointment_date!: string;

    @Column ({nullable: false, type: "time" })
    appointment_hour!: string;

    @ManyToOne(
        () => User,
        user => user.appointmentsAsClient,
        { nullable: false }
    )
    @JoinColumn({
        name: "id_user"
    })
    user!: User;

    @ManyToOne(
        () => User,
        user => user.appointmentsAsBarber,
        {nullable: false} 
    )
    @JoinColumn({
        name: "id_barber"
    })
    barber!: User;

    @ManyToOne(
        () => Service,
        service => service.appointments,
        { nullable: false }
    )
    @JoinColumn({
        name: "service_id"
    })
    service!: Service;


    constructor(appointment_date?: string, appointment_hour?: string){
        if (appointment_date) this.appointment_date = appointment_date;
        if (appointment_hour) this.appointment_hour = appointment_hour;
    }

}
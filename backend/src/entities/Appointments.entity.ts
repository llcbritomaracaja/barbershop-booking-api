import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Index} from "typeorm";
import { User } from "./Users.entity";
import {Service} from "./Services.entity"


@Entity("appointments")
@Index (["barber", "appointment_date", "appointment_hour"], {unique: true})

export class Appointment {
    @PrimaryGeneratedColumn()
    id_appointment!: number;

    @Column ({nullable: false, type: "date"})
    appointment_date!: string;

    @Column ({nullable: false, type: "time" })
    appointment_hour!: string;

    @Column ({type: "enum", enum: ["PENDING", "PAID", "FAILED", "REFUNDED"], default: "PENDING" }) // nao sei se vai dar certo 
    payment_status!: string;

    @Column ({nullable: true})
    guest_name!: string

    @Column({nullable: true})
    guest_email!: string

    @Column({nullable: true})
    guest_number!: string

    @ManyToOne(
        () => User,
        user => user.appointmentsAsClient,
        { nullable: true }
    )
    @JoinColumn({name: "id_user"})
    user!: User;

    @ManyToOne(
        () => User,
        user => user.appointmentsAsBarber,
        {nullable: false} 
    )
    @JoinColumn({name: "id_barber"})
    barber!: User;

    @ManyToOne(
        () => Service,
        service => service.appointments,
        { nullable: false }
    )
    @JoinColumn({name: "id_service"})
    service!: Service;


    constructor(appointment_date?: string, appointment_hour?: string){
        if (appointment_date) this.appointment_date = appointment_date;
        if (appointment_hour) this.appointment_hour = appointment_hour;
    }

}
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {Appointment} from "./Appointments.entity"
@Entity("users")
export class User {

    @PrimaryGeneratedColumn()
    id_user!: number;

    @Column({nullable: false})
    name!: string;

    @Column({nullable: false, unique: true})
    email!: string;

    @Column({nullable: false })
    password!: string;

    @Column({nullable: true})
    number!: string;

    @Column({type: "enum", enum: ["CLIENT","BARBER", "ADMIN"], default: "CLIENT"})
    role!: string;

    @OneToMany(()=> Appointment, appointment => appointment.user)
    appointmentsAsClient!:Appointment[]

    @OneToMany(() => Appointment, appointment => appointment.barber)
    appointmentsAsBarber!: Appointment[]


    constructor(name?: string, email?: string, password?: string, number?: string){
        if(name) this.name = name;
        if(email) this.email = email;
        if(password) this.password = password;
        if(number !== undefined) this.number = number;
    }
}
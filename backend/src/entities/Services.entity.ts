import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./Users.entity";
import {Appointment} from "./Appointments.entity"

@Entity("services")
export class Service{
    @PrimaryGeneratedColumn()
    id_service!: number;

    @Column({nullable: false })
    name!: string;

    @Column({nullable: false, type: "decimal", precision: 10, scale: 2})
    price!: number;

    @Column()
    description!: string;

    @OneToMany(
        () => Appointment,
        appointment => appointment.service
    )
    appointments!: Appointment[];

    constructor(name?: string, price?: number, description?: string){
        if(name) this.name = name;
        if(price) this.price = price;
        if(description) this.description = description;
    }

}
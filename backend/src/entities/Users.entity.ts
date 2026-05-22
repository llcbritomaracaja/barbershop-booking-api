import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
    phone!: string;

    @Column({type: "enum", enum: ["CLIENT","BARBER", "ADMIN"], default: "CLIENT"})
    role!: string;


    constructor(name?: string, email?: string, password?: string, phone?: string){
        if(name) this.name = name;
        if(email) this.email = email;
        if(password) this.password = password;
        if(phone !== undefined) this.phone = phone;
    }

}
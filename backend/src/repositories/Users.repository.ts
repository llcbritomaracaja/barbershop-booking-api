import {User} from '../entities/Users.entity'
import {Repository} from 'typeorm';
import {AppDataSource} from '../app-data-source'

export class UserRepository{
    private manager:Repository<User>

    constructor(){
        this.manager = AppDataSource.getRepository(User)
    }

    getUser = async(id_user:number): Promise<User | null> => {
        return await this.manager.findOne({where: {id_user:id_user}})
    }

    getAllUser = async(): Promise<User[] | null> => {
        return await this.manager.find();
    }

    createUser = async(user:User): Promise<User | null> =>{
        return await this.manager.save(user);
    }

    updateUser = async(id_user: number, name:string, email: string, phone:string, password?: string): Promise<User | null> => {
        await this.manager.update({id_user}, {name, email, password, phone})
        return this.manager.findOneBy({id_user})
    }

    deleteUser = async(id_user: number): Promise<boolean> => {
        const result = await this.manager.delete({id_user})
        return result.affected !== 0;
    }

    getAutenticationByEmailPassword = async(email:string):Promise<User | null>=>{
        return await this.manager.findOne({
            where:{email}}
        )
    }

    findByEmail = async(email:string): Promise<User | null>  => {
        return this.manager.findOne({where: {email}})
    }
}
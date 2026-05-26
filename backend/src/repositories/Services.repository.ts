import {Service} from "../entities/Services.entity";
import {Repository} from "typeorm";
import {AppDataSource} from "../app-data-source"

export class ServicesRepository {
    private manager: Repository<Service>

    constructor(){
        this.manager = AppDataSource.getRepository(Service);
    }

    getService = async(id_service: number): Promise<Service | null> => {
        return await this.manager.findOne({where: {id_service:id_service}})
    }

    getAllServices = async(): Promise<Service [] | null> => {
        return await this.manager.find();
    }

    createService = async(service:Service): Promise<Service | null> => {
        return await this.manager.save(service);
    }

    updateService = async(id_service:number, name:string, price:number, description:string): Promise <Service | null> => {
        await this.manager.update({id_service}, {name, price, description})
        return await this.manager.findOne({where: {id_service:id_service}})
    }

    deleteService = async(id_service:number):Promise<boolean> => {
        const result = await this.manager.delete({id_service});
        return result.affected !== 0;
    }
}
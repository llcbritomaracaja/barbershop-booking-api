import {ServicesRepository} from "../repositories/Services.repository";
import {Service} from "../entities/Services.entity";

export class ServiceServices {
    serviceRepository: ServicesRepository

    constructor(serviceRepository = new ServicesRepository()) {
        this.serviceRepository = serviceRepository
    }

    getService = async(id_service:number):Promise <Service | null> => {
        return await this.serviceRepository.getService(id_service);
    }

    getAllServices = async(): Promise<Service[] | null> => {
        return await this.serviceRepository.getAllServices();
    }

    createService = async(name: string, price:number, description: string): Promise<Service | null> => {
        const service = new Service(name, price, description);

        return await this.serviceRepository.createService(service);
    }

    updateService = async(id_service:number, name:string, price:number, description:string): Promise<Service | null> => {
        return await this.serviceRepository.updateService(id_service, name, price, description);
    }

    deleteService = async(id_service:number): Promise<boolean> => {
        return await this.serviceRepository.deleteService(id_service);
    }
}
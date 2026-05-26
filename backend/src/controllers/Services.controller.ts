import { ServiceServices } from "../services/Services.service";
import {Response, Request} from "express";

export class ServiceController {
    servicesService: ServiceServices;

    constructor(serviceServices = new ServiceServices()){
        this.servicesService = serviceServices
    }

    getService = async(request: Request, response: Response) => {
        try {
            const {id_service} = request.params;
            const id = Number(id_service);

            if(!id) return response.status(400).json({message: "ID de serviço não informado."})

            const service = await this.servicesService.getService(id)

            if (!service) return response.status(404).json({message: "Nenhum serviço encontrado. "})

            return response.status(200).json({
                id_service: service.id_service,
                name: service.name,
                price: service.price,
                description: service.description
            })

        } catch {
            return response.status(500).json({message: "Erro ao buscar serviço."})
        }
    }

    getAllServices = async(request: Request, response: Response) => {
        try {
            const services = await this.servicesService.getAllServices();
            if (!services || services.length === 0 ) return response.status(404).json({message: "Nenhum serviço encontrado."})

            const servicesMap = services.map(service => ({
                id_service: service.id_service,
                name: service.name,
                price: service.price,
                description: service.description
            }))

            return response.status(200).json({services: servicesMap})
        } catch {
            return response.status(500).json({message: "Erro ao listas serviços."})
        }
    }

    createService = async(request:Request, response:Response) => {
        try {
            const service = request.body;

            if (!service.name || !service.price || !service.description) return response.status(400).json({message: "Preencha todos os parâmetros necessários."})

            await this.servicesService.createService(service.name, service.price, service.description);
            return response.status(201).json({message: "Serviço criado com sucesso"})
        } catch {
            return response.status(500).json({message:"Erro ao tentar criar novo serviço."})
        }
    }

    updateService = async(request:Request, response:Response) => {
        try {
            const {id_service} = request.params;
            const id = Number(id_service);

            if(!id) return response.status(400).json({message: "ID de serviço para ser atualizado não foi informado."})
            
            const service = request.body;

            if(!service || Object.keys(service).length === 0) return response.status(400).json({message: "Nenhuma alteração foi feita."})

            const updatedService = await this.servicesService.updateService(id, service.name, service.price, service.description)

            return response.status(200).json({message: "Serviço atualizado com sucesso!",
                name: updatedService?.name,
                price: updatedService?.price,
                description: updatedService?.description
            })
        } catch {
            return response.status(500).json({message: "Erro ao atualizar serviço."})
        }
    }

    deleteService = async(request:Request, response:Response) => {
        try {
            const {id_service} = request.params;
            const id = Number(id_service);

            if(!id) return response.status(400).json({message:"ID de serviço para ser deletado não foi informado."})

            const deleted = await this.servicesService.deleteService(id);
            if(!deleted) return response.status(404).json({message: "Nenhum serviço foi encontrado para ser deletado."})

            return response.status(204).send();

        } catch {

            return response.status(500).json({message: "Erro ao tentar deletar serviço."})
            
        }
    }
}
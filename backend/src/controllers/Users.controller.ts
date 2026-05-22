import {UserService} from '../services/Users.service'
import {Response, Request} from 'express'
import {EmailAlreadyExistsError} from '../errors/EmailAlreadyExistsError'

export class UserController{
    userService: UserService

    constructor (userService = new UserService()){
        this.userService = userService
    }

    getUser = async(request: Request, response: Response) => {
        try{
            const {id_user} = request.params
            if (!id_user) {
                return response.status(401).json({message: "Usuário não autenticado."})
            }

            const user = await this.userService.getUser(parseInt(id_user))

            if (!user){
                return response.status(404).json({message: "Usuário não encontrado."})
            }

            return responde.status(200).json({
                user :user?.id_user,
                name: user?.name,
                email: user?.email,
                phone: user?.phone
            })
        } catch {
            return response.status(500).json({message: "Erro ao procurar usuário."})
        }
    }

    getAllUser = async(request: Request, response: Response) => {
        try{
            const users = await this.userService.getAllUser()

            if (!users || users.length === 0) {
                return response.status(404).json({message: "Nenhum usuário encontrado."})
            }

            const usersMap = users.map(user => ({
                id_user: user.id_user,
                name: user.name,
                email: user.email,
                phone: user.phone
            }))

            return response.status(200).json({users: usersMap})
        } catch {
            return response.status(500).json({message: "Erro ao listas usuários."})
        }
    }

    createUser = async(request:Request, response: Response) => { 
        try{
            const user = request.body

            if(!user.name || !user.email || !user.password ){
                return response.status(400).json({message: "Preencha todos os parâmetros necessários."})
            }

            await this.userService.createUser(user.name, user.email, user.password, user.phone)
            return response.status(200).json({message: "Usuário criado com sucesso!"})

        } catch (error) {
            if (error instanceof EmailAlreadyExistsError){
                return response.status(409).json({message: "Este email já foi cadastrado."})
            }

            return response.status(500).json({message: "Não foi possível criar um novo usuário."})
        }
    }

    updateUser = async(request: Request, response: Response) => {
        try {
            const id = Number(request.params.id_user)
            const user = request.body

            if (!user || Object.keys(user).length === 0){
                return response.status(400).json({message: "Nenhuma alteração feita."})
            }

            const updateUser = await this.userService.updateUser(id, user.name, user.email, user.phone, user.password)

            if (!updateUser) {
                return response.status(404).json({message: "Usuário inexistente."})
            }

            return response.status(200).json({message: "Usuário atualizado com sucesso!", 
                name:updateUser?.name,
                email:updateUser?.email,
                phone:updateUser?.phone
            })
        } catch () {
            return response.status(500).json({message: "Não foi possível atualizar o usuário"})
        }
    }

    deleteUser = async(request: Request, response: Response) => {
        try{
            const {id_user} = request.params 

            if (!id_user) return response.status(400).json({message: "ID do usuário não informado."})

            const deleted = await this.userService.deleteUser(id_user)

            if(!deleted) return response.status(404).json({message: "Nenhum usuário foi encontrado para ser deletado."})

            return response.status(200).json({message: "Usuário deletado com sucesso!"})
        } catch{
            return response.status(500).json({message: "Erro ao deletar usuário"})
        }
    }

    getToken = async(request:Request, response:Response)=>{
        try{
            const {email,password} = request.body
            if(!email || !password){
                return response.status(400).json({message:"Os campos email e senha são obrigatorios"})
            }
           const token = await this.userService.getToken(email,password)
           
        return response.status(200).json({message:"Login efetuado com sucesso", token})
        }catch{
             return response.status(500).json({ message: "Erro ao logar" })
        }
    }   
}


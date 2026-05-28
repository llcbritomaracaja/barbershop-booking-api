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
            const id = Number(id_user)
            if (!id) {
                return response.status(401).json({message: "Usuário não autenticado."})
            }

            const id_authUser = Number(request.user?.id_user);
            const role_authUser = request.user?.role

            // if (id !== id_authUser || role_authUser !== "ADMIN") return response.status(403).json({message: "Acesso negado."})

            
            const user = await this.userService.getUser(id)

            if (!user){
                return response.status(404).json({message: "Usuário não encontrado."})
            }

            if (id === id_authUser || role_authUser === "ADMIN") {
                return response.status(200).json({
                    user :user?.id_user,
                    name: user?.name,
                    email: user?.email,
                    number: user?.number
                })
            } else return response.status(403).json({message: "Acesso negado."})

        } catch {
            return response.status(500).json({message: "Erro ao procurar usuário."})
        }
    }
    
    getAllUser = async(request: Request, response: Response) => {
        try{

            const role = request.user?.role;

            if (role !== "ADMIN") return response.status(403).json({message: "Acesso negado."})

            const users = await this.userService.getAllUser()

            if (!users || users.length === 0) {
                return response.status(404).json({message: "Nenhum usuário encontrado."})
            }

            const usersMap = users.map(user => ({
                id_user: user.id_user,
                name: user.name,
                email: user.email,
                number: user.number,
                role: user.role
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

            await this.userService.createUser(user.name, user.email, user.password, user.number)
            return response.status(201).json({message: "Usuário criado com sucesso!"})

        } catch (error:any) {
            if (error instanceof EmailAlreadyExistsError){
                return response.status(409).json({message: "Este email já foi cadastrado."})
            }

            console.log(error);

            return response.status(500).json({message: "Não foi possível criar um novo usuário." })
        }
    }

    updateUser = async(request: Request, response: Response) => {
        try {
            const id = Number(request.params.id_user)
            const user = request.body

            const id_authUser = request.user?.id_user;
            const role = request.user?.role;

            if (id_authUser === id || role === "ADMIN"){
                if (!user || Object.keys(user).length === 0){
                    return response.status(400).json({message: "Nenhuma alteração feita."})
                }

                const updateUser = await this.userService.updateUser(id, user.name, user.email, user.number, user.password)

                if (!updateUser) {
                    return response.status(404).json({message: "Usuário inexistente."})
                }

                return response.status(200).json({message: "Usuário atualizado com sucesso!", 
                    name:updateUser?.name,
                    email:updateUser?.email,
                    number:updateUser?.number
                })                

            } else return response.status(403).json({message: "Acesso negado."})

        } catch {
            return response.status(500).json({message: "Não foi possível atualizar o usuário"})
        }
    }

    updateUserRole = async(request: Request, response: Response) => {
        try {
            const {id_user} = request.params;
            const {role} = request.body

            const id_toUpdate = Number(id_user);

            const id_authUser = Number(request.user?.id_user);
            const role_authUser = request.user?.role;

            if(role_authUser !== "ADMIN") return response.status(403).json({message: "Não autorizado."})

            if (!id_toUpdate || !id_authUser) return response.status(400).json({ message: "ID de usuários não informados."})

            const result = await this.userService.updateUserRole(id_toUpdate, role)

            return response.status(200).json({ message: "Cargo de usuário atualizado com sucesso!"})

        } catch {
            return response.status(500).json({message:"Erro ao atualizar cargo de usuário."})
        }
    }

    deleteUser = async(request: Request, response: Response) => {
        try{
            const {id_user} = request.params 

            const id = Number(id_user)

            if (!id) return response.status(400).json({message: "ID do usuário não informado."})

            const deleted = await this.userService.deleteUser(id)

            if(!deleted) return response.status(404).json({message: "Nenhum usuário foi encontrado para ser deletado."})

            return response.status(204).send();
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


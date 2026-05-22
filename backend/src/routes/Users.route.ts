import {Router} from 'express'
import {UserController} from '../controllers/Users.controller'
import {AuthenticationVerify} from '../middlewares/Auth.middleware'

export const userRouter = Router()

const userController = new UserController()

userRouter.get("/user/:id_user", AuthenticationVerify, userController.getUser)
userRouter.get("/user", userController.getAllUser)
userRouter.post("/user", userController.createUser)
userRouter.patch("/user/:id_user", userController.updateUser)
userRouter.delete("/user/:id_user", userController.deleteUser)
userRouter.post("/user/login", userController.getToken)
import { Response, Request, NextFunction } from "express";
import { verify } from "jsonwebtoken";



export function AuthenticationVerify(request: Request, response: Response, next: NextFunction){
        const authToken = request.headers.authorization

        if(authToken){
        const [, token] = authToken.split(" ")

                try{
                        const payload = verify(token, process.env.JWT_SECRET as string) as {id_user:number, role:"string"}
                        
                        return next()

                }catch(error){
                        response.status(401).json({ message: "Token inválido ou expirado" })
                }

        
        }

        response.status(401).json({message: "Token inválido"})
}



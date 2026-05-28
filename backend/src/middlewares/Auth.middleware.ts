import { Response, Request, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
    id_user: number;
    role: string;
}

export function AuthenticationVerify(
    request: Request,
    response: Response,
    next: NextFunction
) {

    const authToken = request.headers.authorization;

    if (!authToken) {
        return response.status(401).json({
            message: "Token inválido"
        });
    }

    const [, token] = authToken.split(" ");

    if (!token) return response.status(401).json({message: "Token não informado."})

    try {

        const payload = verify(
            token,
            process.env.JWT_SECRET as string
        ) as unknown as TokenPayload;

        request.user = {
            id_user: payload.id_user,
            role: payload.role
        };

        return next();

    } catch {

        return response.status(401).json({
            message: "Token inválido ou expirado"
        });

    }

}
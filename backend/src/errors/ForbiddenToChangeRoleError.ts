export class ForbiddenToChangeRoleError extends Error{
    constructor(message: string = "Não autorizado." ){
        super(message);
        this.name = "ForbiddenToChangeRoleError"
    }
}
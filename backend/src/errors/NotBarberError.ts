export class NotBarberError extends Error{
    constructor(message: string = "Não foi possível marcar um agendamento com o ID fornecido por não se tratar de um barbeiro." ){
        super(message);
        this.name = "NotBarberError"
    }
}
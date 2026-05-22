export class EmailAlreadyExistsError extends Error {
    constructor(message: string = "Email já cadastrado em outra conta.") {
        super(message);
        this.name = "EmailAlreadyExistsError";
    }
}
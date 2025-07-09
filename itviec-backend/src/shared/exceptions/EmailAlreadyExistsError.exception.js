
class EmailAlreadyExistsError extends Error {
    constructor(message = 'Email đã tồn tại') {
        super(message);
        this.name = 'EmailAlreadyExistsError';
        this.statusCode = 409;
    }
}

export default EmailAlreadyExistsError;
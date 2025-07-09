
class InvalidCredentialsError extends Error {
    constructor(message = 'Email hoặc password không chính xác') {
        super(message);
        this.name = 'InvalidCredentialsError';
        this.statusCode = 401;
    }
}

export default InvalidCredentialsError;
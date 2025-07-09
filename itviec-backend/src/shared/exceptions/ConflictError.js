
class ConflictError extends Error {
    constructor(message = 'ConflictError') {
        super(message);
        this.name = 'ConflictError';
        this.statusCode = 409;
    }
}

export default ConflictError;

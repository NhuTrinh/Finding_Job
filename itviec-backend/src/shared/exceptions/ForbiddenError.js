
class ForbiddenError extends Error {
    constructor(message = 'ForbiddenError') {
        super(message);
        this.name = 'ForbiddenError';
        this.statusCode = 403;
    }
}

export default ForbiddenError;

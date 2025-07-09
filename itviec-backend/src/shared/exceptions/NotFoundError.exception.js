
class NotFoundError extends Error {
    constructor(message = 'NotFoundError') {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

export default NotFoundError;

class BadResquestError extends Error {
    constructor(message = 'BadResquestError') {
        super(message);
        this.name = 'BadResquestError';
        this.statusCode = 400;
    }
}

export default BadResquestError;

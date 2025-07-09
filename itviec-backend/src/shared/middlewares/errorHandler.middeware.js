
import { apiError } from "../helpers/apiResponse.helper.js";

function errorHandler(err, req, res, next) {
    const status = err.statusCode || 500;
    
    return apiError(res, err.message, status);
}

export default errorHandler;
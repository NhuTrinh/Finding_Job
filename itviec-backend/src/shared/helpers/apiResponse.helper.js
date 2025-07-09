
export const apiSuccess = (res, payload, statusCode = 200) => {
    const response =
        typeof payload === 'object' && payload !== null && !Array.isArray(payload)
            ? { status: 'success', ...payload }
            : { status: 'success', data: payload };

    return res.status(statusCode).json(response);
};

export const apiError = (res, message = 'Error', statusCode = 500) => {
    return res.status(statusCode).json({
        status: 'error',
        message,
    });
}
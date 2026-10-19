// Lỗi có kèm HTTP status code, service throw ra để controller biết trả về code nào
export class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Dùng chung trong các controller để trả lỗi theo một format
export const handleError = (res, error) => {
    let statusCode = error.statusCode || 500;

    // Lỗi validate của mongoose (thiếu field required, sai enum...) hoặc sai định dạng ObjectId
    if (error.name === "ValidationError" || error.name === "CastError") {
        statusCode = 400;
    }

    return res.status(statusCode).json({
        success: false,
        message: error.message
    });
};

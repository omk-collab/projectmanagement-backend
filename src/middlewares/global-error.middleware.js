import { ApiError } from "../utils/api-error.js";

const globalErrorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    // MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      error = new ApiError(
        409,
        `This ${field} is already taken. Please choose another.`,
      );
    } else {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Something went wrong";
      error = new ApiError(statusCode, message);
    }
  }

  return res.status(error.statusCode).json({
    statusCode: error.statusCode,
    message: error.message,
    success: false,
    errors: error.errors || [],
  });
};

export { globalErrorHandler };

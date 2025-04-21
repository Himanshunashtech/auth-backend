class AppError extends Error {
    statusCode;
    isOperational;
    details;
  
    constructor(message, statusCode = 500, isOperational = true, details = {}) {
      super(message);
  
      this.statusCode = statusCode;
      this.isOperational = isOperational;
      this.details = details;
  
      Error.captureStackTrace(this, this.constructor);
    }
  
    static badRequest(message = "Bad Request", details = {}) {
      return new AppError(message, 400, true, details);
    }
  
    static unauthorized(message = "Unauthorized", details = {}) {
      return new AppError(message, 401, true, details);
    }
  
    static forbidden(message = "Forbidden", details = {}) {
      return new AppError(message, 403, true, details);
    }
  
    static notFound(message = "Not Found", details = {}) {
      return new AppError(message, 404, true, details);
    }
  
    static conflict(message = "Conflict", details = {}) {
      return new AppError(message, 409, true, details);
    }
  
    static unprocessable(message = "Unprocessable Entity", details = {}) {
      return new AppError(message, 422, true, details);
    }
  
    static internal(message = "Internal Server Error", details = {}) {
      return new AppError(message, 500, true, details);
    }
  
    static serviceUnavailable(message = "Service Unavailable", details = {}) {
      return new AppError(message, 503, true, details);
    }
  }
  
  module.exports = AppError;
  
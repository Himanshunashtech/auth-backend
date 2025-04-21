const AppError = require("../utils/apierror")

const errorHandler = (err, req, res, next) => {
 
  if (err instanceof AppError) {
    return res.status(err.statuscode || 500).json({
      success: false,
      message: err.message || 'Something went wrong',
      details: err.details || null,
      isOperational: err.isoperational || false,
    });
  }


  console.error('Unexpected Error:', err);

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    details: err.message || null,
    isOperational: false,
  });
};

module.exports = errorHandler;

const jwt = require('jsonwebtoken');
const AppError = require('../utils/apierror');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1]

    if (!token) {
      throw AppError.unauthorized('Authentication token is missing');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; 
    next();
  } catch (err) {
    next(AppError.unauthorized('Invalid or expired token'));
  }
};

module.exports = authMiddleware;

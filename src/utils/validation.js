const Joi = require('joi');

const registerUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),

  email: Joi.string()
    .pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .message('Please enter a valid email address')
    .required(),

  avatar: Joi.string().uri().optional().allow(''),

  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/)
    .message(
      'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
    )
    .required(),
});

const loginUserSchema = Joi.object({
  email: Joi.string()
    .pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .message('Please enter a valid email address')
    .required(),

  password: Joi.string().required(),
});

module.exports = {
    registerUserSchema,
    loginUserSchema
}
 

import jwt from "jsonwebtoken";
import Joi from 'joi';
export const authenticate = ( req, res, next) => {
  try {
    const token = req.headers.accesstoken;

    if (!token) {
      return res.status(401).json({ message: "Access token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};




export const validateSignUp = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required()
      .messages({
        'string.empty': 'Name is required',
        'string.min': 'Name should have at least 2 characters',
        'string.max': 'Name should not exceed 50 characters'
      }),
    
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required'
      }),
    
    job_title: Joi.string().max(100).optional()
      .messages({
        'string.max': 'Job title should not exceed 100 characters'
      }),
    
    typeOfUser: Joi.string().valid('person', 'business')
      // .required()
      .messages({
        'any.only': 'Type of user must be either person or business',
        // 'any.required': 'Type of user is required'
      }),
    
    business_name: Joi.when('typeOfUser', {
      is: 'business',
      then: Joi.string().min(2).max(100).required()
        .messages({
          'string.empty': 'Business name is required for business accounts',
          'string.min': 'Business name should have at least 2 characters',
          'string.max': 'Business name should not exceed 100 characters'
        }),
      otherwise: Joi.string().optional().allow('', null)
    }),
    
    business_sector: Joi.when('typeOfUser', {
      is: 'business',
      then: Joi.string().max(100).optional()
        .messages({
          'string.max': 'Business sector should not exceed 100 characters'
        }),
      otherwise: Joi.string().optional().allow('', null)
    }),
    
    password: Joi.string().min(6).required()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password should have at least 6 characters',
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      }),
    
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({
        'any.only': 'Password and Confirm Password must match',
        'any.required': 'Confirm Password is required'
      }),
    
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/)
      .messages({
        'string.pattern.base': 'Please provide a valid phone number',
        // 'string.empty': 'Phone number is required'
      })
  }).options({ abortEarly: false });

  const { error, value } = schema.validate(req.body);

  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      message: 'Validation failed',
      errors: errorMessages
    });
  }

  req.validatedData = value;
  next();
};
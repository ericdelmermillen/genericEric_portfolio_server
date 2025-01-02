import { body, param } from'express-validator';

const paramsIsNumber = [
  param('id')
    .isInt().
    withMessage('ID must be a number')
];

const emailAndPasswordAreValid = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 8, max: 32})
    .withMessage('Password must be at between 8-32 characters long')
    .isString()
    .withMessage('Password must be a string')
];

// no longer sending this in body
const tokenSchema = [
  body('token')
    .notEmpty()
    .withMessage('Token is required')
    .isString()
    .withMessage('Token must be a string')
];

// no longer sending this in body
const refreshTokenSchema = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
    .isString()
    .withMessage('Refresh token must be a string')
];

const validContactFormData = [
  body('name')
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2-50 characters long.'),
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Message must be between 10-500 characters long.'),
  body('email')
    .notEmpty()
    .withMessage("Contact email required")
    .isEmail()
    .withMessage('Invalid email format')
  ];


  // need to create validation to match project data
  const validProjectData = [
  body('name')
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2-50 characters long.'),
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Message must be between 10-500 characters long.'),
  body('email')
    .notEmpty()
    .withMessage("Contact email required")
    .isEmail()
    .withMessage('Invalid email format')
  ];
  

export {
  paramsIsNumber,
  emailAndPasswordAreValid, 
  tokenSchema,
  refreshTokenSchema,
  validContactFormData,
  validProjectData
};
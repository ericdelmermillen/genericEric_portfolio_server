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
    .withMessage('First Name is required.')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2-50 characters long.'),
  // body('lastName')
  //   .notEmpty().
  //   withMessage('Last Name is required.')
  //   .isLength({ min: 2, max: 50 })
  //   .withMessage('First Name must be between 2-25 characters long.'),
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Message must be between 10-500 characters long.'),
  body('email')
    .notEmpty()
    .withMessage("Contact email required")
    .isEmail()
    .withMessage('Invalid email format'),
  // body('subject')
  //   .notEmpty()
  //   .withMessage('Subject is required')
  //   .isLength({ min: 5, max: 100 })
  //   .withMessage('Subject must be between 5-100 characters long.'),
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Message must be between 10-500 characters long.')
  ];
  

export {
  paramsIsNumber,
  emailAndPasswordAreValid, 
  refreshTokenSchema,
  validContactFormData,
};
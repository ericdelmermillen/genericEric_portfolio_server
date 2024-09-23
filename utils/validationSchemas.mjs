// convert to module syntax and use .mjs ext
// const { body, param } = require('express-validator');
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

// const bioDataIsValid = [
//   body("bio_name")
//     .notEmpty()
//     .withMessage("Bio Name must not be empty")
//     .isString()
//     .withMessage("Bio Name must be a string")
//     .isLength({min: 2, max: 50})
//     .withMessage("Bio Name must be between 2-50 characters"),
//   body("bio_text")
//     .notEmpty()
//     .withMessage("Bio Text must not be empty")
//     .isString()
//     .withMessage("Bio Text must be a string")
//     .isLength({min: 25, max: 2000})
//     .withMessage("Bio Text must be between 25-2000 characters"),
//   body("bio_img_url")
//     .notEmpty()
//     .withMessage("Bio image url must not be empty")
//     .isString()
//     .withMessage("Bio Text must be a string")
//     .isLength({min: 10, max: 200})
//     .withMessage("Bio img url must be between 10-200 characters")
// ];

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
  
const photographerDataValid = [
  body('photographer_name')
    .isString()
    .notEmpty()
    .withMessage('Photographer name must be a non-empty string')
    .isLength({ min: 2, max: 50 })
    .withMessage('Photographer Name must be between 2-50 characters long.')
];

// const modelDataValid = [
//   body('model_name')
//     .isString()
//     .withMessage('Model Name must be a string')
//     .notEmpty()
//     .withMessage('Model Name must be a non-empty string')
//     .isLength({ min: 2, max: 50 })
//     .withMessage('Model Name must be between 2-50 characters long.')
// ];

// const tagDataValid = [
//   body('tag_name')
//     .isString()
//     .withMessage('Tag Name must be a string')
//     .notEmpty()
//     .withMessage('Tag Name must be a non-empty string')
//     .isLength({ min: 2, max: 50 })
//     .withMessage('Tag Name must be between 2-50 characters long.')
// ];

// const shootDataValid = [
//   body('shoot_date')
//     .isString()
//     .withMessage('Shoot date must be a string')
//     .matches(/^\d{4}-\d{2}-\d{2}$/)
//     .withMessage('Shoot date must be in YYYY-MM-DD format'),
//   body('tag_ids')
//     .isArray({ min: 1 })
//     .withMessage('At least one tag ID is required')
//     .custom(ids => ids.every(id => typeof id === 'number'))
//     .withMessage('Each tag ID must be a number'),
//   body('photographer_ids')
//     .isArray({ min: 1 })
//     .withMessage('At least one photographer ID is required')
//     .custom(ids => ids.every(id => typeof id === 'number'))
//     .withMessage('Each photographer ID must be a number'),
//   body('model_ids')
//     .isArray({ min: 1 })
//     .withMessage('At least one model ID is required')
//     .custom(ids => ids.every(id => typeof id === 'number'))
//     .withMessage('Each model ID must be a number'),
//   body('photo_urls')
//     .isArray({ min: 1 })
//     .withMessage('At least one photo URL is required')
// ];

// const shootsOrderDataValid = [
//   body('new_shoot_order')
//     .isArray({ min: 1 })
//     .withMessage('At least one shoot order update is required')
//     .custom(updates => updates.every(update => 
//       'shoot_id' in update && typeof update.shoot_id === 'number' && 
//       'display_order' in update && typeof update.display_order === 'number'))
//     .withMessage('Each update must have shoot_id and display_order as numbers')
// ];


export {
  paramsIsNumber,
  emailAndPasswordAreValid, 
  // bioDataIsValid,
  validContactFormData,
  // photographerDataValid,
  // modelDataValid,
  // tagDataValid,
  // shootDataValid,
  // shootsOrderDataValid
};
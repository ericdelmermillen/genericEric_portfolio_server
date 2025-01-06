import { body, param, header } from'express-validator';
import { verifyToken } from './utils.mjs';

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
    .withMessage('Password must be between 8-32 characters long')
    .isString()
    .withMessage('Password must be a string')
];


const tokenSchema = [
  header('Authorization')
    .notEmpty()
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .custom((value) => {
      if(!value.startsWith('Bearer ')) {
        return Promise.reject('Authorization header must start with "Bearer "');
      };

      const token = value.split(' ')[1];

      if(!token) {
        return Promise.reject('Token is missing in the Authorization header');
      };

      // Validate token format as JWT format
      if(!/^[A-Za-z0-9-._~+\/]+=*$/.test(token)) {
        return Promise.reject('Invalid token format');
      };

      if(!verifyToken(token, "token")) {
        return Promise.reject('Invalid token');
      };

      return true; // Proceed if all checks pass
    })
];


const refreshTokenSchema = [
  header('x-refresh-token')
    .notEmpty()
    .withMessage('Refresh token is required')
    .isString()
    .withMessage('Refresh token must be a string')
    .custom((refreshToken) => {

      // Validate the refresh token format as JWT format
      if(!/^[A-Za-z0-9-._~+\/]+=*$/.test(refreshToken)) {
        return Promise.reject('Invalid token format'); // Reject with a custom error message
      };

      if(!verifyToken(refreshToken, "refreshToken")) {
        return Promise.reject('Invalid refresh token');
      };

      return true;
    })
];


// const validContactFormData = [
const validContactFormData = [
  body('project_date')
  .notEmpty()
  .withMessage('Project date is required.')
  .matches(/^\d{2}-\d{2}-\d{4}$/)
  .withMessage('Project date must be in the format DD-MM-YYYY.')
  .custom((value) => {
    const [day, month, year] = value.split('-').map(Number);

    // Validate month
    if(month < 1 || month > 12) {
      return Promise.reject('Invalid month in project date.');
    };

    // Validate day for the given month
    const daysInMonth = new Date(year, month, 0).getDate(); // Get the last day of the month
    if(day < 1 || day > daysInMonth) {
      return Promise.reject('Invalid day in project date.');
    };

    return true;
  }),


  // Validate project_title
  body('project_title')
    .notEmpty()
    .withMessage('Project title is required.')
    .isLength({ min: 5, max: 100 })
    .withMessage('Project title must be between 5-100 characters long.'),

  // Validate project_description
  body('project_description')
    .notEmpty()
    .withMessage('Project description is required.')
    .isLength({ min: 5, max: 2000 })
    .withMessage('Project description must be between 50-2000 characters long.'),

  // Validate project_urls
  body('project_urls')
  .isArray({ min: 1 })
  .withMessage('Project URLs must be an array with at least one URL.')
  .custom((urls) => {
    const requiredKey = "Deployed Url";
    const optionalKeys = [
      "Youtube Video",
      "Github (Client)",
      "Github (Server)"
    ];

    const validationErrors = [];

    // Ensure the array contains at least one object with the required key
    if(!urls.some((urlObj) => urlObj.hasOwnProperty(requiredKey))) {
      validationErrors.push(`At least one project URL must have the key "${requiredKey}".`);
    };

    // Validate each URL object
    urls.forEach((urlObj, index) => {
      const keys = Object.keys(urlObj);

      // Ensure the object contains exactly one key
      if(keys.length !== 1) {
        validationErrors.push(`Object at index ${index} must contain exactly one key-value pair.`);
        return;
      };

      const key = keys[0];
      const value = urlObj[key];

      // Validate key and value
      if(key !== requiredKey && !optionalKeys.includes(key)) {
        validationErrors.push(`Invalid key "${key}" in object at index ${index}. Allowed keys are "${requiredKey}" or one of ${JSON.stringify(optionalKeys)}.`);
      };

      if(!/^https?:\/\/.+\..+$/.test(value)) {
        validationErrors.push(`Invalid URL format for "${key}" in object at index ${index}: "${value}".`);
      };
    });

    // If there are validation errors, reject with a custom message
    if(validationErrors.length > 0) {
      return Promise.reject(validationErrors);
    };

    return true;
  }),


// Validate project_photos
body('project_photos')
  .isArray({ min: 1, max: 4 })
  .withMessage('Project photos must be an array with at least one and at most four photo objects.')
  .custom((photos) => {
    const validationErrors = [];

    // Ensure the number of photos does not exceed the max allowed (already checked by isArray)
    if(photos.length > 4) {
      validationErrors.push(`Project photos can contain a maximum of 4 objects, but received ${photos.length}.`);
    };

    photos.forEach((photo, index) => {
      // Validate display_order
      if(typeof parseInt(photo.display_order) !== 'number' || photo.display_order < 1) {
        validationErrors.push(`Invalid display_order for photo at index ${index}: ${JSON.stringify(photo)}. Must be a positive number.`);
      };

      // Validate photo_url
      if(!/^[a-f0-9\-]{36}\.jpeg$/.test(photo.photo_url)) {
        validationErrors.push(`Invalid photo_url format for photo at index ${index}: ${JSON.stringify(photo)}. Must be a UUID ending in ".jpeg".`);
      };
    });

    // If validation errors exist, reject with a custom message
    if(validationErrors.length > 0) {
      return Promise.reject(validationErrors);
    };

    return true;
  })
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
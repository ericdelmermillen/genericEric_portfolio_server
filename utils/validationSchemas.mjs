import { body, param, header } from'express-validator';
import { isValidAWSObj, isValidURL, verifyToken } from './utils.mjs';

const paramsIsNumber = [
  param('id')
    .isInt()
    .withMessage('ID must be a number')
];


const emailAndPasswordAreValid = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format'),

  body('password')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 8, max: 32})
    .withMessage('Password must be between 8-32 characters long')
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
        return Promise.reject('Invalid token format'); 
      };

      if(!verifyToken(refreshToken, "refreshToken")) {
        return Promise.reject('Invalid refresh token');
      };

      return true;
    })
];


const validateAuth = [
  body()
    .custom(async (_, { req }) => {
      const token = req.headers['authorization']?.split(" ")[1];
      const refreshToken = req.headers['x-refresh-token'];

      if(!token && !refreshToken) {
        return Promise.reject('Both token and refreshToken are missing');
      };

      if(!token) {
        return Promise.reject('Authorization token is missing');
      };

      if(!refreshToken) {
        return Promise.reject('Refresh token is missing');
      };

      try {
        const isValidToken = await verifyToken(token, "token");
        const isValidRefreshToken = await verifyToken(refreshToken, "refreshToken");

        if(!isValidToken && !isValidRefreshToken) {
          return Promise.reject('Both token and refreshToken are invalid');
        };

        return true; 

      } catch(error) {
        return Promise.reject('Error occurred while verifying tokens');
      };
    }),
];


const validContactFormData = [
  body('name')
    .notEmpty()
    .withMessage('Name is required.')
    .isString()
    .withMessage('Name must be a string.')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2-50 characters long.'),

  body('message')
    .notEmpty()
    .withMessage('Message is required.')
    .isString()
    .withMessage('Message must be a string.')
    .isLength({ min: 10, max: 500 })
    .withMessage('Message must be between 10-500 characters long.'),

  body('email')
    .notEmpty()
    .withMessage('Contact email required.')
    .isEmail()
    .withMessage('Invalid email format.'),
];


const validProjectData = [
  body('project_date')
    .notEmpty()
    .withMessage('Project date is required.')
    .matches(/^\d{2}-\d{2}-\d{4}$/)
    .withMessage('Project date must be in the format DD-MM-YYYY.')
    .custom((value) => {

      const [ day, month, year ] = value.split('-').map(Number);

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

  body('project_title')
    .notEmpty()
    .withMessage('Title is required.')
    .isString()
    .withMessage('Title must be a string.')
    .isLength({ min: 5, max: 50 })
    .withMessage('Title must be between 5-50 characters long.'),
  
  body('project_description')
    .notEmpty()
    .withMessage('Description is required.')
    .isString()
    .withMessage('Description must be a string.')
    .isLength({ min: 25, max: 2000 })
    .withMessage('Description must be between 25-2000 characters long.'),
    
  body('project_urls')
    .isArray({ min: 1, max: 4 })
    .withMessage('Project URLs must be an array with at least one and at most four URLs.')
    .custom(async (urls) => {

      // if(!Array.isArray(urls)) {
      //   return Promise.reject('Project URLs must be an array.');
      // };
      
      // if(urls.length < 1) {
      //   return Promise.reject('At least one project Url required.');
      // };
      
      // if(urls.length > 4) {
      //   return Promise.reject('Maximum 4 project Urls per project.');
      // };

      const objKeys = [];
      const objValues = [];

      // Check that all items in the array are objects
      for(const urlObj of urls) {
        
        if(typeof urlObj !== 'object') {
          return Promise.reject('Each item in the Url array must be an object.');
        };

        if(typeof urlObj === "object") {
          objKeys.push(Object.entries(urlObj)[0][0])
          objValues.push(Object.entries(urlObj)[0][1])
        };
      };

      // must have a Deployed Url key
      if(objKeys.length === 1 && !objKeys.includes("Deployed Url")) {
        return Promise.reject('Project must include a Deployed URL.');
      };

      const keyCountMap = objKeys.reduce((acc, key) => {
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});
      

      const validKeys = [
        "Deployed Url",
        "Youtube Video",
        "Github (Client)",
        "Github (Server)"
      ];

      // Check if all keys in the keyCountMap are valid
      const allKeysValid = Object.keys(keyCountMap).every(key => validKeys.includes(key));

      
      if(!allKeysValid) {
        return Promise.reject('Invalid keys in project URLs.');
      };

      const duplicateKeyCount = Object.values(keyCountMap).some(count => count > 1);

      if(duplicateKeyCount) {
        return Promise.reject('Some keys in the project URLs are duplicates.');
      };

      const allURLsValid = objValues.reduce((acc, url) => {
        return acc && isValidURL(url);
      }, true);


      if(!allURLsValid) {
        return Promise.reject('One or more project urls are invalid');
      };
      
      return true;
    }),
  
      
    // tests for project_photos
  body('project_photos')
    .custom(async (photos) => {

      if(!Array.isArray(photos)) {
        return Promise.reject('Project photos must be an array.');
      };

      if(photos.length < 1) {
        return Promise.reject('Minimum 1 photo per project.');
      };

      if(photos.length > 4) {
        return Promise.reject('Maximum 4 photos per project.');
      };

      // Check that all items in the array are objects with display_order key and aws obj value
      for(const photo of photos) {
        
        if(typeof photo !== 'object') {
          return Promise.reject('Each item in the photo array must be an object.');
        };

        // Validate display_order key exists and is a positive number
        if(!('display_order' in photo) || typeof photo.display_order !== 'number' || photo.display_order <= 0) {
          return Promise.reject('Each photo must have a display_order with a positive number.');
        };

        if(!('photo_url' in photo) || !isValidAWSObj(photo.photo_url)) {
          return Promise.reject('Each photo must have a photo_url that is a valid AWS object name ending in .jpeg.');
        };

      };
      
    })
];


const validProjectOrderData = [
  body('new_project_order')
    .custom((projects) => {
      
      if(!Array.isArray(projects)) {
        return Promise.reject('New Project Order must be an array');
      };
      
      if(!projects.length) {
        return Promise.reject('New Project Order array must not be empty');
      };

      for(const project of projects) {
        if(typeof project !== "object" || Object.keys(project).length === 0) {
          return Promise.reject('Each project order must be a non-empty object');
        };
      };

      const validKeys = ["project_id", "display_order"];
      for(const project of projects) {
        const keys = Object.keys(project);
        if(keys.length !== validKeys.length || keys.some(key => !validKeys.includes(key))) {
          return Promise.reject('Each object must only contain "project_id" and "display_order" keys');
        };
      };

      for(const project of projects) {
        if(Object.values(project).some(value => !Number.isInteger(+value) || +value <= 0)) {
          return Promise.reject('All values in the projects array must be integers greater than 0');
        };
      };
      
      const displayOrders = projects.map(project => +project.display_order);
      const hasDuplicates = displayOrders.some((value, index) => displayOrders.indexOf(value) !== index);

      if(hasDuplicates) {
        return Promise.reject('"display_order" values must be unique');
      };

      return true;
    }),
];


export {
  paramsIsNumber,
  emailAndPasswordAreValid, 
  validateAuth,
  refreshTokenSchema,
  validContactFormData,
  validProjectData,
  validProjectOrderData
};
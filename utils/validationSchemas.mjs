import { body, param, header } from'express-validator';
import { 
  isDateValid, 
  isValidAWSObj, 
  isValidURL, 
  verifyToken 
} from './utils.mjs';

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
    .custom((project_date) => {

      if(!project_date) {
        return Promise.reject('Project date missing.');
      };

      if(!isDateValid(project_date)) {
        return Promise.reject('Project date is invalid.');
      };

      return true;
    }),

  body('project_title')
    .notEmpty()
    .withMessage('Project title is required.')
    .isString()
    .withMessage('Project title must be a string.')
    .isLength({ min: 5, max: 50 })
    .withMessage('Project title must be between 5-50 characters long.'),
  
  body('project_description')
    .notEmpty()
    .withMessage('Project description is required.')
    .isString()
    .withMessage('Project description must be a string.')
    .isLength({ min: 25, max: 2000 })
    .withMessage('Project description must be between 25-2000 characters long.'),
    
  body('project_urls')
    .custom(async (urls) => {
      
      const allURLSAreObjs = urls.every(url => typeof url === "object");

      if(!Array.isArray(urls) || urls.length < 1 || urls.length > 4 || !allURLSAreObjs) {
        return Promise.reject('Project URLs must be an array containing 1-4 url objects.');
      };

      const objKeys = [];
      const objValues = [];

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

      const allKeysValid = Object.keys(keyCountMap).every(key => validKeys.includes(key));

      if(!allKeysValid) {
        return Promise.reject('Invalid keys in project URLs.');
      };

      const duplicateKeyCount = Object.values(keyCountMap).some(count => count > 1);

      if(duplicateKeyCount) {
        return Promise.reject('Some keys in the project URLs are duplicates.');
      };

      const allValuesAreStrings = objValues.reduce((acc, curr) => acc && typeof curr === "string", true);

      if(!allValuesAreStrings) {
        return Promise.reject('All project Urls must be strings.');
      };

      const allURLsAreValid = objValues.reduce((acc, url) => {
        return acc && isValidURL(url);
      }, true);

      if(!allURLsAreValid) {
        return Promise.reject('One or more project urls are invalid');
      };
      
      return true;
    }),
  
      
    // tests for project_photos
  body('project_photos')
    .custom(async (photos) => {

      const allPhotosAreObjs = photos.every(photo => typeof photo === "object");

      if(!Array.isArray(photos) || !allPhotosAreObjs || photos.length < 1 || photos.length > 4) {
        return Promise.reject('Project photos must be an array of 1-4 objects.');
      };

      const allPhotosHaveRequiredProperties = photos.reduce(
        (acc, photo) =>
          acc &&
          Object.keys(photo).length === 2 && // Ensure exactly 2 properties
          photo.hasOwnProperty("display_order") && // Check for display_order key
          photo.hasOwnProperty("photo_url"), // Check for photo_url key
        true
      );

      if(!allPhotosHaveRequiredProperties) {
        return Promise.reject('Each project photo must have a display order and a photo url property.');
      };
      
      const allURLsAreValidAWSObjs = photos.reduce((acc, curr) => isValidAWSObj(curr.photo_url.trim()), true);
      
      if(!allURLsAreValidAWSObjs) {
        return Promise.reject('All project photo urls must be valid aws object names ending in ".jpeg".');
      };

      const allDisplayOrdersAreValid = photos.reduce(
        (acc, curr) =>
          acc &&
          Number.isInteger(Number(curr.display_order)) && 
          Number(curr.display_order) > 0,
        true
      );
      
      if(!allDisplayOrdersAreValid) {
        return Promise.reject('All project photo display orders must be integers greater than 0.');
      };

      const displayOrderMap = {};

      photos.forEach(photo => displayOrderMap[photo.display_order] = (displayOrderMap[photo.display_order] || 0) + 1);

      const hasNoDuplicateDisplayOrders = Object.values(displayOrderMap).every(count => count <= 1);

      if(!hasNoDuplicateDisplayOrders) {
        return Promise.reject('All project photo display orders must be integers greater than 0.');
      };

      return true;
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
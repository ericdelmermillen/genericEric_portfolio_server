import jwt from'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const JWT_TOKEN_EXPIRATION_INTERVAL = process.env.JWT_TOKEN_EXPIRATION_INTERVAL;
const JWT_REFRESH_TOKEN_EXPIRATION_INTERVAL = process.env.
JWT_REFRESH_TOKEN_EXPIRATION_INTERVAL;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;


// generate jwt token
const getToken = (userID) => {
  return jwt.sign({ userID }, JWT_SECRET, { expiresIn: JWT_TOKEN_EXPIRATION_INTERVAL });
};

// generate jwt refresh token
const getRefreshToken = (userID) => {  
  return jwt.sign({ userID }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_TOKEN_EXPIRATION_INTERVAL });
};

// Verify token or refreshToken
const verifyToken = (token, tokenType) => {
  try {
    const secret =
      tokenType === "token"
        ? JWT_SECRET
        : tokenType === "refreshToken"
        ? JWT_REFRESH_SECRET
        : null;

    if(!secret) {
      return false;
    };

    jwt.verify(token, secret); // Throws error if invalid
    
    return true;
  } catch (error) {
    return false;
  };
};


const decodeJWT = (token) => {
  if(!token || typeof token !== 'string' || !token.includes('.')) {
    return null;
  };

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  };
};

// date format options: returns config obj for dates
const dateFormatOptions = () => (
  { year: 'numeric', month: '2-digit', day: '2-digit' }
);


const getFormattedDate = (date) => {
  // console.log(date); // 26-12-2024
  const [day, month, year] = date.split('-');

  // console.log(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`); // 2024-12-26
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};


export {
  getToken,
  verifyToken,
  getRefreshToken,
  decodeJWT,
  dateFormatOptions,
  getFormattedDate
};
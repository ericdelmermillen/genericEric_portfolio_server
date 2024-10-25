import jwt from'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const JWT_TOKEN_EXPIRATION_INTERVAL = process.env.JWT_TOKEN_EXPIRATION_INTERVAL;
const JWT_REFRESH_TOKEN_EXPIRATION_INTERVAL = process.env.
JWT_REFRESH_TOKEN_EXPIRATION_INTERVAL;


// generate jwt
const getToken = (userID) => {
  return jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: JWT_TOKEN_EXPIRATION_INTERVAL });
};

// verify jwt
const verifyToken = (token) => {
  try {
    const tokenString = token.replace("Bearer ", "");
    jwt.verify(tokenString, process.env.JWT_SECRET);
    
    return true;
    
  } catch(error) {
    if(error.name === 'TokenExpiredError') {
      return false;
    } 
    return false;
  }
};

// generate the refresh token
const getRefreshToken = (userID) => {  
  const refreshToken = jwt.sign({ userID }, process.env.JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_TOKEN_EXPIRATION_INTERVAL });

  return refreshToken;
};

// date format options: returns config obj for dates
const dateFormatOptions = () => (
  { year: 'numeric', month: '2-digit', day: '2-digit' }
);


export {
  getToken,
  verifyToken,
  getRefreshToken,
  dateFormatOptions
};
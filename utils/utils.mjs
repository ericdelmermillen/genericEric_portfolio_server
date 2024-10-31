import jwt from'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const JWT_TOKEN_EXPIRATION_INTERVAL = process.env.JWT_TOKEN_EXPIRATION_INTERVAL;
const JWT_REFRESH_TOKEN_EXPIRATION_INTERVAL = process.env.
JWT_REFRESH_TOKEN_EXPIRATION_INTERVAL;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_SECRET;


// generate jwt token
const getToken = (userID) => {
  return jwt.sign({ userID }, JWT_SECRET, { expiresIn: JWT_TOKEN_EXPIRATION_INTERVAL });
};

// generate jwt refresh token
const getRefreshToken = (userID) => {  
  const refreshToken = jwt.sign({ userID }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_TOKEN_EXPIRATION_INTERVAL });

  return refreshToken;
};

// verify token or refreshToken
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

    const x = jwt.verify(token, secret);
    return true;

  } catch (error) {
    return error.name === 'TokenExpiredError' ? false : false;
  };
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
import jwt from'jsonwebtoken';

// generate jwt
const getToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1m' });
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
const generateRefreshToken = (userId) => {
  const payload = {
    userId: userId
  };

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });

  return refreshToken;
};

// date format options: returns config obj for dates
const dateFormatOptions = () => (
  { year: 'numeric', month: '2-digit', day: '2-digit' }
);


export {
  getToken,
  verifyToken,
  generateRefreshToken,
  dateFormatOptions
};
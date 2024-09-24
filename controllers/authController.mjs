// import jwt for refresh token comparison
// import bcrypt to compare the hashed password
import jwt from 'jsonwebtoken';
import { 
  generateRefreshToken, 
  getToken 
} from "../utils/utils.mjs";


// const createUser = async () => {
const createUser = async (req, res) => {
  const { email, password } = req.body;

  return res.json(`user created: email: ${email}, password: ${password}`);
};


// const loginUser = async (req, res) => {
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if(email !== "ericdelmermillen@gmail.com" || password !== "12345678") {
    return res.status(401).send({message: "Email and/or password incorrect"});
  };

  // stand in for db response of found user starts
  const user = { id: 7 };

  const userID = user.id;
  // ends
  
  const token = getToken(user);
  const refreshToken = generateRefreshToken(userID);

  return res.json({
    success: true,
    message: "Login successful",
    user: user,
    token: token,
    refreshToken: refreshToken
  });
};


// generate refresh token: receives expired jwt and generates new refresh token
const refreshToken = (req, res, next) => {
  const { refreshToken } = req.body;

  // Verify refresh token
  try {
    const { userID } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newToken = getToken(userID);
    const newRefreshToken = generateRefreshToken(userID);

    res.json({
      success: true,
      message: "Token refreshed successfully",
      newToken,
      newRefreshToken
    });

  } catch (error) {
    console.error('Error refreshing token:', error);
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
};


// calls aws to get a temporary signed url for posting to s3 bucket/deleting from s3 bucket
const getSignedurl = (req, res, next) => {

  return res.json("Here's that god dammned signed url");
};

const logoutUser = (req, res) => {
  const { email, password } = req.body;

  return res.json(`user logged out: email: ${email}, password: ${password}`);
}


export {
  createUser,
  loginUser,
  refreshToken,
  getSignedurl,
  logoutUser
};
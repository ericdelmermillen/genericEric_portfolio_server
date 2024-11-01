import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { 
  getToken,
  getRefreshToken,
  verifyToken,
  decodeJWT
} from "../utils/utils.mjs";
import pool from '../dbClient.mjs';

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// POST /api/auth/createuser
const createUser = async (req, res) => {
  const { email, password } = req.body;  
  
  try {
    const [ existingUser ] = await pool.query(
    `SELECT id FROM users WHERE email = ?`, 
    [email]);

    if(existingUser.length > 0) {
      return res.status(409).json({ message: "Email already in use" });
    };
    
    const hashedPassword = await bcrypt.hash(password, 10); 

    const [ result ] = await pool.query(
      `INSERT INTO users (email, password) VALUES (?, ?)`,
      [email, hashedPassword]
    );

    return res.status(201).json({
      message: "User created successfully",
      userID: result.insertId
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: "Database error creating user" });
  }
};


// POST /api/auth/loginuser
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const [ user ] = await pool.query(
      `SELECT id, password FROM users WHERE email = ?`,
      [email]
    );

    if(user.length === 0) {
      return res.status(401).json({ message: "Email and/or password incorrect" });
    };

    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if(!isPasswordValid) {
      return res.status(401).json({ message: "Email and/or password incorrect" });
    }

    const userID = user[0].id;
    const token = getToken(userID);
    const refreshToken = getRefreshToken(userID);

    return res.json({
      message: "Login successful",
      userID: userID,
      token,
      refreshToken
    });
  } catch (error) {
    console.error(`Error logging in user: ${error}`);
    return res.status(500).json({ message: "Database error logging in user" });
  }
};

// POST /api/auth/refreshtoken
const refreshToken = (req, res, next) => {
  const { refreshToken } = req.body;
  
  try {
    const { userID } = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const newToken = getToken(userID);
    const newRefreshToken = getRefreshToken(userID);

    res.json({
      message: "Token refreshed successfully",
      userID: userID,
      newToken,
      newRefreshToken
    });

  } catch (error) {
    console.error('Error refreshing token:', error);
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
};


// calls aws to get a temporary signed url for posting to s3 bucket/deleting from s3 bucket
// POST/api/auth/getsignedurl
const getSignedurl = (req, res, next) => {

  return res.json("Here's that god dammned signed url");
};


// // POST /api/auth/logoutuser
const logoutUser = (req, res) => {
  const { token, refreshToken } = req.body;

  if(!token || !refreshToken) {
    return res.status(401).json({ message: 'Authorization token or refresh token is missing' });
  }

  const tokenIsValid = 
    verifyToken(token, "token") || 
    verifyToken(refreshToken, "refreshToken");

  if(!tokenIsValid) {
    return res.status(401).json({ message: 'Both authorization tokens are invalid' });
  }

  const { userID } = decodeJWT(token) || decodeJWT(refreshToken);

  if(!userID || isNaN(Number(userID))) {
    return res.status(400).json({ message: "Error logging out: invalid token" });
  };

  // client configured to log out on error: no need to update database with logged out user but may want to log in future

  return res.status(200).json({ message: "Successfully logged out" });
};

export {
  createUser,
  loginUser,
  refreshToken,
  getSignedurl,
  logoutUser
};
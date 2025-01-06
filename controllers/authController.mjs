import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { 
  getToken,
  getRefreshToken,
  decodeJWT
} from "../utils/utils.mjs";
import { 
  generateUploadURL
 } from "../s3.js";
import pool from '../dbClient.mjs';
import dotenv from "dotenv";

dotenv.config();


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
  };
};


// POST /api/auth/loginuser
const loginUser = async (req, res) => {
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
    };

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
  };
};


// POST /api/auth/refreshtoken
const refreshToken = (req, res) => {
  const refreshToken = req.headers['x-refresh-token'];

  try {
    const { userID, exp } = jwt.decode(refreshToken);
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Check if refresh token has expired
    if(exp < currentTimestamp) {
      console.log('Refresh token expired');
      return res.status(401).json({ error: 'Refresh token expired' });
    };

    // Generate new tokens
    const newToken = getToken(userID);
    const newRefreshToken = getRefreshToken(userID);

    return res.json({
      message: 'Token refreshed successfully',
      userID,
      newToken,
      newRefreshToken,
    });
  } catch (error) {
    console.log('Error refreshing token:', error);
    return res.status(401).json({ error: 'Invalid refresh token' });
  };
};


// could just enforce dirname === project-images since client expects that dirname
// POST/api/auth/getsignedurl
const getSignedurl = async (req, res) => {
  const { dirname } = req.query;
  
  if(!dirname) {
    return res.status(400).json({ message: 'Dirname required' });
  };

  const url = await generateUploadURL(dirname);

  return res.send({url});
};


// // POST /api/auth/logoutuser
const logoutUser = (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const refreshToken = req.headers['x-refresh-token'];  

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
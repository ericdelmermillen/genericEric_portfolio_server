import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { 
  getToken,
  generateRefreshToken
} from "../utils/utils.mjs";
import pool from '../dbClient.mjs';

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
    const refreshToken = generateRefreshToken(userID);

    return res.json({
      message: "Login successful",
      userID: userID,
      token,
      refreshToken,
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
    const { userID } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newToken = getToken(userID);
    const newRefreshToken = generateRefreshToken(userID);

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


// POST /api/auth/logoutuser
const logoutUser = async (req, res) => {
  const { token, refreshToken } = req.body;

    const decodeJWT = (token) => {
      try {
        const base64Url = token.split('.')[1]; // Get the payload part
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    };
  
    const { userID } = decodeJWT(token) || decodeJWT(refreshToken);

  // handling for invalidating token/refresh token to be added later

  if((!userID) || isNaN(+userID)) {
    return res.status(400).json({ message: "Error logging out: token or refrshToken invalid" });
  } 

  try {
    const [ matchedUser ] = await pool.query(
      `SELECT id FROM users WHERE id = ?`,
      [userID]
    );

    if(matchedUser.length === 0) {
      return res.status(404).json({ message: `Unable to log you out: user with userID of ${userID} not found` });
    }

    return res.status(200).json({ message: "Successfully logged out" });

  } catch (error) {
    console.error('Error logging out user:', error);
    return res.status(500).json({ message: "An error occurred while logging out" });
  }
};


export {
  createUser,
  loginUser,
  refreshToken,
  getSignedurl,
  logoutUser
};
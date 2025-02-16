import express from "express";
import { 
  createUser, 
  loginUser, 
  refreshToken, 
  getSignedurl,
  logoutUser 
} from "../controllers/authController.mjs";
import{ 
  emailAndPasswordAreValid, 
  validateAuthData,
  refreshTokenData
 } from '../utils/validationSchemas.mjs';
import { validateRequest } from "../middleware/middleware.mjs";

const authRouter = express.Router();

// POST /api/auth/createuser
authRouter.route('/createuser')
  .post(
    validateRequest(emailAndPasswordAreValid), 
    createUser);

// POST /api/auth/loginuser
authRouter.route("/loginuser")
  .post(
    validateRequest(emailAndPasswordAreValid), 
    loginUser);

// POST /api/auth/refreshtoken
authRouter.route("/refreshtoken")
  .post(
    validateRequest(refreshTokenData), 
    refreshToken);

// protected route that does not send fresh tokens
// POST /api/auth/getsignedurl
authRouter.route("/getsignedurl")
  .post(
    validateRequest(validateAuthData), 
    getSignedurl);
  
// POST /api/auth/logoutuser
authRouter.route("/logoutuser")
  .post(
    validateRequest(validateAuthData), 
    logoutUser);

export default authRouter;
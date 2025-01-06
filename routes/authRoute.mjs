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
  tokenSchema, 
  refreshTokenSchema
 } from '../utils/validationSchemas.mjs';
import { validateRequest } from "../middleware/middleware.mjs";
const authRouter = express.Router();


// POST /api/auth/createuser
authRouter.route('/createuser')
  .post(validateRequest(emailAndPasswordAreValid), createUser);


// POST /api/auth/loginuser
authRouter.route("/loginuser")
.post(validateRequest(emailAndPasswordAreValid), loginUser);


// POST /api/auth/refreshtoken
authRouter.route("/refreshtoken")
  .post(validateRequest(refreshTokenSchema), refreshToken);


// POST /api/auth/getsignedurl
authRouter.route("/getsignedurl")
  .post(
    validateRequest(tokenSchema), 
    validateRequest(refreshTokenSchema), 
    getSignedurl);
  
  
// POST /api/auth/logoutuser
authRouter.route("/logoutuser")
  .post(
    validateRequest(tokenSchema), 
    validateRequest(refreshTokenSchema), 
    logoutUser);


export default authRouter;
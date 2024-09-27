import express from "express";
import { 
  createUser, 
  loginUser, 
  refreshToken, 
  getSignedurl,
  logoutUser 
} from "../controllers/authController.mjs";
import{ emailAndPasswordAreValid, refreshTokenSchema } from '../utils/validationSchemas.mjs';
import { validateRequest } from "../middleware/middleware.mjs";
const authRouter = express.Router();


// POST /api/auth/createuser
authRouter.route('/createuser')
  .post(validateRequest(emailAndPasswordAreValid), createUser);


// POST /api/auth/loginuser
authRouter.route("/loginuser")
.post(validateRequest(emailAndPasswordAreValid), loginUser);


// generate refresh token
authRouter.route("/refreshtoken")
  .post(validateRequest(refreshTokenSchema), 
  refreshToken);
  

authRouter.route("/getsignedurl")
  .post(getSignedurl);
  
  
  // logoutUser route
authRouter.route("/logoutuser")
  .post(logoutUser);


export default authRouter;

import express from "express";
import { 
  createUser, 
  loginUser, 
  refreshToken, 
  getSignedurl,
  logoutUser 
} from "../controllers/authController.mjs";
const authRouter = express.Router();

// where necessary add validation middleware from middleware.js package


// createUser route
authRouter.route('/createuser')
  .post(createUser)


// loginUser route
authRouter.route("/loginuser")
  .post(loginUser)


// generate refresh token
authRouter.route("/refreshtoken")
  .post(refreshToken)

authRouter.route("/getsignedurl")
  .post(getSignedurl)
  
  
  // logoutUser route
authRouter.route("/logoutuser")
  .post(logoutUser)


export default authRouter;

import express from "express";
import { createUser, loginUser, logoutUser } from "../controllers/authController.mjs";
const authRouter = express.Router();


// createUser route
authRouter.route('/createuser')
  .post(createUser)


  // loginUser route
authRouter.route("/loginuser")
  .post(loginUser)


  // logoutUser route
authRouter.route("/logoutuser")
  .post(logoutUser)



export default authRouter;

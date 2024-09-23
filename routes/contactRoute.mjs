import express from "express";
import { sendContactForm } from "../controllers/contactController.mjs";
// import { 
//   createUser, 
//   loginUser, 
//   refreshToken, 
//   getSignedurl,
//   logoutUser 
// } from "../controllers/authController.mjs";
const contactRouter = express.Router();

contactRouter.route("/")
  .post(sendContactForm);

export default contactRouter;
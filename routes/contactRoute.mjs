import express from "express";
import { sendContactForm } from "../controllers/contactController.mjs";
import { validateRequest } from "../middleware/middleware.mjs";
import{ validContactFormData } from '../utils/validationSchemas.mjs';

// POST /api/contact/
const contactRouter = express.Router();

contactRouter.route("/")
  .post(validateRequest(validContactFormData), sendContactForm);

export default contactRouter;
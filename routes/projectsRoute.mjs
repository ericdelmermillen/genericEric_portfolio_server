import express from "express";
import { 
  getPortfolioSummary,
  getProjects,
  getProjectDetails,
  createProject,
  editProject,
  deleteProject,
  updateProjectOrder
} from "../controllers/projectsController.mjs";
import { validateRequest } from "../middleware/middleware.mjs";
import { paramsIsNumber, refreshTokenSchema, tokenSchema, validContactFormData, validProjectData } from "../utils/validationSchemas.mjs";

const projectsRouter = express.Router();


// get project summaries for portfolio section of home page: 
// GET /api/projects/portfoliosummary
projectsRouter.route('/portfoliosummary')
  .get(getPortfolioSummary);


// get all projects for projects page: accepts limit and offset for pagination
// GET /api/projects/all
projectsRouter.route('/all')
  .get(getProjects);


// get all details for the project
// GET /api/projects/project/:id
projectsRouter.route('/project/:id')
  .get(
    validateRequest(paramsIsNumber), 
    validateRequest(tokenSchema), 
    validateRequest(refreshTokenSchema), 
    getProjectDetails);


// post a new project
// POST /api/projects/add
projectsRouter.route('/project/add')
.post(
  // validateRequest(tokenSchema), 
  // validateRequest(refreshTokenSchema), 
  validateRequest(validContactFormData), 
  createProject);


// edit an existing project
// add validProjectData
// PUT /api/projects/edit/:id
projectsRouter.route('/project/edit/:id')
  .put(editProject);


// DELETE /api/projects/edit/:id
projectsRouter.route('/project/delete/:id')
  .delete(validateRequest(paramsIsNumber), deleteProject);


// update project order
// PATCH /api/projects/updateorder
projectsRouter.route('/updateorder')
  .patch(updateProjectOrder);


export default projectsRouter;
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

const projectsRouter = express.Router();


// get project summaries for portfolio section of home page: 
// --get the first image (dispay_order: 1) of the first X number of projects
projectsRouter.route('/portfoliosummary')
  .get(getPortfolioSummary);

// get all projects: needs to accept limit and offset for pagination
// call from projects:
projectsRouter.route('/all')
  .get(getProjects);


// get all details for the project
projectsRouter.route('/project/:id')
  .get(getProjectDetails);


// post a new project
projectsRouter.route('/project/add')
  .post(createProject);

// edit an existing project
projectsRouter.route('/project/edit/:id')
  .put(editProject);

// delete project by id
projectsRouter.route('/project/delete/:id')
  .delete(deleteProject)


// update project order
projectsRouter.route('/updateorder')
  .patch(updateProjectOrder)


export default projectsRouter;
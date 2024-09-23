import express from "express";
import { 
  getProjectSummaries,
  getProjectDetails,
  createProject,
  editProject,
  deleteProject,
  updateProjectOrder
} from "../controllers/projectsController.mjs";

const projectsRouter = express.Router();


// get all projects: needs to accept limit and offset for pagination
// call from Home of app returns 4 projects
// probably only return project summaries
projectsRouter.route('/all')
  .get(getProjectSummaries);


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
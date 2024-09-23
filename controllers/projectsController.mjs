
// get projectSummaries
// returns project image (first image for each project)
// returns project description
// returns project url
const getProjectSummaries = async (req, res, next) => {
  console.log("getProjectSummaries controller");
  return res.json("Here's the goddamned project summaries");
};


// getProjectDetails returns all details/info for the project
// all screen pics for the project
// full project description
// project deployment url
// any related blog posts/youtube videos
const getProjectDetails = async (req, res, next) => {
  const projectId = req.params.id;
  
  console.log(`getProjectDetails for project: ${projectId}`)
  return res.json(`Here's the goddamned details for project: ${projectId}`)
};

const createProject = async (req, res, next) => {

  console.log("createProject")
  return res.json(`Looks like a great project`);
};

// edit project by id
const editProject = async (req, res, next) => {
  const projectId = req.params.id;

  return res.json(`Project ${projectId} edited successfully`);
};


// delete project by id
const deleteProject = async (req, res, next) => {
  const projectId = req.params.id;

  return res.json(`Project ${projectId} deleted successfully`);
};

const updateProjectOrder = async (req, res, next) => {

  return res.json("Project order updated successfully");
}



export {
  getProjectSummaries,
  getProjectDetails,
  createProject,
  editProject,
  deleteProject,
  updateProjectOrder
};
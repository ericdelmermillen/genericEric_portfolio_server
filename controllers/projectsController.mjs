import pool from '../dbClient.mjs';

import bcrypt from 'bcrypt';
import { verifyToken } from '../utils/utils.mjs';

// get portfolio summary
// returns all project summaries
// --image object name for image url (maybe send full url)
const getPortfolioSummary = async (req, res, next) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : null;
  const offset = req.query.offset ? parseInt(req.query.offset) : null;

  try {
    let query = `
      SELECT 
        p.project_id AS id, 
        p.title AS projectTitle, 
        p.display_order AS display_order,
        (SELECT photo_url FROM photos WHERE photos.project_id = p.project_id AND photos.display_order = 1 LIMIT 1) AS imgSrc
      FROM 
        projects p
      ORDER BY 
        p.display_order ASC
    `;

    const queryParams = [];
    if(limit !== null) {
      query += ` LIMIT ?`;
      queryParams.push(limit);
    };

    if(offset !== null) {
      query += ` OFFSET ?`;
      queryParams.push(offset);
    };

    const [rows] = await pool.query(query, queryParams);

    const projectSummaries = rows.map(row => ({
      project_id: row.id,
      projectTitle: row.projectTitle,
      display_order: row.display_order,
      imgSrc: row.imgSrc || null
    }));

    return res.json(projectSummaries);
  } catch (error) {
    console.error("Error fetching portfolio summary:", error);
    return res.status(500).json({ message: "Failed to fetch portfolio summary" });
  }
};



// get all projects
// returns entire project
// --id
// --display_order
// --title
// --description
// --photo_object names
// --url for the project
// --youtube video url if there is one
const getProjects = async (req, res, next) => {
  console.log("getProjects controller");
  return res.json("Here's the goddamned project summaries");
};


// getProjectDetails returns all details/info for the project
// to populate the AddOrEdit project page (edit view) for admin to edit project
// returns entire project:
// --all pics for the project
// --display_order for project images
// --display_order for the project (?)
// project description
// project deployment url
// youtube video url if there is one
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
// needs to also get all the object names for the photos and call aws to delete each from the s3 bucket
const deleteProject = async (req, res, next) => {
  const projectId = req.params.id;
  const token = req.headers.authorization.split(" ")[1];

  if(!token || !verifyToken(token)) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' });
  };

  try {
    const [ project ] = await pool.execute(
      'SELECT * FROM projects WHERE project_id = ?',
      [projectId]
    );

    if(project.length === 0) {
      return res.status(404).json({ message: `Project ${projectId} not found` });
    };

    await pool.execute('DELETE FROM projects WHERE project_id = ?', [projectId]);

    return res.json({ message: `Project ${projectId} deleted successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete project' });
  };
};


const updateProjectOrder = async (req, res, next) => {
  const { new_project_order } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  
  if(!token || !verifyToken(token)) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' });
  };

  if(!Array.isArray(new_project_order) || new_project_order.length === 0) {
    return res.status(400).json({ message: 'Invalid input. Expected an array of project orders.' });
  };

  const connection = await pool.getConnection(); 

  try {
    await connection.beginTransaction(); 

    for (const { project_id, display_order } of new_project_order) {
      if(typeof project_id === 'undefined' || typeof display_order === 'undefined') {
        throw new Error(`Missing project_id or display_order for project ${project_id}`);
      }

      await connection.execute(
        'UPDATE projects SET display_order = ? WHERE project_id = ?',
        [display_order, project_id]
      );
    };

    await connection.commit();

    return res.json({ message: 'Project order updated successfully' });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    return res.status(500).json({ error: 'Failed to update project order' });
  } finally {
    connection.release();
  };
};




export {
  getPortfolioSummary,
  getProjects,
  getProjectDetails,
  createProject,
  editProject,
  deleteProject,
  updateProjectOrder
};
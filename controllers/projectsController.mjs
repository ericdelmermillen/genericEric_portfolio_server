import pool from '../dbClient.mjs';
import { 
  decodeJWT,
  getRefreshToken, 
  getToken, 
  verifyToken 
} from '../utils/utils.mjs';

// ***need validations for all requests that are protected


// get portfolio summary
// returns all project summaries
// --image object name for image url (maybe send full url)
const getPortfolioSummary = async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : null;
  const offset = req.query.offset ? parseInt(req.query.offset) : null;

  try {
    let query = `
      SELECT 
        p.project_id AS id, 
        p.project_title AS projectTitle, 
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
      project_title: row.projectTitle,
      display_order: row.display_order,
      img_src: row.imgSrc || null
    }));

    return res.json(projectSummaries);
  } catch (error) {
    console.error("Error fetching portfolio summary:", error);
    return res.status(500).json({ message: "Failed to fetch portfolio summary" });
  }
};


// get all projects
// returns entire project
// --photo_object names
const getProjects = async (req, res) => {
  try {
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const offset = Math.max(parseInt(req.query.offset) || 0, 0);

    const [ maxDisplayOrderResult ] = await pool.query(`
      SELECT MAX(display_order) AS max_display_order 
      FROM projects
    `);

    const maxDisplayOrder = maxDisplayOrderResult[0].max_display_order;

    let query = `
      SELECT 
          project_id,
          DATE_FORMAT(project_date, '%d-%m-%Y') AS project_date,
          display_order,
          project_title,
          project_description
      FROM projects
      ORDER BY display_order
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

    const [ projects ] = await pool.query(query, queryParams);

    const isFinalPage = projects[projects.length - 1].display_order === maxDisplayOrder;

    // Collect project_ids for the second query
    const projectIds = projects.map(project => project.project_id);

    // Initialize arrays for project photos and URLs
    const projectPhotos = {};
    const projectUrls = {};

    if(projectIds.length > 0) {
      const photosQuery = `
        SELECT photo_id, photo_url, display_order, project_id
        FROM photos
        WHERE project_id IN (?)
        ORDER BY project_id, display_order
      `;
      const [ photos ] = await pool.query(photosQuery, [projectIds]);

      photos.forEach(photo => {
        if(!projectPhotos[photo.project_id]) {
          projectPhotos[photo.project_id] = [];
        };

        projectPhotos[photo.project_id].push({
          photo_id: photo.photo_id,
          photo_url: photo.photo_url,
          display_order: photo.display_order,
        });
      });

      const urlsQuery = `
        SELECT u.url_type AS url_label, pu.url, pu.project_id
        FROM project_urls pu
        JOIN url_types u ON pu.url_type = u.type_id
        WHERE pu.project_id IN (?)
      `;
      
      const [ urls ] = await pool.query(urlsQuery, [projectIds]);

      urls.forEach(url => {
        if(!projectUrls[url.project_id]) {
          projectUrls[url.project_id] = [];
        };

        projectUrls[url.project_id].push({
          [url.url_label]: url.url,
        });
      });
    };

    projects.forEach(project => {
      project.project_photos = projectPhotos[project.project_id] || [];
      project.project_urls = projectUrls[project.project_id] || [];
    });
  
    return res.json({
      projects,
      isPaginationComplete: isFinalPage
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ error: "An error occurred while fetching projects" });
  };
};


// getProjectDetails returns all details/info for the project
// to populate the AddOrEdit project page (edit view) for admin to edit project
const getProjectDetails = async (req, res) => {
  const projectId = req.params.id;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const refreshToken = req.headers['x-refresh-token'];

  if(!token && !refreshToken) {
    return res.status(401).json({ message: 'Authorization or refresh token missing' });
  };

  const decodedToken =
    verifyToken(token, "token") ||
    verifyToken(refreshToken, "refreshToken");

  if(!decodedToken) {
    return res.status(401).json({ message: 'Authorization token invalid' });
  };

  const { userID } = decodeJWT(token) || decodeJWT(refreshToken);

  try {
    const connection = await pool.getConnection();

    // Query project details
    const [ projectRows ] = await connection.query(
      `SELECT 
         project_id, 
         DATE_FORMAT(project_date, '%d-%m-%Y') AS project_date, 
         display_order, 
         project_title, 
         project_description 
       FROM projects 
       WHERE project_id = ?`,
      [projectId]
    );

    if(projectRows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const project = projectRows[0];

    // Query project URLs
    const [ urlRows ] = await connection.query(
      `SELECT 
         ut.url_type AS type, 
         pu.url 
       FROM project_urls pu 
       JOIN url_types ut ON pu.url_type = ut.type_id 
       WHERE pu.project_id = ?`,
      [projectId]
    );

    const projectUrls = urlRows.map(row => ({ [row.type]: row.url }));

    // Query project photos
    const [ photoRows ] = await connection.query(
      `SELECT 
         photo_id, 
         display_order, 
         photo_url 
       FROM photos 
       WHERE project_id = ? 
       ORDER BY display_order ASC`,
      [projectId]
    );

    const projectPhotos = photoRows.map(photo => ({
      photo_id: photo.photo_id,
      display_order: photo.display_order,
      photo_url: photo.photo_url
    }));

    // Construct the response
    const projectDetails = {
      project_id: project.project_id,
      project_date: project.project_date,
      display_order: project.display_order,
      project_title: project.project_title,
      project_description: project.project_description,
      project_urls: projectUrls,
      project_photos: projectPhotos,
      newToken: getToken(userID),
      newRefreshToken: getRefreshToken(userID)
    };

    return res.json(projectDetails);
  } catch (error) {
    console.error("Error fetching project details:", error);
  };
};


const createProject = async (req, res) => {

  console.log("createProject")
  return res.json(`Looks like a great project`);
};

// edit project by id
const editProject = async (req, res) => {
  const projectId = req.params.id;

  return res.json(`Project ${projectId} edited successfully`);
};


// delete project by id
const deleteProject = async (req, res) => {
  const projectID = req.params.id;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const refreshToken = req.headers['x-refresh-token'];

  if(!token && !refreshToken) {
    return res.status(401).json({ message: 'Authorization or refresh token missing' });
  };

  const decodedToken =
    verifyToken(token, "token") ||
    verifyToken(refreshToken, "refreshToken");

  if(!decodedToken) {
    return res.status(401).json({ message: 'Authorization token invalid' });
  };

  const { userID } = decodeJWT(token) || decodeJWT(refreshToken);

  let connection;

  try {
    connection = await pool.getConnection();

    // Start transaction
    await connection.beginTransaction();

    // Check if project exists
    const [ projectRows ] = await connection.query(
      'SELECT * FROM projects WHERE project_id = ?',
      [projectID]
    );

    if(projectRows.length === 0) {
      await connection.rollback(); // Rollback transaction if project not found
      return res.status(404).json({ message: `Project ${projectID} not found` });
    };

    // Delete the project
    await connection.query('DELETE FROM projects WHERE project_id = ?', [projectID]);

    // Commit transaction
    await connection.commit();

    return res.json({
      message: `Project ${projectID} deleted successfully`,
      newToken: getToken(userID),
      newRefreshToken: getRefreshToken(userID),
    });

  } catch (error) {
    if(connection) {
      await connection.rollback(); // Rollback on error
    };
    console.error("Error deleting project:", error);
    return res.status(500).json({ error: 'Failed to delete project' });
  } finally {
    if(connection) {
      connection.release(); // Ensure the connection is released back to the pool
    };
  };
};


// add validations for project_id and display_order to be number
// update project order for all projects
const updateProjectOrder = async (req, res) => {
  const { new_project_order } = req.body;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const refreshToken = req.headers['x-refresh-token'];

  if(!token && !refreshToken) {
    return res.status(401).json({ message: 'Authorization or refresh token missing' });
  };

  const decodedToken = 
    verifyToken(token, "token") || 
    verifyToken(refreshToken, "refreshToken");

  if(!decodedToken) {
    return res.status(401).json({ message: 'Authorization token invalid' });
  };

  const { userID } = decodeJWT(token) || decodeJWT(refreshToken);

  // can move this to validation schema
  if(!Array.isArray(new_project_order) || new_project_order.length === 0) {
    return res.status(400).json({ message: 'Invalid input. Expected an array of project orders.' });
  };

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for(const { project_id, display_order } of new_project_order) {
      if(typeof project_id === 'undefined' || typeof display_order === 'undefined') {
        throw new Error(`Missing project_id or display_order for project ${project_id}`);
      }

      await connection.execute(
        'UPDATE projects SET display_order = ? WHERE project_id = ?',
        [display_order, project_id]
      );
    };

    await connection.commit();

    return res.json({
      message: 'Project order updated successfully',
      newToken: getToken(userID),
      newRefreshToken: getRefreshToken(userID)
    });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    return res.status(500).json({ message: 'Failed to update project order' });
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
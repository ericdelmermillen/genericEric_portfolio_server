import pool from '../dbClient.mjs';
import { deleteFiles } from '../s3.mjs';
import { 
  decodeJWT,
  getFormattedDate,
  getFreshTokens
} from '../utils/utils.mjs';

const AWS_BUCKET_PATH = process.env.AWS_BUCKET_PATH;

// get portfolio summary
// GET /api/projects/portfoliosummary
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

    const [ rows ] = await pool.query(query, queryParams);

    const projectSummaries = rows.map(row => ({
      project_id: row.id,
      project_title: row.projectTitle,
      display_order: row.display_order,
      img_src: row.imgSrc
    }));

    return res.json(projectSummaries);
  } catch (error) {
    console.error("Error fetching portfolio summary:", error);
    return res.status(500).json({ message: `Failed to fetch portfolio summary, error: ${error.message}` });
  };
};

// get all projects: returns entire project for projects page
// GET /api/projects/all
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
      LIMIT ? OFFSET ?
    `;

    const queryParams = [limit, offset];

    const [ projects ] = await pool.query(query, queryParams);

    // need to handle if there are no projects
    if(!projects.length) {
      return res.json({
        projects,
        isPaginationComplete: true
      });
    };

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

// getProjectDetails returns all data for the project: for edit project
// GET /api/projects/project/:id
const getProjectDetails = async (req, res) => {
  const projectId = req.params.id;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const refreshToken = req.headers['x-refresh-token'];

  const { userID } = decodeJWT(token) || decodeJWT(refreshToken);

  let connection;

  try {
    connection = await pool.getConnection();

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
    };

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

    const projectUrls = urlRows.map(row => ({ [ row.type ]: row.url }));

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

    const { newToken, newRefreshToken } = getFreshTokens(userID);

    // Construct the response
    const projectDetails = {
      project_id: project.project_id,
      project_date: project.project_date,
      display_order: project.display_order,
      project_title: project.project_title,
      project_description: project.project_description,
      project_urls: projectUrls,
      project_photos: projectPhotos,
      newToken: newToken,
      newRefreshToken: newRefreshToken
    };

    return res.json(projectDetails);
  } catch (error) {
    console.error("Error fetching project details:", error);
    return res.status(500).json({ error: `An error occurred while fetching project ${projectId}` });
  } finally {
    connection.release();
  };
};

// post project
// POST /api/projects/add
const createProject = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const refreshToken = req.headers['x-refresh-token'];

  const { userID } = decodeJWT(token) || decodeJWT(refreshToken);

  const { 
    project_date, 
    project_title, 
    project_description, 
    project_urls, 
    project_photos 
  } = req.body;

  const connection = await pool.getConnection(); 

  let formattedDate;

  try {
    formattedDate = getFormattedDate(project_date);
  } catch(error) {
    return res.status(400).json({ message: "Invalid date format" });
  };

  const uploadedPhotoUrls = project_photos.map(photo => photo.photo_url);

  try {
    await connection.beginTransaction();

    await connection.execute(
      `
      UPDATE projects
      SET display_order = display_order + 1
      `
    );

    // Insert the new project into the `projects` table with display_order = 1
    const [ projectResult ] = await connection.execute(
      `
      INSERT INTO projects (project_date, project_title, project_description, display_order)
      VALUES (?, ?, ?, ?)
      `,
      [formattedDate, project_title, project_description, 1]
    );

    const projectID = projectResult.insertId;

    for(const url of project_urls) {
      const [ urlType ] = Object.keys(url);
      const urlValue = url[urlType];

      const [ typeRows ] = await connection.execute(
        `
        SELECT type_id FROM url_types WHERE url_type = ?
        `,
        [urlType]
      );

      if(typeRows.length === 0) {
        throw new Error(`URL type "${urlType}" not found`);
      };

      const typeID = typeRows[0].type_id;

      await connection.execute(
        `
        INSERT INTO project_urls (project_id, url_type, url)
        VALUES (?, ?, ?)
        `,
        [projectID, typeID, urlValue]
      );
    };

    for(const photo of project_photos) {
      const { display_order, photo_url } = photo;

      await connection.execute(
        `
        INSERT INTO photos (project_id, photo_url, display_order)
        VALUES (?, ?, ?)
        `,
        [projectID, photo_url, display_order]
      );
    };

    await connection.commit();

    const { newToken, newRefreshToken } = getFreshTokens(userID);

    return res.status(201).json({ 
      message: "Project created successfully",
      newToken,
      newRefreshToken
    });
  } catch (error) {
    console.error("Error creating project:", error);

    // Rollback database transaction
    if(connection) {
      await connection.rollback();
    };

    // Cleanup: delete uploaded photos if any
    if(uploadedPhotoUrls.length > 0) {
      try {
        await deleteFiles(uploadedPhotoUrls);
        console.log("Successfully deleted uploaded photos from S3");
      } catch (cleanupError) {
        console.error("Error cleaning up uploaded photos:", cleanupError);
      };
    };

    return res.status(500).json({ message: "Error creating project"});
  } finally {
    connection.release();
  };
};


// edit project by id
// PUT /api/projects/edit/:id
const editProject = async (req, res) => {
  const projectId = req.params.id;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const refreshToken = req.headers['x-refresh-token'];

  const { userID } = decodeJWT(token) || decodeJWT(refreshToken);

  const { 
    project_date, 
    project_title, 
    project_description, 
    project_urls, 
    project_photos 
  } = req.body;

  const connection = await pool.getConnection();

  let formattedDate;

  try {
    formattedDate = getFormattedDate(project_date);
  } catch (error) {
    return res.status(400).json({ message: "Invalid date format" });
  };

  try {
    await connection.beginTransaction();

    const [ updateProjectResult ] = await connection.execute(
      `
      UPDATE projects
      SET
        project_date = ?,
        project_title = ?,
        project_description = ?
      WHERE project_id = ?
      `,
      [formattedDate, project_title, project_description, projectId]
    );

    if(updateProjectResult.affectedRows === 0) {
      return res.status(404).json({ message: "Project not found" });
    };

    // Update project URLs
    if(project_urls) {
      // Remove existing URLs and re-add them
      await connection.execute(
        `DELETE FROM project_urls WHERE project_id = ?`,
        [projectId]
      );

      for(const url of project_urls) {
        const [ urlType ] = Object.keys(url);
        const urlValue = url[urlType];

        const [ typeRows ] = await connection.execute(
          `
          SELECT type_id FROM url_types WHERE url_type = ?
          `,
          [urlType]
        );

        if(typeRows.length === 0) {
          throw new Error(`URL type "${urlType}" not found`);
        };

        const typeID = typeRows[0].type_id;

        await connection.execute(
          `
          INSERT INTO project_urls (project_id, url_type, url)
          VALUES (?, ?, ?)
          `,
          [projectId, typeID, urlValue]
        );
      };
    }

    if(project_photos) {
      await connection.execute(
        `DELETE FROM photos WHERE project_id = ?`,
        [projectId]
      );

      for(const photo of project_photos) {
        const { display_order, photo_url } = photo;

        await connection.execute(
          `
          INSERT INTO photos (project_id, photo_url, display_order)
          VALUES (?, ?, ?)
          `,
          [projectId, photo_url, display_order]
        );
      };
    };

    await connection.commit();

    const { newToken, newRefreshToken } = getFreshTokens(userID);

    return res.status(200).json({ 
      message: "Project edited successfully",
      newToken,
      newRefreshToken 
    });
  } catch (error) {
    console.error("Error editing project:", error);
    await connection.rollback();
    return res.status(500).json({ message: "Error editing project" });
  } finally {
    connection.release();
  };
};


// DELETE /api/projects/edit/:id
const deleteProject = async (req, res) => {
  const projectID = req.params.id;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const refreshToken = req.headers['x-refresh-token'];

  const { userID } = decodeJWT(token) || decodeJWT(refreshToken);

  let connection;

  try {
    connection = await pool.getConnection();

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

    const [ photoRows ] = await connection.query(
      'SELECT photo_url FROM photos WHERE project_id = ?',
      [projectID]
    );

    const photoUrls = photoRows.map((row) => row.photo_url);

    if (photoUrls.length > 0) {
      try {
        await deleteFiles(photoUrls); // Ensure this function is imported and accessible
      } catch (deleteError) {
        console.error("Error deleting files:", deleteError);
        throw new Error("Failed to delete project files");
      };
    };

    // Delete the project
    await connection.query('DELETE FROM projects WHERE project_id = ?', [projectID]);

    // Commit transaction
    await connection.commit();

    const { newToken, newRefreshToken } = getFreshTokens(userID);

    return res.json({
      message: `Project ${projectID} deleted successfully`,
      newToken: newToken,
      newRefreshToken: newRefreshToken,
    });

  } catch(error) {
    if(connection) {
      await connection.rollback();
    };

    console.error("Error deleting project:", error);
    return res.status(500).json({ error: 'Failed to delete project' });
  } finally {
    if(connection) {
      connection.release();
    };
  };
};

// add validations for project_id and display_order to be number
// PATCH /api/projects/updateorder
const updateProjectOrder = async (req, res) => {
  const { new_project_order } = req.body;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const refreshToken = req.headers['x-refresh-token'];

  const { userID } = decodeJWT(token) || decodeJWT(refreshToken);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for(const { project_id, display_order } of new_project_order) {
      if(typeof project_id === 'undefined' || typeof display_order === 'undefined') {
        throw new Error(`Missing project_id or display_order for project ${project_id}`);
      };

      await connection.execute(
        'UPDATE projects SET display_order = ? WHERE project_id = ?',
        [display_order, project_id]
      );
    };

    await connection.commit();

    const { newToken, newRefreshToken } = getFreshTokens(userID);

    return res.json({
      message: 'Project order updated successfully',
      newToken,
      newRefreshToken
    });
  } catch(err) {
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
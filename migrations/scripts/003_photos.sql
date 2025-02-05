-- Up
CREATE TABLE IF NOT EXISTS photos (
  photo_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  photo_url VARCHAR(255) NOT NULL,
  display_order INT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Down
DROP TABLE IF EXISTS photos;
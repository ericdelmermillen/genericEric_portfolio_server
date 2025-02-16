-- Up
CREATE TABLE IF NOT EXISTS project_urls (
  url_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  url_type INT NOT NULL,
  url VARCHAR(2048) NOT NULL,
  FOREIGN KEY (url_type) REFERENCES url_types(type_id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Down
DROP TABLE IF EXISTS project_urls;
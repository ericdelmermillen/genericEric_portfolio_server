-- get projects with photo_urls
SELECT
  projects.project_id,
  projects.title,
  projects.description,
  photos.photo_id,
  photos.photo_url
FROM
  projects
  LEFT JOIN photos ON projects.project_id = photos.project_id
ORDER BY
  projects.display_order,
  photos.display_order;
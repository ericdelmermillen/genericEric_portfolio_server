DROP DATABASE IF EXISTS generic_db;

CREATE DATABASE generic_db;

USE generic_db;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  password VARCHAR(255)
);

CREATE TABLE projects (
  project_id INT AUTO_INCREMENT PRIMARY KEY,
  project_date DATE NOT NULL,
  project_title VARCHAR(255) NOT NULL,
  project_description TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


insert into
  projects (
    project_date,
    project_title,
    project_description
  )
VALUES
  -- mad gabs game
  (
    '2023-08-09',
    'Mad Gabs Game',
    'This Mad Gabs-inspired React game brings together wordplay and real-time speech recognition, utilizing the Web Speech API to create an engaging language experience. Players encounter jumbled word clusters on the screen that, when pronounced correctly, reveal familiar phrases. The game’s challenge lies in deciphering these seemingly nonsensical words and speaking them aloud in a way that matches the intended sound. Through the Web Speech API, the game captures and analyzes each attempt to determine if the player’s pronunciation aligns with the correct phrase, allowing progression to the next round for successful matches.\nUtilizing the API\'s SpeechRecognition feature, the game listens and processes players\' spoken input in real time. As players vocalize their guesses, the API compares their pronunciation with the stored answer, offering immediate feedback—such as visual cues or sounds—to indicate if they\’ve guessed correctly. If the attempt doesn\’t match, players are prompted to keep trying, with clues or hints available at different levels of difficulty, fostering a supportive yet challenging environment.\nThis game promotes active listening and speaking practice, with increasing complexity as players advance. A timer or scoring system adds an element of urgency, while a replay feature enables players to perfect their pronunciation. By incorporating the Web Speech API, the game delivers a fun, interactive experience that tests language skills and phonetic intuition in a playful and educational way.'
  ),
  -- little lemon
  (
    '2023-02-01',
    'Little Lemon Restaurant Page',
    'The "Little Lemon Restaurant" React app is a capstone project created as part of the Meta Front-End Web Developer course on Coursera, designed to showcase essential skills in building and managing interactive, user-friendly web applications. This app simulates a restaurant\'s online presence, featuring responsive menus, reservation forms, and dynamic content updates. Built with a modern front-end stack, the app leverages React components to handle user interactions seamlessly, providing a streamlined user experience across different devices.\nThrough this project, critical front-end skills such as component-based design, state management, and API integration come together to create a functional and visually engaging application. Users can explore menu items, make reservations, and learn more about the restaurant—all within a single-page app format that exemplifies best practices in responsive and accessible design. The "Little Lemon Restaurant" app demonstrates core competencies in front-end development, delivering a fully featured restaurant website that’s interactive, polished, and ready to enhance a business\'s online footprint.'
  ),
  -- amitha hair and makeup
  (
    '2024-06-01',
    'Amitha Hair And Makeup Portfolio Site',
    'The Amitha Hair and Makeup Portfolio Site is a dedicated online portfolio for a professional makeup artist, designed to showcase their expertise through visually stunning photoshoots and to attract potential clients. The portfolio\’s front end features a sleek, user-friendly interface where visitors can browse curated galleries, view individual photoshoot highlights, and gain insight into the artist\'s unique style and skills. Built with a responsive design, the site ensures optimal viewing across devices, allowing potential clients to explore the portfolio with ease whether they are on mobile or desktop.\nA robust admin interface enables the site owner to efficiently manage and update the content on their own. Through this interface, the makeup artist can publish new photoshoots, organize images, and edit descriptions or portfolio details without needing technical assistance. This setup grants the artist control over their portfolio, empowering them to keep their content fresh and relevant as they complete new projects. The admin tools are intuitive and streamlined, making it easy to publish work in real-time and showcase their latest creations to clients and followers.\nTo handle image storage and retrieval seamlessly, the project integrates Amazon Web Services (AWS) for efficient and secure image management. AWS allows for high-resolution image uploads and safe storage, ensuring quick load times and reliability even as the portfolio grows in size. This setup not only enhances the user experience by providing fast access to images but also supports scalability, enabling the makeup artist to continue expanding their portfolio over time. The combination of an attractive portfolio site and powerful admin tools makes the **Amitha Hair and Makeup Portfolio Site** a professional, easy-to-maintain platform that effectively showcases the artist\’s talent.'
  ),
  (
    '2022-09-08',
    'Cliboard Landing Page',
    'A sleek and modern web application designed to showcase the core features and functionality of a clipboard management tool. The landing page aims to capture user interest with a clean, minimalistic design that highlights the ease of use and practical benefits of the product. It provides users with an overview of how the clipboard tool enhances productivity by allowing them to store, manage, and access multiple items they copy, such as text, links, and images, in one easily accessible location. The page includes a visually appealing layout that is both mobile-responsive and optimized for performance, ensuring a seamless experience across devices.\nThe landing page is divided into distinct sections that guide users through the key features of the product. The hero section features a call-to-action that encourages visitors to sign up or download the app, supported by eye-catching visuals and brief descriptions of the tool’s core benefits. Further down, users will find detailed information about how the clipboard management tool simplifies everyday tasks, such as quickly recalling previously copied items, creating favorites for frequently used snippets, and syncing clipboard data across multiple devices. A comparison section demonstrates how the tool improves upon native clipboard functionality, offering a more robust and organized approach to copying and pasting.\nTo add credibility and build trust with potential users, the Clipboard Landing Page includes testimonials from satisfied users and a section dedicated to frequently asked questions. The page ends with a strong closing message and a final call-to-action, prompting users to sign up for early access or download the app. Social proof, combined with informative content, ensures that users leave the page with a clear understanding of how the product can improve their workflow, driving them to take the next step towards adoption.'
  ),
  (
    '2022-03-01',
    'Loop Studios Website',
    'A modern, fully responsive website designed to showcase the cutting-edge VR experiences offered by Loop Studios. The site emphasizes sleek visuals, interactive elements, and a user-friendly interface that immerses visitors in the brand\'s innovative world. Built with the latest web technologies, including HTML5, CSS3, and JavaScript, the website features smooth transitions, dynamic content loading, and responsive design to ensure a seamless experience across all devices. The design incorporates bold imagery, clean typography, and strategic use of white space to highlight Loop Studios\’ portfolio of virtual reality projects, enhancing the overall user experience.\nThe site also includes a custom content management system (CMS) that allows the Loop Studios team to easily update and manage content without technical expertise. Integrating social media feeds, user testimonials, and a video showcase of past projects helps to engage potential clients and collaborators. Additionally, the website leverages SEO best practices to increase visibility in search engines, driving traffic to the site. The result is a visually striking, interactive platform that not only reflects the innovative spirit of Loop Studios but also effectively promotes their services in the competitive tech landscape.'
  ),
  (
    '2021-11-01',
    'Shortly Website',
    'The Shortly Website is a sleek and efficient URL shortening service designed to simplify long, cumbersome links into short, shareable URLs. This project was built with user experience in mind, providing a clean interface and fast performance. With just a few clicks, users can input a long URL and receive a shortened version that is easy to copy and share across social media, emails, or messaging platforms. The website also features link tracking, allowing users to see how many times their shortened link has been clicked, making it ideal for marketing campaigns, social media posts, and more.\nThe Shortly Website is built using modern web technologies, including HTML5, CSS3, and JavaScript, with a backend powered by Node.js and Express. The design is fully responsive, ensuring the site looks and performs well on devices of all sizes. In addition, the project includes user authentication and a dashboard where users can manage and track their previously shortened URLs. This project demonstrates a strong understanding of front-end and back-end development, along with a focus on usability and scalability for future enhancements.'
  ),
  (
    '2012-08-01',
    'Flyo Website',
    'The Flyo Website is a dynamic online platform designed to revolutionize the way users plan and book their travel experiences. With a focus on user-friendly navigation and seamless booking processes, Flyo provides an all-in-one solution for travelers seeking personalized itineraries, accommodations, and activities. The website\'s visually appealing design incorporates high-quality images and engaging content that inspires users to explore new destinations and embark on their next adventure.\nOne of the standout features of the Flyo Website is its intelligent recommendation system, which utilizes advanced algorithms to suggest tailored travel options based on user preferences and previous searches. This ensures that each visitor receives a unique experience that caters to their interests, whether they are looking for a relaxing beach getaway or an adventurous hiking trip. Additionally, the website offers a comprehensive blog section filled with travel tips, destination highlights, and insider information, further enhancing user engagement and establishing Flyo as a trusted resource for travelers.\nTo ensure optimal performance, the Flyo Website is built on a robust tech stack that prioritizes speed and security. The responsive design guarantees a seamless experience across all devices, from desktops to smartphones, allowing users to plan their travels anytime, anywhere. By combining cutting-edge technology with a commitment to exceptional user experiences, the Flyo Website sets a new standard in the travel industry, empowering users to create unforgettable journeys.'
  ),
  (
    '2021-05-01',
    'Bookmark Website',
    'The Bookmark Website project is a sophisticated web application designed to revolutionize how users manage their favorite online resources, providing a seamless experience for organizing and accessing bookmarks efficiently. This platform boasts a user-friendly interface that allows individuals to create personalized collections of bookmarks, categorize links into custom folders, and enhance their organization with tags and descriptions, making it effortless to navigate through an extensive library of resources. The application features a robust user authentication system to ensure secure access, allowing users to maintain their own unique sets of bookmarks without fear of data loss or privacy concerns. An advanced search function empowers users to locate specific links quickly, even within large collections, significantly enhancing productivity and efficiency. Furthermore, the Bookmark Website includes collaborative features that facilitate easy sharing of bookmarks with friends and family, promoting a community-focused approach to discovering and exchanging valuable web content. Users can also benefit from periodic reminders to revisit their saved links, ensuring they never miss important updates or resources. By streamlining the bookmarking process, incorporating social sharing capabilities, and prioritizing user experience, this project aims to not only simplify online navigation but also foster a collaborative environment where users can connect over shared interests and discoveries, ultimately transforming the way individuals interact with the web.'
  ),
  (
    '2021-02-01',
    'Grid Layout',
    'The Grid Layout project showcases a responsive and flexible grid system designed to optimize the presentation of content across various screen sizes. By utilizing CSS Grid Layout, this project demonstrates how to create a visually appealing structure that adapts seamlessly to different devices, ensuring an optimal user experience. Each grid item can be dynamically resized and rearranged, allowing for a fluid layout that accommodates diverse content types, from images to text blocks. The project emphasizes the importance of modern web design techniques and accessibility, making it a valuable resource for developers seeking to enhance their front-end skills.\nIn addition to its aesthetic appeal, the Grid Layout project highlights best practices for performance optimization and cross-browser compatibility. The implementation includes various media queries to adjust grid configurations, providing users with a smooth experience regardless of their device. Comprehensive documentation accompanies the project, detailing the code structure and design choices, making it an excellent reference for both novice and experienced developers. By exploring this project, users will gain insights into the powerful capabilities of CSS Grid and its potential to revolutionize web layout design.'
  );

CREATE TABLE photos (
  photo_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  photo_url VARCHAR(255) NOT NULL,
  display_order INT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

INSERT INTO
  photos (project_id, photo_url, display_order)
VALUES
  -- mad gabs
  (
    1,
    'https://player.slideplayer.com/75/12551444/slides/slide_1.jpg',
    4
  ),
  (
    1,
    'https://player.slideplayer.com/75/12551444/slides/slide_2.jpg',
    3
  ),
  (
    1,
    'https://player.slideplayer.com/75/12551444/slides/slide_52.jpg',
    2
  ),
  (
    1,
    'https://player.slideplayer.com/75/12551444/slides/slide_62.jpg',
    1
  ),
  -- little lemon
  (
    2,
    'https://user-images.githubusercontent.com/114795700/224845658-e3100453-7739-4d5b-a641-ff39ceec3b6b.png',
    1
  ),
  (
    2,
    'https://user-images.githubusercontent.com/52236473/221524124-f2ba25d6-4dd9-442f-9405-70f6a55da839.png',
    2
  ),
  (
    2,
    'https://screenshots.codesandbox.io/q1ggx7/0.png',
    3
  ),
  (
    2,
    'https://screenshots.codesandbox.io/6xfdrt/0.png',
    4
  ),
  -- amitha hair and makeup
  (
    3,
    'https://amitha-hmua-images.s3.ca-central-1.amazonaws.com/bioimages/e0d7e126-eaab-4e1a-957a-fe9563ed71ec.jpeg',
    1
  ),
  (
    3,
    'https://amitha-hmua-images.s3.ca-central-1.amazonaws.com/shootimages/b8d635e7-45b6-4fb7-8273-a967d466fdad.jpeg',
    2
  ),
  (
    3,
    'https://amitha-hmua-images.s3.ca-central-1.amazonaws.com/shootimages/9b7e9375-fb94-49fc-8a25-033c0f1db95c.jpeg',
    3
  ),
  (
    3,
    'https://amitha-hmua-images.s3.ca-central-1.amazonaws.com/shootimages/e507a88e-a510-4a44-9796-135a7976e1fc.jpeg',
    4
  ),
  (
    4,
    'https://cdn.pixabay.com/photo/2018/05/18/15/30/web-design-3411373_1280.jpg',
    1
  ),
  (
    5,
    'https://cdn.pixabay.com/photo/2016/08/27/12/06/website-1624028_1280.png',
    1
  ),
  (
    6,
    'https://cdn.pixabay.com/photo/2022/10/04/04/41/online-7497335_1280.jpg',
    1
  ),
  (
    7,
    'https://cdn.pixabay.com/photo/2013/01/29/09/09/facebook-76532_1280.png',
    1
  ),
  (
    8,
    'https://cdn.pixabay.com/photo/2024/05/21/17/52/icon-8778714_1280.png',
    1
  ),
  (
    9,
    'https://cdn.pixabay.com/photo/2020/05/25/05/48/shopping-5217035_1280.png',
    1
  );

CREATE TABLE url_types (
  type_id INT AUTO_INCREMENT PRIMARY KEY,
  url_type VARCHAR(50) NOT NULL
);

INSERT INTO
  url_types (url_type)
VALUES
  ('Deployed Url'),
  ('Youtube Video'),
  ('Github (Client)'),
  ('Github (Server)');

CREATE TABLE project_urls (
  url_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  url_type INT NOT NULL,
  url VARCHAR(2048) NOT NULL,
  FOREIGN KEY (url_type) REFERENCES url_types(type_id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

insert into
  project_urls (project_id, url_type, url)
VALUES
  (
    1,
    1,
    'https://madgabsgame.netlify.app/'
  ),
  (
    1,
    3,
    'https://github.com/ericdelmermillen/mad_gabs_game_client'
  ),
  (
    1,
    4,
    'https://github.com/ericdelmermillen/mad_gabs_game_server'
  ),
  (
    2,
    1,
    'https://meta-front-end-developer-capstone-little-lemon-booking-app.vercel.app/'
  ),
  (
    2,
    3,
    'https://github.com/ericdelmermillen/meta-front-end-developer-capstone-little-lemon-booking-app'
  ),
  (
    3,
    1,
    'https://amithamakeupartist.com/'
  ),
  (
    3,
    2,
    'https://www.youtube.com/watch?v=yEXZjKMwt7Y&t=5s'
  ),
  (
    3,
    3,
    'https://github.com/ericdelmermillen/amitha-hmua-portfolio-site-client'
  ),
  (
    3,
    4,
    'https://github.com/ericdelmermillen/amitha-hmua-portfolio-site-server'
  );
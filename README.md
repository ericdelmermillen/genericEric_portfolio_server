# The GenericEric Portfolio Server

**The GenericEric Portfolio Server** is the backend for Eric Millen's full-stack portfolio application. Built with Node.js, Express, and a MySQL database, it powers API endpoints for content management, user authentication, email functionality, and integration with AWS S3 for file uploads. This server is designed with security and scalability in mind.

---

## Features

- **Content Management**: API endpoints for creating, reading, updating, and deleting portfolio project summaries.
- **User Authentication**: Secure login with hashed passwords and JWT-based authentication.
- **Image Uploads**: Generates pre-signed URLs to securely upload images to an S3 bucket.
- **Email Functionality**: Sends emails using Nodemailer for contact form submissions.
- **Security**: Implements middlewares `helmet` and `cors` to enhance server security.
- **Validation**: Request validation with `express-validator`.

---

## Tech Stack

- **Framework**: [Express](https://expressjs.com/) for creating the backend API.
- **Database**: [MySQL](https://www.mysql.com/) with `mysql2` for database operations.
- **Authentication**:
  - [bcrypt](https://github.com/kelektiv/node.bcrypt.js) for hashing passwords.
  - [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) for token-based authentication.
- **AWS Integration**:
  - [@aws-sdk/client-s3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_client_s3.html) and [@aws-sdk/s3-request-presigner](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_s3_request_presigner.html) for S3 file handling.
- **Email**: [Nodemailer](https://nodemailer.com/) for sending emails.

---

## Installation

### Prerequisites

- Node.js (v16+)
- MySQL database
- AWS credentials for S3 bucket access

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/ericdelmermillen/genericEric_portfolio_server
   cd genericEric_portfolio_server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with the following variables:

   ```env
   PORT=8000
   CLIENT_HOST=http://localhost:5173
   JWT_SECRET=yourJWTSecret!
   JWT_REFRESH_SECRET=yourJWTRefreshSecret
   JWT_TOKEN_EXPIRATION_INTERVAL=15m
   JWT_REFRESH_TOKEN_EXPIRATION_INTERVAL=1d

   # MySQL connection
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_DATABASE=your_db_name

   # Nodemailer
   EMAIL=youraddress@mail.com
   PASSWORD=yourrandompasswordfromgoogleapi

   # AWS configuration
   AWS_REGION=yourawsaccountregion
   AWS_BUCKET_NAME=your_aws_bucket_name
   AWS_DIRNAME=project-images
   AWS_BUCKET_PATH=https://yourbucketpath.amazonaws.com/project-images
   AWS_ACCESS_KEY=YOURACCESSKEY
   AWS_SECRET_ACCESS_KEY=YOURSECRETACCESSKEY
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. For production, use:
   ```bash
   npm start
   ```

---

## Scripts

- `start`: Runs the server in production mode.
- `dev`: Starts the server in development mode with file-watching enabled.

---

## API Overview

### Projects

- **GET /api/projects/portfoliosummary**: Retrieve main image for each project for first page worth of projects for portfolio section of home page.
- **GET /api/projects/all**: Retrieve all projects for admin drag and drop project reordering (admin only).
- **POST /api/projects/project/add**: Add a new project (admin-only).
- **PUT /api/projects/edit/:id**: Update an existing project (admin-only).
- **DELETE /api/projects/delete/:id**: Delete a project (admin-only).
- **PACTH /api/projects/updateorder**: Update the order of projects (admin-only).

### Image Uploads

- **GET /api/auth/getsignedurl**: Generates a pre-signed URL for S3 uploads.

### Authentication

- **POST /api/auth/createuser**: Register a new user (not available via client: request must be made via postman, etc as it is not intended for the viewing public to be able to make accounts).
- **POST /api/auth/loginuser**: Logs in a user and returns a JWT token and refreshToken (admin only).
- **POST /api/auth/refreshtoken**: Returns new token and refreshToken if client token is expired but refreshToken is still valid allowing for user to stay logged in indefinetely as long as they are sending at least one request per day (admin only).
- **POST /api/auth/logoutuser**: Logout the user (admin-only).

---

## Endpoint Documentation

For a detailed guide on all API endpoints, refer to the [API Documentation](https://flannel-modem-15e.notion.site/genericEric-dev-API-60177c54c02f457eade385bdef1a84e0) hosted on Notion.

---

## Dependencies Overview

### Core

- **Express**: Server framework for creating RESTful APIs.
- **MySQL2**: Database client for MySQL.

### Security

- **Helmet**: Adds HTTP headers for enhanced security.
- **Cors**: Enables cross-origin requests.
- **bcrypt**: Secures user passwords through hashing.

### File Uploads

- **@aws-sdk/client-s3**: AWS SDK for managing S3 buckets and objects.
- **@aws-sdk/s3-request-presigner**: Generates pre-signed URLs for secure uploads.

### Utilities

- **dotenv**: Manages environment variables.
- **express-validator**: Validates and sanitizes incoming request data.
- **uuid**: Generates unique IDs.

### Email

- **Nodemailer**: Sends emails for contact form submissions.

---

## License

MIT License. See the [LICENSE](./LICENSE) file for details.

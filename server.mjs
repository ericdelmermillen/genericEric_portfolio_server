import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

// need to research each config option and set up later
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", "'unsafe-inline'", "https://example.com"], // Allow scripts from self and example.com
//       styleSrc: ["'self'", "'unsafe-inline'", "https://example.com"], // Allow styles from self and example.com
//       imgSrc: ["'self'", "data:", "https://example.com"], // Allow images from self, data URIs, and example.com
//       connectSrc: ["'self'", "https://api.example.com"], // Allow connections to self and api.example.com
//       fontSrc: ["'self'", "https://example.com"], // Allow fonts from self and example.com
//       objectSrc: ["'none'"], // Disallow plugins like Flash
//       frameAncestors: ["'none'"], // Disallow embedding the site in iframes
//       formAction: ["'self'"], // Allow form actions only from self
//       upgradeInsecureRequests: [], // Automatically upgrade HTTP requests to HTTPS
//     },
//   },
//   referrerPolicy: { policy: 'no-referrer-when-downgrade' },
//   frameguard: { action: 'sameorigin' }, // Only allow framing on the same origin
//   hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, // Enforce HTTPS for one year
//   hidePoweredBy: true, // Hide X-Powered-By header
//   noSniff: true, // Prevent MIME type sniffing
//   xssFilter: true, // Enable XSS filter in browsers
// }));

const app = express();
const TESTING = process.env.TESTING || false;

const corsOptions = TESTING 
  ? { }
  : { origin: process.env.CLIENT_HOST };
  
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());


// routes
import authRouter from './routes/authRoute.mjs';

// import blogRouter from './routes/blogRouter.mjs';

import contactRouter from './routes/contactRoute.mjs';

import projectsRouter from './routes/projectsRoute.mjs';


// Routers
// ***may not need blogRoute or controller if blog is directly from youtube

// authRouter for createUser, login, logout, AWS signed url
app.use('/api/auth', authRouter);
// contactRouter for handling contact form and forwarding via nodeMailer

// app.use('/api/blog', blog)

app.use('/api/contact', contactRouter);
app.use('/api/projects', projectsRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
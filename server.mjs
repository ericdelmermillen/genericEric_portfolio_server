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
// const TESTING = process.env.TESTING || false;
// const corsOptions = TESTING ?  { }:  { origin: process.env.CLIENT_HOST};
const corsOptions = { origin: process.env.CLIENT_HOST };

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());



// cors config object for cross origin 

app.use(cors(corsOptions));

// routes
import authRouter from './routes/auth.mjs';


// Routers

// authRouter for createUser, login, logout, AWS signed url
app.use('/api/auth', authRouter);



const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
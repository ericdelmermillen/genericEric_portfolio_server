import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

const app = express();

const AWS_BUCKET_BASE_PATH = process.env.AWS_BUCKET_BASE_PATH; 
const CLIENT_HOST = process.env.CLIENT_HOST
const environment = process.env.NODE_ENV || "development";
const isProduction = environment === "production";

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", AWS_BUCKET_BASE_PATH],
        imgSrc: ["'self'", "data:", AWS_BUCKET_BASE_PATH],
        connectSrc: ["'self'", AWS_BUCKET_BASE_PATH],
        fontSrc: ["'self'", "data:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
        ...(isProduction && { upgradeInsecureRequests: [] }),
      },
    },
    crossOriginEmbedderPolicy: { policy: "require-corp" },
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-site" }, 
    referrerPolicy: { policy: "same-origin" },
    frameguard: { action: 'deny' },  
    hidePoweredBy: true,
    xssFilter: true,
    permittedCrossDomainPolicies: { permittedPolicies: "none" },
    dnsPrefetchControl: { allow: false }
  })
);


// *** AWS Elastic Load Balancer (ELB), ensure The ELB is configured to forward the X-Forwarded-For header && Your EC2 instance’s security group allows traffic from the ELB.
// configure ELB to forward the x-forwarded-for header so the ELB's ID paddress isn't used instead of the client's IP
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use the X-Forwarded-For header if behind a proxy
    return req.headers['x-forwarded-for'] || req.ip;
  },
});

app.use(limiter);

const corsOptions = { origin: CLIENT_HOST };
  
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());


// routes
import authRouter from './routes/authRoute.mjs';
import contactRouter from './routes/contactRoute.mjs';
import projectsRouter from './routes/projectsRoute.mjs';


// Routers
// authRouter for createUser, login, logout, AWS signed url
app.use('/api/auth', authRouter);

// contactRouter for handling contact form and forwarding via nodeMailer
app.use('/api/contact', contactRouter);

// projectsRouter for all project related requests
app.use('/api/projects', projectsRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀 in ${environment} environment`);
});
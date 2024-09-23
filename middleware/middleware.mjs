import { verifyToken } from '../utils/utils.mjs';
import { validationResult } from 'express-validator';


const validateToken = (req, res, next) => {
  const token = req.headers.authorization;

  if(!token || !verifyToken(token)) {
    console.log("rejected from middleware")
    return res.status(401).send({ message: "unauthorized" });
  }

  next();
};


const validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      const errorMsgs = errors.array().map(error => error.msg);
      console.log(errorMsgs)
      return res.status(400).json({ errors: errorMsgs });
    }
    next();
  };
};

export {
  validateToken,
  validateRequest
};
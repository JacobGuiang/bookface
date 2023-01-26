import config from './config';
import jwt from 'jsonwebtoken';
import { RequestHandler, ErrorRequestHandler } from 'express';
import { Token } from '../utils/types';

const userExtractor: RequestHandler = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next();
  }
  try {
    const decodedToken = jwt.verify(token, config.JWT_SECRET_KEY);
    req.user = { id: (decodedToken as Token).id };
  } catch (err) {
    console.log('token error', err);
    res.clearCookie('token');
  } finally {
    next();
  }
};

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  res.json({ error: `${err.name}: ${err.message}` });
  next(err);
};

export default { userExtractor, errorHandler };

import config from './config';
import jwt from 'jsonwebtoken';
import { RequestHandler, ErrorRequestHandler } from 'express';
import type { Token } from '../types/types';

const userExtractor: RequestHandler = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next();
  }
  try {
    const decodedToken = jwt.verify(token, config.JWT_SECRET_KEY);
    const { id, name } = decodedToken as Token;
    req.user = { id, name };
    next();
  } catch (err) {
    res.clearCookie('token');
    next(err);
  }
};

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  res.status(400).json({ error: err });
  next();
};

export default { userExtractor, errorHandler };

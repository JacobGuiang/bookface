import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  res.json({ error: `${err.name}: ${err.message}` });
  next(err);
};

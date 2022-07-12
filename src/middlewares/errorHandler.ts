import { Request, Response, NextFunction } from 'express';
import 'express-async-error';

export default function errorHandler(
  error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error.type === 'error_not_found') {
    return res.status(404).send(error.message);
  } else if (error.type === 'error_conflict') {
    return res.status(409).send(error.message);
  } else if (error.type === 'unprocessable_entity') {
    return res.status(422).send(error.message);
  } else if (error.type === 'error_bad_request') {
    return res.status(400).send(error.message);
  } else if (error.type === 'error_forbidden') {
    return res.status(403).send(error.message);
  }

  return res.status(500).send(error);
}

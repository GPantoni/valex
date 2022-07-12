import { Request, Response, NextFunction } from 'express';
import * as cardService from '../services/cardService.js';

export async function createCard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers['x-api-key']?.toString();
  if (!apiKey) {
    return res.sendStatus(401);
  }

  const { employeeId, type } = res.locals.verified;

  await cardService.createCard(apiKey, employeeId, type);

  res.sendStatus(201);
}
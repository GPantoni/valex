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

export async function activateCard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const cardInfo = res.locals.verified;
  cardInfo.id = id;

  await cardService.activateCard(cardInfo);

  res.sendStatus(200);
}

export async function blockCard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const cardInfo = res.locals.verified;
  cardInfo.id = id;

  await cardService.blockCard(cardInfo);

  res.sendStatus(200);
}

export async function unblockCard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const cardInfo = res.locals.verified;
  cardInfo.id = id;

  await cardService.unblockCard(cardInfo);

  res.sendStatus(200);
}

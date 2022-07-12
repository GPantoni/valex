import { NextFunction, Request, Response } from 'express';
import * as paymentService from '../services/paymentService.js';

export async function transaction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { posId } = req.params;
  const { cardId, password, amount } = res.locals.verified;

  await paymentService.transaction(cardId, password, amount, parseInt(posId));

  res.sendStatus(200);
}

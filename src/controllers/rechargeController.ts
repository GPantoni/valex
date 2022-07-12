import { Request, Response, NextFunction } from 'express';
import * as errorUtils from '../utils/errorUtils.js';
import * as rechargeService from '../services/rechargeService.js';

export async function rechargeCard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const { amount } = res.locals.verified;
  if (amount <= 0) {
    throw errorUtils.errorForbidden('The amount must be bigger than zero');
  }

  await rechargeService.rechargeCard(parseInt(id), amount);

  res.sendStatus(200);
}

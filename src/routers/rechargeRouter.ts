import { Router } from 'express';
import { validateSchema } from '../middlewares/validateSchema.js';
import rechargeSchema from '../schemas/rechargeSchema.js';
import * as rechargeController from '../controllers/rechargeController.js';

const rechargeRouter = Router();

rechargeRouter.post(
  '/recharge/:id',
  validateSchema(rechargeSchema),
  rechargeController.rechargeCard
);

export default rechargeRouter;

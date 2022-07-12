import { Router } from 'express';
import { validateSchema } from '../middlewares/validateSchema.js';
import paymentSchema from '../schemas/paymentSchema.js';
import * as paymentController from '../controllers/paymentController.js';

const paymentRouter = Router();

paymentRouter.post(
  '/payment/:posId',
  validateSchema(paymentSchema),
  paymentController.transaction
);

export default paymentRouter;

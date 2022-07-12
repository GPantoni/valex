import { Router } from 'express';
import { validateSchema } from '../middlewares/validateSchema.js';
import { createCardSchema } from '../schemas/cardSchemas.js';
import * as cardController from '../controllers/cardController.js';

const cardRouter = Router();

cardRouter.post(
  '/cards',
  validateSchema(createCardSchema),
  cardController.createCard
);

export default cardRouter;

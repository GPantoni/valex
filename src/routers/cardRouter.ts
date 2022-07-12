import { Router } from 'express';
import { validateSchema } from '../middlewares/validateSchema.js';
import {
  activateCardSchema,
  createCardSchema,
} from '../schemas/cardSchemas.js';
import * as cardController from '../controllers/cardController.js';

const cardRouter = Router();

cardRouter.post(
  '/cards',
  validateSchema(createCardSchema),
  cardController.createCard
);

cardRouter.post(
  '/cards/:id/activate',
  validateSchema(activateCardSchema),
  cardController.activateCard
);

export default cardRouter;

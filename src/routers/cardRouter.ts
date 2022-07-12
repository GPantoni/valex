import { Router } from 'express';
import { validateSchema } from '../middlewares/validateSchema.js';
import {
  activateCardSchema,
  blockCardSchema,
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

cardRouter.post(
  '/cards/:id/block',
  validateSchema(blockCardSchema),
  cardController.blockCard
);

export default cardRouter;

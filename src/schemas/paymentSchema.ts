import Joi from 'joi';

const paymentSchema = Joi.object({
  cardId: Joi.number().required(),
  password: Joi.string().required(),
  amount: Joi.number().required(),
});

export default paymentSchema;

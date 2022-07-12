import Joi from 'joi';

const rechargeSchema = Joi.object({
  amount: Joi.number().required(),
});

export default rechargeSchema;

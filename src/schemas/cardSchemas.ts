import Joi from 'joi';

export const createCardSchema = Joi.object({
  employeeId: Joi.number().required(),
  type: Joi.alternatives(
    'groceries',
    'restaurant',
    'transport',
    'education',
    'health'
  ),
});

export const activateCardSchema = Joi.object({
  password: Joi.string().required(),
  securityCode: Joi.string().required(),
});

export const blockCardSchema = Joi.object({
  password: Joi.string().required(),
});

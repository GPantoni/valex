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
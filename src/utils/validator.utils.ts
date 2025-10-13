// src/utils/validator.utils.ts
import Joi from 'joi';

export const validate = <T>(schema: Joi.ObjectSchema, data: any): T => {
  const { error, value } = schema.validate(data);
  if (error) throw new Error(error.details[0].message);
  return value;
};
// src/utils/validator.utils.ts
import { Response } from 'express';
import Joi from 'joi';
import responser from './responser.utils';
import serviceResult from './serviceResponser.utils';

export const validate = (schema: Joi.ObjectSchema, data: any, res: Response) => {
  const { error, value } = schema.validate(data);


  if (error) {
    responser(res, 400, {
      success: false,
      message: error.message
    })

    return serviceResult({
      ok: false
    })

  }
  else {
    return serviceResult({
      ok: true,
      data: value
    })
  }
};
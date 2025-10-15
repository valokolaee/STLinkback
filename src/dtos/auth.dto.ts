// src/dtos/auth.dto.ts
import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  clientType: Joi.string()
    .valid('individual', 'financial_entities', 'business')
    .required(),
});


export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});


export const createDeviceSchema = Joi.object({
  deviceName: Joi.string().min(1).max(255).required(),
  imei: Joi.string().min(1).max(15).required(),
  deviceModel: Joi.string().min(1).max(100).required(),
});


// amount: 100, currency: 'ttr', deviceId: 1, isSettled: true
export const createDeviceEarningSchema = Joi.object({
  amount: Joi.number().required(),
  currency: Joi.string().min(1).max(15).required(),
  deviceId: Joi.number().required(),
  isSettled: Joi.boolean().required(),
});
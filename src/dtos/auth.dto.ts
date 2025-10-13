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

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  clientType: 'individual' | 'financial_entities' | 'business';
};

export type LoginRequest = {
  email: string;
  password: string;
};
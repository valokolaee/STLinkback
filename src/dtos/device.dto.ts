// src/dtos/device.dto.ts

import Joi from 'joi';

export const deviceEarningReportSchema = Joi.object({
  amount: Joi.number().positive().required(),
  imei: Joi.string().length(30).pattern(/^[0-9a-fA-F]+$/).required(),
  currency: Joi.string().min(2).max(10).required(),
  ipAddress: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).optional(),
  timestamp: Joi.date().iso().optional().default(() => new Date()),
  cpuUsage: Joi.number().min(0).max(100).required(),
  memoryUsage: Joi.number().min(0).max(100).required(),
  gpuUsage: Joi.number().min(0).max(100).optional().allow(null),
  processingSpeed: Joi.number().min(0).required(),
  fanSpeedRpm: Joi.number().integer().min(0).required(),
  temperature: Joi.number().min(0).max(120).required(),
  powerConsumption: Joi.number().min(0).required(),
  hashRate: Joi.number().min(0).required(),
  networkLatency: Joi.number().min(0).optional().allow(null),
  steCheck: Joi.number().integer().min(0).max(65535).optional().default(0),
});
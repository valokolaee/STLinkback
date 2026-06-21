import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  // clientType: Joi.string().valid('individual', 'financial_entities', 'business').required(),
});


export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});


export const createDeviceSchema = Joi.object({
  userId: Joi.number(),
  deviceName: Joi.string().min(1).max(255).required(),
  imei: Joi.string().required(),
  deviceModel: Joi.string().min(1).max(100).required(),
  serialNumber: Joi.string()

});


export const createDeviceEarningSchema = Joi.object({
  amount: Joi.number().required(),
  walletId: Joi.number().required(),
  currency: Joi.string().min(1).max(15).required(),
  deviceId: Joi.number().required(),
  miningSessionId: Joi.number().required(),
  userId: Joi.number().required(),
  isSettled: Joi.boolean().required(),
});


export const createMiningWalletSchema = Joi.object({
  userId: Joi.number().required(),
  walletAddress: Joi.string().required(),
  currency: Joi.string()
});


export const createUserWalletSchema = Joi.object({
  userId: Joi.number().required(),
  walletAddress: Joi.string().required(),
  nickname: Joi.string().required(),
  currency: Joi.string()
});

export const createWithdrawalRequestSchema = Joi.object({
  userId: Joi.number().required(),
  amount: Joi.number().required(),
  currency: Joi.string().required(),
  miningWalletAddress: Joi.string().required(),
  userWalletAddress: Joi.string().required(),
});

export const createMiningSessionSchema = Joi.object({
  userId: Joi.number().required(),
  deviceId: Joi.number().required(),

});

export const deviceEarningReportSchema = Joi.object({
  imei: Joi.string().length(30).pattern(/^\d+$/).required(),
  amount: Joi.number().positive().required(),
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
});

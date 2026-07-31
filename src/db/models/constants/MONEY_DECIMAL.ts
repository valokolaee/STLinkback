import { DECIMAL } from "sequelize";

export const MONEY_DECIMAL = {
  PRECISION: 36,
  SCALE: 18,
} as const;

export const MONEY_TYPE = DECIMAL(
  MONEY_DECIMAL.PRECISION,
  MONEY_DECIMAL.SCALE
);
import Decimal from "decimal.js";

export const decimalPlus = (a: string | number, b: string | number) => new Decimal(a || 0).plus(new Decimal(b || 0));
export const decimalMinus = (a: string | number, b: string | number) => new Decimal(a || 0).minus(new Decimal(b || 0));
export const decimalLessThan = (a: string | number, b: string | number) => new Decimal(a || 0).lessThan(new Decimal(b || 0));

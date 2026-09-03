import Decimal from "decimal.js";

export const decimalFromString = (a: string | number) => new Decimal(a)
export const decimalPlus = (a: string | number, b: string | number) => new Decimal(a).plus(new Decimal(b));
export const decimalMinus = (a: string | number, b: string | number) => new Decimal(a).minus(new Decimal(b));
export const decimalLessThan = (a: string | number, b: string | number) => new Decimal(a).lessThan(new Decimal(b));
export const decimalGreaterThan = (a: string | number, b: string | number) => new Decimal(a).greaterThan(new Decimal(b));

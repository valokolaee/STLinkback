export interface DbError {
  type:'UNIQUE'|'FOREIGN_KEY'|'VALIDATION'|'DATABASE'|'CONNECTION'|'TIMEOUT'|'UNKNOWN';
  httpStatus:number;
  code?:string;
  message:string;
  fields?:string[];
  constraint?:string;
  table?:string;
  mysqlCode?:string;
  errno?:number;
  sqlState?:string;
  sql?:string;
  stack?:string;
}

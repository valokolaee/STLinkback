import { DbError } from './types';

export function parseDbError(error:any):DbError{
  switch(error?.name){
    case 'SequelizeUniqueConstraintError':
      return {
        type:'UNIQUE',
        httpStatus:409,
        message:error.message,
        fields:error.errors?.map((e:any)=>e.path),
        constraint:error.parent?.constraint,
        mysqlCode:error.parent?.code,
        errno:error.parent?.errno,
        sqlState:error.parent?.sqlState,
        sql:error.sql,
        stack:error.stack
      };
    case 'SequelizeForeignKeyConstraintError':
      return {
        type:'FOREIGN_KEY',
        httpStatus:409,
        message:error.message,
        constraint:error.index,
        mysqlCode:error.parent?.code,
        errno:error.parent?.errno,
        sql:error.sql,
        stack:error.stack
      };
    case 'SequelizeValidationError':
      return {
        type:'VALIDATION',
        httpStatus:400,
        message:error.errors?.map((e:any)=>e.message).join(', ') ?? error.message,
        fields:error.errors?.map((e:any)=>e.path),
        stack:error.stack
      };
    case 'SequelizeConnectionError':
      return {type:'CONNECTION',httpStatus:503,message:error.message,stack:error.stack};
    case 'SequelizeTimeoutError':
      return {type:'TIMEOUT',httpStatus:504,message:error.message,stack:error.stack};
    case 'SequelizeDatabaseError':
      return {
        type:'DATABASE',
        httpStatus:500,
        message:error.message,
        mysqlCode:error.parent?.code,
        errno:error.parent?.errno,
        sqlState:error.parent?.sqlState,
        sql:error.sql,
        stack:error.stack
      };
    default:
      return {type:'UNKNOWN',httpStatus:500,message:error?.message||'Unknown error',stack:error?.stack};
  }
}

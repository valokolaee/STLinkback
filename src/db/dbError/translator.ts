import { DbError } from './types';
import { ConstraintRegistry } from './constraints';

export function buildResponse(e:DbError){
  const c=e.constraint?ConstraintRegistry[e.constraint]:undefined;
  return {
    httpStatus:e.httpStatus,
    response:{
      success:false,
      code:c?.code??e.type,
      message:c?.message??defaultMessage(e)
    }
  };
}
function defaultMessage(e:DbError){
 switch(e.type){
  case 'UNIQUE': return 'Duplicate data.';
  case 'FOREIGN_KEY': return 'Referenced data does not exist.';
  case 'VALIDATION': return e.message;
  case 'CONNECTION': return 'Database unavailable.';
  default: return 'Unexpected server error.';
 }
}

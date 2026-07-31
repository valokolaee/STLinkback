import { DbError } from './types';
export function logDbError(e:DbError){
console.error(`\n=== DATABASE ERROR ===
Type: ${e.type}
Message: ${e.message}
Constraint: ${e.constraint??'-'}
Fields: ${(e.fields||[]).join(', ')||'-'}
MySQL: ${e.mysqlCode??'-'} (${e.errno??'-'})
SQLState: ${e.sqlState??'-'}
SQL:
${e.sql??'-'}
======================`);
}

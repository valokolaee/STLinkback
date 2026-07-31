import { parseDbError } from './parser';
import { logDbError } from './logger';
import { buildResponse } from './translator';

export function handleDbError(error: any) {
    const parsed = parseDbError(error);
    logDbError(parsed);
    return buildResponse(parsed);
}

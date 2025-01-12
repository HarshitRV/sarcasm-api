import { dbConnection } from '../db/db.js';
import { AsyncHandler, RequestHandler } from '../../utils/utils.types.js';
import { postResponseListener } from './post-response-listener.js';
import { wrapAsyncHandler } from '../../utils/AppError.js';

/**
 * Combines middleware functions to  handle database connection,
 * response post-processing, and additional custom middleware. Wraps each with
 * error handling to ensure all asynchronous operations are managed properly.
 *
 * @param middleware An array of asynchronous middleware functions to apply.
 * @returns  An array of request handlers with attached middleware functions.
 */
export function attachDatabase(
    ...middleware: AsyncHandler[]
): RequestHandler[] {
    return wrapAsyncHandler(dbConnection, postResponseListener, ...middleware);
}

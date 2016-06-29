const LOG_PREFIX = '[udi]';

/**
 * Throw an error with given message.
 *
 * @export
 * @param {string} msg
 */
export function err ( msg:string ) {
    throw Error(`${LOG_PREFIX} ${msg}`);
}
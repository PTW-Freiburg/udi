import { err } from '../utils/log.utils';

/**
 * Table of numerical values assignments for computing the HIBC LIC
 * data format Check Character.
 * See Apependix B in ANSI/HIBC 2.5 2015.
 */
export const MOD43_TABLE = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '-', '.', ' ', '$', '/', '+', '%'
];


/**
 * Get the corresponding modulo 43 representation (`number`)
 * for an alphanumeric value.
 *
 * @export
 * @param {string} val
 * @returns number
 */
export function toMod43 ( val:string ) {
    const num = MOD43_TABLE.indexOf(val.toUpperCase());
    if ( num === -1 ) {
        err(`Given value "${val}" does not have a corresponding %43 value.`);
    }
    return num;
}

/**
 * Get the corresponding modulo 43 representation (`string`) from
 * the module table.
 *
 * @export
 * @param {number} num
 * @returns string
 */
export function fromMod43 ( num:number ) {
    if ( !(num >= 0 && num <= 42) ) {
        err(`Expected number to be equal/between 0 and 42, got ${num}.`);
    }
    return MOD43_TABLE[num];
}

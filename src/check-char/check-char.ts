import { fromMod43, toMod43 } from './mod43';

/** Re-export */
export { fromMod43, toMod43 };

/**
 * Generate Mod43 Check Character.
 *
 * @export
 * @param {string} str
 * @returns string
 */
export function generateCheckChar ( str:string ) {
    let c = 0;
    for (let i = str.length - 1; i >= 0; i--) {
        c += toMod43(str[i]);
    }
    return fromMod43(c % 43);
}

import { isValue } from './validate.utils';


export const HIBCC_LITERAL = '+';
export const HIBCC_QTY_FLAG = '$$';
export const HIBBC_BARCODE_DELIMITER = '*';
export const HIBCC_DATA_DELIMITER = '/';
export const HIBCC_SERIAL_DELIMITER = `${HIBCC_DATA_DELIMITER}S`;

export const HIBCC_MANUFATURE_DATE_PREFIX = '16D';
export const HIBCC_LONG_EXP_DATE_PREFIX = '14D';

/**
 * The field descriptor "B" (see ANSI/HIBC 2.5 - 2015, 2.2.1)
 * can be either the lot/batch or a serial number. Depending
 * which one is specified the "HIBCC Qty Flag" is prepended
 * with a "+".
 */
export enum FieldFlag {
    LOT,
    SN
}

/**
 * Format Lot/SN fields according to the HIBCC specification.
 *
 * @export
 * @param {(string|number)} lot
 * @param {(string|number)} sn
 * @returns
 */
export function formatField (lot:string|number, sn:string|number) {
    if ( isValue(lot) && isValue(sn) ) {
        return `${lot}${HIBCC_SERIAL_DELIMITER}${sn}`;
    }
    return (lot && lot.toString() || '') + (sn && sn.toString() || '');
}


/**
 * Quantify can be specified with 2 or 5 digits.
 * Enum value corresponds to the "Qty Format Char" fom Appendix E1.1.
 */
export enum QuantityFormat {
    QQ = 8,
    QQQQQ = 9
}

/**
 * Get the "HIBBCC Qty Flag". If the flag inidcates the usage of
 * a serial number the `HIBCC_LITERAL` is appended.
 *
 * @export
 * @param {FieldFlag} flag
 * @returns
 */
export function getQtyFlag ( flag:FieldFlag ) {
    return `${HIBCC_QTY_FLAG}${flag === FieldFlag.LOT ? '' : HIBCC_LITERAL}`;
}

/**
 * Returns a formated string that represents the quantity as
 * specified by the HIBCC. Meaning, the quantity will get
 * prepended with the `QuantityFormat` (integer).
 *
 * @export
 * @param {string} value
 * @param {QuantityFormat} format
 * @returns
 */
export function formatQty ( value:string, format:QuantityFormat ) {
    return format + value;
}

/**
 * Expiration date formats.
 * Enum value corresponds to the "Qty Format Char" from Appendix E1.1.
 *
 * Note that the "1" value is missing. Because we use an Enum to express
 * the desired date format, we do not need is. The format helper function
 * will correctly prepend if "MMYY" format is chosen.
 */
export enum DateFormat {
    MMYY = 0,       // First digit of month in MMYY (month/year) Date format
    MMDDYY = 2,     // (month/day/year) Date follows
    YYMMDD = 3,     // (year/month/day) Date follows
    YYMMDDHH = 4,   // (year/month/day/hour G.M.T.) Date follows
    YYJJJ = 5,      // (year/Julian day) Date follows
    YYJJJHH = 6,    // (year/Julian day/hour G.M.T.) Date follows
    NULL = 7,       // Date Field is null, Lot Field follows
    YYYYMMDD        // (full year/month/day) prepended with special encoding
}

/**
 * Returns the correct quantity format string, depending on given
 * `date` and `format`. It will also handle the edge cases when the
 * expiration date is omitted ("7") or "MMYY" date format is chosen.
 * In the later the date will not be prefixed with an integer.
 *
 * Furthermore, it will prepend expiration with "14D" if "YYYYMMDD"
 * date format is used. See ANSI/HIBC 2.5 -2015; 2.3.2.3.
 *
 * @export
 * @param {string} date
 * @param {ExpDateFormat} format
 * @returns string
 */
export function formatExpDate ( date?:string, format?:DateFormat ) {
    if ( !isValue(date) ) { return DateFormat.NULL.toString(); }

    switch (format) {
        case DateFormat.MMYY:
            return date;
        case DateFormat.YYYYMMDD:
            return `${HIBCC_DATA_DELIMITER}${HIBCC_LONG_EXP_DATE_PREFIX}${date}`;
        default:
            return `${format}${date}`;
    }
}

/**
 * Returns a prefixed manufacture date as specified in ANSI/HIBC 2.5 - 2005;
 * Chapter 2.3.2.2.
 *
 * @export
 * @param {string} date
 * @returns
 */
export function formatManufactureDate ( date:string ) {
    if ( !isValue(date) ) { return ''; }
    return `${HIBCC_DATA_DELIMITER}${HIBCC_MANUFATURE_DATE_PREFIX}${date}`;
}

/**
 * Formats a HIBCC UDI to "human readable" form that should be placed
 * under a barcode (ANSI/HIBC 2.5 - 2015, Chapter 4.1).
 *
 * @export
 * @param {string} data
 * @returns string
 */
export function barcodify ( data:string ) {
    return `${HIBBC_BARCODE_DELIMITER}${data.replace(/\s/g, '_')}${HIBBC_BARCODE_DELIMITER}`;
}
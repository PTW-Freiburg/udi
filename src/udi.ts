import { generateCheckChar } from './check-char/check-char';

import { err } from './utils/log.utils';
import {
    hasLength,
    isAlphanumeric,
    isNumeric,
    isValue,
    isDate } from './utils/validate.utils';
import {
    HIBC_LITERAL,
    HIBC_DATA_DELIMITER,
    FieldFlag,
    QuantityFormat,
    DateFormat,
    barcodify,
    getQtyFlag,
    formatQty,
    formatField,
    formatExpDate,
    formatManufactureDate } from './utils/format.utils';


// Re-export for convenience
export {
    QuantityFormat,
    DateFormat,
    barcodify
};

/**
 * Shape to hold information that represent
 * a format/value-pair. Used to specify a date
 * or quantity and its format.
 *
 * @export
 * @interface FormatValueObject
 * @template Format
 * @template Value
 */
export interface FormatValueObject<Format, Value> {
    format: Format;
    value: Value;
}


/**
 * Configuration of the parameters required to create
 * the Pirmary Data Strcutore for an Unique Device Identification.
 *
 * @export
 * @interface PrimaryDataStructureConfig
 */
export interface PrimaryDataStructureConfig {
    /**
     * Labeler Idenfitication Code (LIC) an alphanumeric number,
     * with the first character always being alphabetic.
     *
     * @type {string}
     */
    lic: string;

    /**
     * Labelers Product or Catalog Number (PCN).
     * Alpanumeric data.
     *
     * @type {(string|number)}
     */
    pcn: string|number;

    /**
     * Unit of Measure ID, Numeric value only, 0 through 9, where 0 is for unit-of use
     * items.1 to 8 are used to indicate different packaging levels above the unit of use.
     *
     * The value 9 is used for variable quantity containers when manual key entry or scan of
     * a secondary will be used to collect specific quantity data.
     * The labeler should ensure consistency in this field within their packaging process.
     *
     * @type {number}
     */
    unitOfMeasure: number;

    /**
     * Do no append the check char.
     *
     * @type {boolean}
     */
    noCheckChar?: boolean;
}


/**
 * Configuration of the parameters required to create
 * the secondary Data Structure for an Unique Device Identification.
 *
 * **NOTE**: Currently only lot/batch/serialnummer is supported.
 * This means no date/quantity.
 *
 * @export
 * @interface SecondaryDataStructureConfig
 */
export interface SecondaryDataStructureConfig extends PrimaryDataStructureConfig {
    /**
     * Lot/batch field, alphanumeric
     *
     * @type {(string|number)}
     */
    lot?: string|number;

    /**
     * Serial number, alphanumeric
     *
     * @type {(string|number)}
     */
    sn?: string|number;

    /**
     * Quantity Field
     *
     * @type {FormatValueObject<QuantityFormat, number>}
     */
    quantity?: FormatValueObject<QuantityFormat, string>;

    /**
     * Expiry Date Field
     *
     * @type {FormatValueObject<ExpDateFormat, string>}
     */
    expDate?: FormatValueObject<DateFormat, string>;

    /**
     * Manufacturing Date Field, formated in "YYYYMMDD".
     *
     * @type {string}
     */
    manufactureDate?: string;
}


/**
 * Create primary data structure.
 *
 * Consists of:
 * (1) HIBC Supplier Labeling Flag Character ("+")
 * (2) Label Identification Code
 * (3) Labelers Product or Catalog Number
 * (4) Unit of Measure ID
 * (5) Check Character
 *
 * @export
 * @param {PrimaryDataStructureConfig} { lic, pcn, unitOfMeasure }
 * @returns string
 */
export function createPrimaryDataStructure ({ lic, pcn, unitOfMeasure, noCheckChar = false }:PrimaryDataStructureConfig) {
    validatePrimaryDataConfig({ lic, pcn, unitOfMeasure });
    let pds = `${HIBC_LITERAL}${lic}${pcn}${unitOfMeasure}`;
    return pds + (noCheckChar ? '' : generateCheckChar(pds));
}


/**
 * Create secondary data structure.
 *
 * Consists of:
 * (1) HIBC Supplier Labeling Flag Character ("+")
 * (2) Quantity/Date/Lot or Serial Number Reference Identifier
 * (3) Quantity Field, format indicator followed by two-digit
 *     or five-digit quantity, for use after the Reference Identifier.
 * (4) Expiry Date Field, for use after the Reference Identifier
 *     (includes the date field format indicator).
 * (5) Lot/Batch or Serial Number Field, Alphanumeric field.
 * (6) Link Character (Check Character from primary data field.)
 * (7) Modulo 43 Check Character (calculated from the above characters)
 *
 * @export
 * @param {SecondaryDataStructureConfig} secondaryConfig
 * @returns string
 */
export function createSecondaryDataStructure ({
    lic, pcn, unitOfMeasure,
    lot, sn, quantity, expDate, manufactureDate, noCheckChar = false }:SecondaryDataStructureConfig
) {
    // Check input conformity.
    validatePrimaryDataConfig({ lic, pcn, unitOfMeasure });
    if ( isValue(lot) && !(isAlphanumeric(lot) && hasLength(lot, 0, 18)) ) {
        err(`Expected "lot" to be an alphanumeric value with a length of 0-18, got ${lot}.`);
    }
    if ( isValue(sn) && !(isAlphanumeric(sn) && hasLength(sn, 0, 18)) ) {
        err(`Expected "sn" to be an alphanumeric value with a length of 0-18, got ${sn}.`);
    }
    if ( isValue(sn) && isValue(quantity) ) {
        err(`Specifying "sn" AND "quantity" is not allowed.`);
    }
    const field = formatField(lot, sn);
    const linkChar = createPrimaryDataStructure({ lic, pcn, unitOfMeasure }).slice(-1);

    // Validate + Parse quantity
    const qtyFlag = getQtyFlag(lot ? FieldFlag.LOT : FieldFlag.SN);
    const qty = isValue(quantity) ? validateAndFormatQty(quantity) : '';

    // Validate and format expiration date
    let exDate = validateAndFormatExpDate(expDate);
    // If "YYYYMMDD" is used, deploy the "supplemental data option"
    // (ANSI/HIB 2.5 - 2015, chapter 2.3).
    let supExDate = '';
    if ( isValue(expDate) && expDate.format === DateFormat.YYYYMMDD ) {
        supExDate = exDate;
        exDate = DateFormat.NULL.toString();
    }

    // Validate + format manufacture date
    if ( isValue(manufactureDate) && !isDate(manufactureDate, DateFormat.YYYYMMDD) ) {
        err(`Expected "expDate" to be a valid date of type "${manufactureDate}", got ${DateFormat[DateFormat.YYYYMMDD]}.`);
    }
    const manDate = formatManufactureDate(manufactureDate);

    let sds = `${HIBC_LITERAL}${qtyFlag}${qty}${exDate}${field}${manDate}${supExDate}${linkChar}`;
    return sds + (noCheckChar ? '' : generateCheckChar(sds));
}


/**
 * Create combined data structure.
 * The data structure consists of
 *  (1) Primary Data Strcuture
 *      -> w/o the check character
 *  (2) Secondary Data Structure
 *      -> w/o the check caracter
 *      -> w/o the link caracter
 *      -> "+" is replaced by a delimiter character ("/")
 *  (3) Check Character
 *      -> calculate over the whole string
 *
 * @export
 * @param {PrimaryDataStructureConfig} primaryConfig
 * @param {SecondaryDataStructureConfig} secondaryConfig
 * @returns string
 */
export function createCombinedDataStructure (config:SecondaryDataStructureConfig) {
    // Check char of seperate data strcutures is not required when concatenating.
    config.noCheckChar = true;

    // Create primary + secondary data structure.
    // Note: This will also check conformity.
    let primary = createPrimaryDataStructure(config);
    let secondary = createSecondaryDataStructure(config);

    // Replace "+" with seperator "/" and remove "Link Character".
    secondary = `${HIBC_DATA_DELIMITER}${secondary.slice(1, -1)}`;

    let cds = `${primary}${secondary}`;
    return cds + generateCheckChar(cds);
}


// Private (Helpers)
// ---------------

/**
 * Validate Primaray Data Configuration
 *
 * @param {PrimaryDataStructureConfig} {lic, pcn, unitOfMeasure}
 */
function validatePrimaryDataConfig ({lic, pcn, unitOfMeasure}:PrimaryDataStructureConfig) {
    if ( !(isAlphanumeric(lic) && hasLength(lic, 4) && /^[a-z]/i.test(lic)) ) {
        err(`Expected "lic" to be an alphanumeric value with a length of 4 and beginning with an alpha character, got ${lic}.`);
    }
    if ( !(isAlphanumeric(pcn) && hasLength(pcn, 1, 18)) ) {
        err(`Expected "pcn" to be an alphanumeric value with a length of 1-18, got ${pcn}.`);
    }
    if ( !(isValue(unitOfMeasure) && /^[0-9]$/.test(unitOfMeasure.toString())) ) {
        err(`Expected "unitOfMeasure" to be an integer between 0-9, got ${unitOfMeasure}.`);
    }
}

/**
 * Checks that the quantity is correctly formatted (number + length).
 * If so, return a formatted quantity according to the HIBC specification.
 *
 * @param {FormatValueObject<QuantityFormat, string>} {value, format}
 * @returns
 */
function validateAndFormatQty ({value, format}:FormatValueObject<QuantityFormat, string>) {
    const length = QuantityFormat[format].length;
    if ( !(isNumeric(value) && hasLength(value, length)) ) {
        err(`Expected "quantity.value" to be an numeric value with length of "${length}", but was ${value}"`);
    }
    return formatQty(value, format);
}

/**
 * Checks that the manufacture/expiration date is correctly formatted (number + length).
 * If so, return a formatted date according to the HIBC specification.
 *
 * @param {FormatValueObject<ExpDateFormat, string>} expDate
 * @returns
 */
function validateAndFormatExpDate ( date:FormatValueObject<DateFormat, string> ) {
    if ( !isValue(date) ) { return formatExpDate(); }
    if ( !isDate(date.value, date.format) ) {
        err(`Expected "expDate" to be a valid date of type "${date.format}", got ${date.value}.`);
    }
    return formatExpDate(date.value, date.format);
}

import { err } from './utils/log.utils';
import { hasLength, isAlphanumeric, isValue } from './utils/validate.utils';
import { generateCheckChar } from './check-char/check-char';

/**
 * Internationally recognized, unique, HIBC Supplier
 * Labeling Data Identifier Flag Character, aka "+"
 */
export const HIBC_FLAG = '+';

/**
 * Seperator when combining data structures.
 */
export const DATA_STRUCTURE_SEPERATOR = '/';


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
    lic:string;

    /**
     * Labelers Product or Catalog Number (PCN).
     * Alpanumeric data.
     *
     * @type {(string|number)}
     */
    pcn:string|number;

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
    unitOfMeasure:number;

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
export interface SecondaryDataStructureConfig {
    /**
     * Lot/batch or serial number field, alphanumeric
     *
     * @type {(string|number)}
     */
    lot:string|number;

    /**
     * Do no append the check char.
     *
     * @type {boolean}
     */
    noCheckChar?: boolean;
}


/**
 * Create primary data structure.
 *
 * @export
 * @param {PrimaryDataStructureConfig} { lic, pcn, unitOfMeasure }
 * @returns string
 */
export function createPrimaryDataStructure ({ lic, pcn, unitOfMeasure, noCheckChar = false }:PrimaryDataStructureConfig) {
    // Check input conformity.
    if ( !(isAlphanumeric(lic) && hasLength(lic, 4)) ) {
        err(`Expected "lic" to be an alphanumeric value with a length of 4, got ${lic}`);
    }
    if ( !(isAlphanumeric(pcn) && hasLength(pcn, 1, 18)) ) {
        err(`Expected "pcn" to be an alphanumeric value with a length of 1-18, got ${pcn}`);
    }
    if ( !(isValue(unitOfMeasure) && /^[0-9]$/.test(unitOfMeasure.toString())) ) {
        err(`Expected "unitOfMeasure" to be an integer between 0-9, got ${unitOfMeasure}`);
    }

    let pds = `${HIBC_FLAG}${lic}${pcn}${unitOfMeasure}`;
    return pds + (noCheckChar ? '' : generateCheckChar(pds));
}


/**
 * Create secondary data structure.
 *
 * @export
 * @param {SecondaryDataStructureConfig} secondaryConfig
 * @returns string
 */
export function createSecondaryDataStructure ({ lot, noCheckChar = false }:SecondaryDataStructureConfig) {
    // Check input conformity.
    if ( !(isAlphanumeric(lot) && hasLength(lot, 0, 18)) ) {
        err(`Expected "lot" to be an alphanumeric value with a length of 0-18, got ${lot}`);
    }

    /**
     * Since we currently only support lot/serial number this part is
     * hard coded. To fully support the HIBC UDI specification we need
     * to add the following:
     *
     * (1) Manufacturer date
     * (2) Expiration date
     * (3) Quantitiy
     * (4) Quantitiy/Date Flag (Appendix E)
     */
    const flag = '$$7'; // Date field is null, lot field follows

    let sds = `${HIBC_FLAG}${flag}${lot}`;
    return sds + (noCheckChar ? '' : generateCheckChar(sds));
}


/**
 * Create combined data structure.
 *
 * @export
 * @param {PrimaryDataStructureConfig} primaryConfig
 * @param {SecondaryDataStructureConfig} secondaryConfig
 * @returns string
 */
export function createCombinedDataStructure (primaryConfig:PrimaryDataStructureConfig, secondaryConfig:SecondaryDataStructureConfig) {
    const noCheck = { noCheckChar: true };

    // Create primary + secondary data structure.
    // Note: This will also check conformity.
    let primary = createPrimaryDataStructure(Object.assign(primaryConfig, noCheck));
    let secondary = createSecondaryDataStructure(Object.assign(secondaryConfig, noCheck));

    // Replace `HIBC_FLAG` with seperator.
    secondary = `${DATA_STRUCTURE_SEPERATOR}${secondary.substr(1)}`;

    let cds = `${primary}${secondary}`;
    return cds + generateCheckChar(cds);
}

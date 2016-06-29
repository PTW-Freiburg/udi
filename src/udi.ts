import { hasLength, isAlphanumeric, isValue } from './utils/validate.utils';

/**
 * Configuration of the parameters required to create
 * an Unique Device Identification.
 *
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
}


/**
 * Create primary data structure.
 *
 * @export
 * @param {PrimaryDataStructureConfig} { lic, pcn, unitOfMeasure }
 * @returns
 */
export function createPrimaryDataStructure ({ lic, pcn, unitOfMeasure }:PrimaryDataStructureConfig) {
    // Check input conformity.
    if ( !(isAlphanumeric(lic) && hasLength(lic, 4)) ) {
        throw new Error(`[udi] Expected "lic" to be an alphanumeric value with a length of 4, got ${lic}`);
    }
    if ( !(isAlphanumeric(pcn) && hasLength(pcn, 1, 18)) ) {
        throw new Error(`[udi] Expected "pcn" to be an alphanumeric value with a length of 1-18, got ${pcn}`);
    }
    if ( !(isValue(unitOfMeasure) && /^[0-9]$/.test(unitOfMeasure.toString())) ) {
        throw new Error(`[udi] Expected "unitOfMeasure" to be an integer between 0-9, got ${unitOfMeasure}`);
    }

    return `+${lic}${pcn}${unitOfMeasure}C`;
}

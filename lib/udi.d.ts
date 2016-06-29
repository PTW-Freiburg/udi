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
    lic: string;
    /**
     * Labelers Product or Catalog Number (PCN).
     * Alpanumeric data.
     *
     * @type {string}
     */
    pcn: string;
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
}
export default function createPrimaryDataStructure(config: PrimaryDataStructureConfig): string;

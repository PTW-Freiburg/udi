import { expect } from 'chai';
import * as format from './utils/format.utils';
import {
    DateFormat,
    QuantityFormat,
    barcodify,
    createPrimaryDataStructure,
    createSecondaryDataStructure,
    createCombinedDataStructure } from './udi';

describe('[udi]', () => {

    describe('Re-export', () => {
        it('should re-export date format', () => {
            expect(DateFormat).to.equal(format.DateFormat);
        });

        it('should re-export quantity format', () => {
            expect(QuantityFormat).to.equal(format.QuantityFormat);
        });

        it('should re-export boarcodify()', () => {
            expect(barcodify).to.equal(format.barcodify);
        });
    });

    describe('Primary Data Structure', () => {
        it('should be a function', () => {
            expect(createPrimaryDataStructure).to.be.a('function');
        });

        it('should create an UDI', () => {
            expect(createPrimaryDataStructure({
                    lic: 'SNOW',
                    pcn: 'MAKER',
                    unitOfMeasure: 0
                }))
                .to.be.a('string')
                .to.equal('+SNOWMAKER0Q');

            expect(createPrimaryDataStructure({
                    lic: 'BLUE',
                    pcn: 'UNICORN',
                    unitOfMeasure: 7
                }))
                .to.be.a('string')
                .to.equal('+BLUEUNICORN7N');

            expect(createPrimaryDataStructure({
                    lic: 'A123',
                    pcn: 'AA4',
                    unitOfMeasure: 0
                }))
                .to.be.a('string')
                .to.equal('+A123AA40 ');
        });

        it('should create an UDI w/o check char', () => {
            expect(createPrimaryDataStructure({
                    lic: 'SNOW',
                    pcn: 'MAKER',
                    unitOfMeasure: 0,
                    noCheckChar: true
                }))
                .to.be.a('string')
                .to.equal('+SNOWMAKER0');
        });

        it('should check input conformity', () => {
            // LIC => Exact length of 4, alphanumeric + starting with alpha char
            expect(() => createPrimaryDataStructure({
                lic: 'TooLong',
                pcn: 123123,
                unitOfMeasure: 0
            })).to.throw(Error);
            expect(() => createPrimaryDataStructure({
                lic: 'foo',
                pcn: 123123,
                unitOfMeasure: 0
            })).to.throw(Error);
            expect(() => createPrimaryDataStructure({
                lic: '$OOD',
                pcn: 123123,
                unitOfMeasure: 0
            })).to.throw(Error);
            expect(() => createPrimaryDataStructure({
                lic: '1234',
                pcn: 123123,
                unitOfMeasure: 0
            })).to.throw(Error);

            // PCN => Length 1-18 and alphanumeric
            expect(() => createPrimaryDataStructure({
                lic: 'GOOD',
                pcn: '',
                unitOfMeasure: 0
            })).to.throw(Error);
            expect(() => createPrimaryDataStructure({
                lic: 'GOOD',
                pcn: 'qwertzu123asdfghjkl',
                unitOfMeasure: 0
            })).to.throw(Error);
            expect(() => createPrimaryDataStructure({
                lic: 'GOOD',
                pcn: 'qwertzu%opa#fghj',
                unitOfMeasure: 0
            })).to.throw(Error);

            // Unit of measure => Number 0-9
            expect(() => createPrimaryDataStructure({
                lic: 'GOOD',
                pcn: 'A123GD',
                unitOfMeasure: 152134
            })).to.throw(Error);
            expect(() => createPrimaryDataStructure({
                lic: 'GOOD',
                pcn: 'A123GD',
                unitOfMeasure: -1
            })).to.throw(Error);
        });
    });


    describe('Secondary Data Strcuture', () => {
        // Below values are taken form the ANSI/HIB 2.5 - 2015
        // specification. You can find them in Appendix F.
        const lic = 'A123';
        const pcn = 'BJC5D6E71G';
        const unitOfMeasure = 1;

        const lot = '3C001';
        const sn = '0001';


        it('should be a function', () => {
            expect(createSecondaryDataStructure).to.be.a('function');
        });

        it('should create an UDI (LOT)', () => {
            expect(createSecondaryDataStructure({
                    lic, pcn, unitOfMeasure,
                    lot
                }))
                .to.be.a('string')
                .to.equal('+$$73C001X3');
        });

        it('should create an UDI (LOT + ExpDate)', () => {
            expect(createSecondaryDataStructure({
                    lic, pcn, unitOfMeasure,
                    lot,
                    expDate: {
                        format: DateFormat.MMYY,
                        value: '0905'
                    }
                }))
                .to.be.a('string')
                .to.equal('+$$09053C001XA');
            expect(createSecondaryDataStructure({
                    lic, pcn, unitOfMeasure,
                    lot,
                    expDate: {
                        format: DateFormat.YYMMDD,
                        value: '050928'
                    }
                }))
                .to.be.a('string')
                .to.equal('+$$30509283C001XN');
            expect(createSecondaryDataStructure({
                    lic, pcn, unitOfMeasure,
                    lot,
                    expDate: {
                        format: DateFormat.YYYYMMDD,
                        value: '20050928'
                    }
                }))
                .to.be.a('string')
                .to.equal('+$$73C001/14D20050928X1');
        });

        it('should create an UDI (LOT + ExpDate + Quantity)', () => {
            expect(createSecondaryDataStructure({
                    lic, pcn, unitOfMeasure,
                    lot,
                    quantity: {
                        format: QuantityFormat.QQ,
                        value: '66'
                    },
                    expDate: {
                        format: DateFormat.YYYYMMDD,
                        value: '20050928'
                    }
                }))
                .to.be.a('string')
                .to.equal('+$$86673C001/14D20050928XL');
        });

        it('should create an UDI (SN)', () => {
            expect(createSecondaryDataStructure({
                    lic, pcn, unitOfMeasure,
                    sn
                }))
                .to.be.a('string')
                .to.equal('+$$+70001XT');
        });

        it('should create an UDI (SN + ExpDate)', () => {
            expect(createSecondaryDataStructure({
                    lic, pcn, unitOfMeasure,
                    sn,
                    expDate: {
                        format: DateFormat.MMDDYY,
                        value: '092805'
                    }
                }))
                .to.be.a('string')
                .to.equal('+$$+20928050001X5');
        });

        it('should create an UDI (SN + ExpDate)', () => {
            expect(createSecondaryDataStructure({
                    lic, pcn, unitOfMeasure,
                    sn,
                    expDate: {
                        format: DateFormat.MMDDYY,
                        value: '092805'
                    }
                }))
                .to.be.a('string')
                .to.equal('+$$+20928050001X5');
        });

        it('should create an UDI (LOT + Manufacture Date)', () => {
            expect(createSecondaryDataStructure({
                    lic, pcn, unitOfMeasure,
                    lot,
                    manufactureDate: '20160101'
                }))
                .to.be.a('string')
                .to.equal('+$$73C001/16D20160101XV');
        });

        it('should create an UDI (LOT + SN)', () => {
            expect(createSecondaryDataStructure({
                    lic, pcn, unitOfMeasure,
                    sn, lot
                }))
                .to.be.a('string')
                .to.equal('+$$73C001/S0001XT');
        });

        it('should create an UDI (LOT + ExpDate + Manufacture Date)', () => {
            expect(createSecondaryDataStructure({
                    lic, pcn, unitOfMeasure,
                    lot, sn,
                    expDate: {
                        format: DateFormat.MMDDYY,
                        value: '092805'
                    },
                    manufactureDate: '20000101'
                }))
                .to.be.a('string')
                .to.equal('+$$20928053C001/S0001/16D20000101XQ');
        });

        it('should create an UDI (LOT + Quantitiy + ExpDate in "YYYYMMDD" + Manufacture Date)', () => {
            expect(createSecondaryDataStructure({
                    lic, pcn, unitOfMeasure,
                    lot,
                    quantity: {
                        format: QuantityFormat.QQQQQ,
                        value: '12345'
                    },
                    expDate: {
                        format: DateFormat.YYYYMMDD,
                        value: '20200101'
                    },
                    manufactureDate: '20160101'
                }))
                .to.be.a('string')
                .to.equal('+$$91234573C001/16D20160101/14D20200101XX');
        });

        it('should check input conformity', () => {
            // Lot => length 0-18, alphanumeric
            expect(() => createSecondaryDataStructure({
                lic, pcn, unitOfMeasure,
                lot: '235LKJ6HJK687HKJNBK7866578AS'
            })).to.throw(Error);
            expect(() => createSecondaryDataStructure({
                lic, pcn, unitOfMeasure,
                lot: 'QWERTFG€678'
            })).to.throw(Error);

            // SN => length 0-18, alphanumeric
            expect(() => createSecondaryDataStructure({
                lic, pcn, unitOfMeasure,
                sn: '235LKJ6HJK687HKJNBK7866578AS'
            })).to.throw(Error);
            expect(() => createSecondaryDataStructure({
                lic, pcn, unitOfMeasure,
                sn: 'QWERTFG€678'
            })).to.throw(Error);
        });

        it('should not allow SN + ExpDate to be specified together', () => {
            expect(() => createSecondaryDataStructure({
                lic, pcn, unitOfMeasure,
                sn,
                quantity: {
                    format: QuantityFormat.QQ,
                    value: '12'
                }
            })).to.throw(Error);
        });

        it('should validate correct input of quantity', () => {
            expect(() => createSecondaryDataStructure({
                lic, pcn, unitOfMeasure,
                lot,
                quantity: {
                    format: QuantityFormat.QQ,
                    value: '1'
                }
            })).to.throw(Error);

            expect(() => createSecondaryDataStructure({
                lic, pcn, unitOfMeasure,
                lot,
                quantity: {
                    format: QuantityFormat.QQQQQ,
                    value: '125'
                }
            })).to.throw(Error);

            expect(() => createSecondaryDataStructure({
                lic, pcn, unitOfMeasure,
                lot,
                quantity: {
                    format: QuantityFormat.QQQQQ,
                    value: '10000000000000'
                }
            })).to.throw(Error);
        });

        it('should validate correct input of expiration date', () => {
            expect(() => createSecondaryDataStructure({
                lic, pcn, unitOfMeasure,
                lot,
                expDate: {
                    format: DateFormat.YYMMDD,
                    value: '01'
                }
            })).to.throw(Error);

            expect(() => createSecondaryDataStructure({
                lic, pcn, unitOfMeasure,
                lot,
                expDate: {
                    format: DateFormat.YYYYMMDD,
                    value: '160101'
                }
            })).to.throw(Error);
        });

        it('should validate correct input of manufacture date', () => {
            expect(() => createSecondaryDataStructure({
                lic, pcn, unitOfMeasure,
                lot,
                manufactureDate: '01'
            })).to.throw(Error);

            expect(() => createSecondaryDataStructure({
                lic, pcn, unitOfMeasure,
                lot,
                manufactureDate: '150101'
            })).to.throw(Error);
        });
    });


    describe('Combined Data Strcuture', () => {
        // Below values are taken form the ANSI/HIB 2.5 - 2015
        // specification. You can find them in Appendix F.
        const lic = 'A123';
        const pcn = 'BJC5D6E71G';
        const unitOfMeasure = 1;

        const lot = '3C001';
        const sn = '0001';

        it('should be a function', () => {
            expect(createCombinedDataStructure).to.be.a('function');
        });

        it('should create an UDI (LOT)', () => {
            expect(createCombinedDataStructure({
                    lic, pcn, unitOfMeasure,
                    lot
                }))
                .to.be.a('string')
                .to.equal('+A123BJC5D6E71G1/$$73C0012');
        });

        it('should create an UDI (LOT + Quantitiy + ExpDate in "YYYYMMDD" + Manufacture Date)', () => {
            expect(createCombinedDataStructure({
                    lic, pcn, unitOfMeasure,
                    lot,
                    quantity: {
                        format: QuantityFormat.QQQQQ,
                        value: '12345'
                    },
                    expDate: {
                        format: DateFormat.YYYYMMDD,
                        value: '20200101'
                    },
                    manufactureDate: '20160101'
                }))
                .to.be.a('string')
                .to.equal('+A123BJC5D6E71G1/$$91234573C001/16D20160101/14D20200101W');
        });

        it('should create an UDI (LOT + SN + ExpDate in "YYYYMMDD" + Manufacture Date)', () => {
            expect(createCombinedDataStructure({
                    lic, pcn, unitOfMeasure,
                    lot, sn,
                    expDate: {
                        format: DateFormat.YYYYMMDD,
                        value: '20200101'
                    },
                    manufactureDate: '20160101'
                }))
                .to.be.a('string')
                .to.equal('+A123BJC5D6E71G1/$$73C001/S0001/16D20160101/14D20200101Y');
        });
    });

    // +A123BJC5D6E71G1/$$91234573C001/16D20160101/14D20200101W
});

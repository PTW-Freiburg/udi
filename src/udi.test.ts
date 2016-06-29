import { expect } from 'chai';
import {
    createPrimaryDataStructure,
    createSecondaryDataStructure,
    createCombinedDataStructure } from './udi';

describe('[udi]', () => {

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
            // LIC => Exact length of 4 and alphanumeric
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
        it('should be a function', () => {
            expect(createSecondaryDataStructure).to.be.a('function');
        });

        it('should create an UDI', () => {
            expect(createSecondaryDataStructure({
                    lot: '10X3'
                }))
                .to.be.a('string')
                .to.equal('+$$710X3Y');

            expect(createSecondaryDataStructure({
                    lot: 'LT34AA'
                }))
                .to.be.a('string')
                .to.equal('+$$7LT34AAV');
        });

        it('should check input conformity', () => {
            // Lot/batch/sn => length 0-18, alphanumeric
            expect(() => createSecondaryDataStructure({
                lot: '235LKJ6HJK687HKJNBK7866578AS'
            })).to.throw(Error);
            expect(() => createSecondaryDataStructure({
                lot: 'QWERTFG€678'
            })).to.throw(Error);
        });
    });


    describe('Combined Data Strcuture', () => {
        it('should be a function', () => {
            expect(createCombinedDataStructure).to.be.a('function');
        });

        it('should create an UDI', () => {
            expect(createCombinedDataStructure({
                    lic: 'A999',
                    pcn: '1234',
                    unitOfMeasure: 5
                }, {
                    lot: '10X3'
                }))
                .to.be.a('string')
                .to.equal('+A99912345/$$710X3/');

            expect(createCombinedDataStructure({
                    lic: 'ABCD',
                    pcn: '99875',
                    unitOfMeasure: 2
                }, {
                    lot: 'XXX'
                }))
                .to.be.a('string')
                .to.equal('+ABCD998752/$$7XXX7');
        });
    });
});

import { expect } from 'chai';
import { createPrimaryDataStructure } from './udi';

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
});

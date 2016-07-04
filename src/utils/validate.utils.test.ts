import { expect } from 'chai';
import { DateFormat } from './format.utils';
import { isValue, isAlphanumeric, isNumeric, hasLength, isDate } from './validate.utils';

describe('[utils/validate]', () => {

    describe('Value', () => {
        it('should be a function', () => {
            expect(isValue).to.be.a('function');
        });

        it('should return "true" for defined and not-null values', () => {
            expect(isValue('asfasd')).to.be.true;
            expect(isValue('')).to.be.true;
            expect(isValue(5)).to.be.true;
            expect(isValue({})).to.be.true;
            expect(isValue([])).to.be.true;
        });

        it('should return "false" for undefined and null', () => {
            expect(isValue(undefined)).to.be.false;
            expect(isValue(null)).to.be.false;
        });
    });

    describe('Alphanumeric', () => {
        it('should be a function', () => {
            expect(isAlphanumeric).to.be.a('function');
        });

        it('should return "true" if input is alphanumeric', () => {
            expect(isAlphanumeric('a')).to.be.true;
            expect(isAlphanumeric('a1Bc')).to.be.true;
            expect(isAlphanumeric(1253)).to.be.true;
            expect(isAlphanumeric(0)).to.be.true;
            expect(isAlphanumeric('')).to.be.true;
        });

        it('should return "false" if input is not alphanumeric', () => {
            expect(isAlphanumeric(undefined)).to.be.false;
            expect(isAlphanumeric(null)).to.be.false;
            expect(isAlphanumeric('!"§$%&/()')).to.be.false;
            expect(isAlphanumeric(1.5)).to.be.false;
            expect(isAlphanumeric('fUz#w')).to.be.false;
        });
    });


    describe('Numeric', () => {
        it('should be a function', () => {
            expect(isNumeric).to.be.a('function');
        });

        it('should return "true" if input is Numeric', () => {
            expect(isNumeric(1253)).to.be.true;
            expect(isNumeric(0)).to.be.true;
            expect(isNumeric('')).to.be.true;
        });

        it('should return "false" if input is not Numeric', () => {
            expect(isNumeric(undefined)).to.be.false;
            expect(isNumeric(null)).to.be.false;
            expect(isNumeric('abc')).to.be.false;
            expect(isNumeric('!"§$%&/()')).to.be.false;
            expect(isNumeric(1.5)).to.be.false;
        });
    });


    describe('Within Range', () => {

        it('should be a function', () => {
            expect(hasLength).to.be.a('function');
        });

        it('should return "true if input is within range"', () => {
            expect(hasLength('', 0, 0)).to.be.true;
            expect(hasLength(6, 1)).to.be.true;
            expect(hasLength('f', 1)).to.be.true;

            expect(hasLength('f', 1, 6)).to.be.true;
            expect(hasLength('fo', 1, 6)).to.be.true;
            expect(hasLength('foo', 1, 6)).to.be.true;
            expect(hasLength('foob', 1, 6)).to.be.true;
            expect(hasLength('fooba', 1, 6)).to.be.true;
            expect(hasLength('foobar', 1, 6)).to.be.true;
        });

        it('should return "false" if input is not within range"', () => {
            expect(hasLength(55, 5, 10)).to.be.false;
            expect(hasLength('0', 5, 10)).to.be.false;
            expect(hasLength('nope', 0)).to.be.false;
        });

        it('should throw if given "min" is larger than "max" value', () => {
            expect(() => hasLength(0, 1000, 100)).to.throw(Error);
        });

        it('should throw if given "min"/"max" are negative', () => {
            expect(() => hasLength(150, 100, -100)).to.throw(Error);
            expect(() => hasLength(0, -100, 100)).to.throw(Error);
        });
    });


    describe('Date', () => {
        it('should be a function', () => {
            expect(isDate).to.be.a('function');
        });

        it('should return "true" if input is Numeric', () => {
            expect(isDate(1253, DateFormat.MMYY)).to.be.true;
            expect(isDate('20160101', DateFormat.YYYYMMDD)).to.be.true;
        });

        it('should return "false" if input is not Numeric', () => {
            expect(isDate(12, DateFormat.MMYY)).to.be.false;
            expect(isDate('12.12.2015', DateFormat.YYMMDDHH)).to.be.false;
        });
    });
});

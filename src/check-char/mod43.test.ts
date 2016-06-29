import { expect } from 'chai';
import { MOD43_TABLE, fromMod43, toMod43 } from './mod43';

describe('[mod43]', () => {

    describe('Table', () => {
        it('should have a complete modulo 43 table', () => {
            expect(MOD43_TABLE)
                .to.be.a('array')
                .to.have.length(43);
        });
    });

    describe('To', () => {
        it('should be a function', () => {
            expect(toMod43).to.be.a('function');
        });

        it('should be possible to get corresponding %43 value', () => {
            expect(toMod43('0')).to.equal(0);
            expect(toMod43('5')).to.equal(5);
            expect(toMod43('a')).to.equal(10);
            expect(toMod43('j')).to.equal(19);
            expect(toMod43('z')).to.equal(35);
            expect(toMod43(' ')).to.equal(38);
            expect(toMod43('%')).to.equal(42);
        });

        it('should throw if given value has no corresponding %43 value', () => {
            expect(toMod43.bind(null, '€')).to.throw(Error);
        });
    });

    describe('From', () => {
        it('should be a function', () => {
            expect(fromMod43).to.be.a('function');
        });

        it('should be possible to get %43 from number', () => {
            expect(fromMod43(0)).to.equal('0');
            expect(fromMod43(4)).to.equal('4');
            expect(fromMod43(7)).to.equal('7');
            expect(fromMod43(11)).to.equal('B');
            expect(fromMod43(18)).to.equal('I');
            expect(fromMod43(25)).to.equal('P');
            expect(fromMod43(38)).to.equal(' ');
            expect(fromMod43(42)).to.equal('%');
        });

        it('should throw if given value is not 0-42', () => {
            expect(fromMod43.bind(null, -1)).to.throw(Error);
            expect(fromMod43.bind(null, 67)).to.throw(Error);
        });
    });
});
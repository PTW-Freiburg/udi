import { expect } from 'chai';
import { generateCheckChar } from './check-char';

describe('[check-char]', () => {

    it('should be a function', () => {
        expect(generateCheckChar).to.be.a('function');
    });

    it('should generate check char', () => {
        expect(generateCheckChar('+A123BJC5D6E71')).to.equal('G');
        expect(generateCheckChar('+123456789')).to.equal('0');
        expect(generateCheckChar('+foobar')).to.equal('N');
    });
});
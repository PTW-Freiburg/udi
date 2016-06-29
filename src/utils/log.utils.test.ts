import { expect } from 'chai';
import { err } from './log.utils';

describe('[utils/log]', () => {
    describe('Error', () => {
        it('should be a function', () => {
            expect(err).to.be.a('function');
        });

        it('should throw an error', () => {
            expect(err.bind(null, 'some message')).to.throw(Error);
        });

        it('should have message', () => {
            expect(err.bind(null, 'some message')).to.throw(/some message/);
        });
    });
});
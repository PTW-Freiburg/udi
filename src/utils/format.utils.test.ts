import { expect } from 'chai';
import {
    FieldFlag,
    QuantityFormat,
    DateFormat,
    formatField,
    getQtyFlag,
    formatQty,
    formatExpDate,
    formatManufactureDate,
    barcodify } from './format.utils';

describe('[utils/format]', () => {
    describe('Format Field', () => {
        it('should be a function', () => {
            expect(formatField).to.be.a('function');
        });

        it('should return correct LOT format', () => {
            expect(formatField(123, null)).to.equal('123');
            expect(formatField('abx21', null)).to.equal('abx21');
        });

        it('should return correct SN format', () => {
            expect(formatField(null, '0001')).to.equal('0001');
            expect(formatField(null, 'fx123')).to.equal('fx123');
        });

        it('should concatenat LOT and SN with delimiter', () => {
            expect(formatField('201X', 5126143)).to.equal('201X/S5126143');
            expect(formatField(123, '5AC34')).to.equal('123/S5AC34');
        });
    });

    describe('Quantity Flag', () => {
        it('should be a function', () => {
            expect(getQtyFlag).to.be.a('function');
        });

        it('should return correct flag for LOT', () => {
            expect(getQtyFlag(FieldFlag.LOT)).to.equal('$$');
        });

        it('should return correct flag for SN', () => {
            expect(getQtyFlag(FieldFlag.SN)).to.equal('$$+');
        });
    });

    describe('Format Quantity', () => {
        it('should be a function', () => {
            expect(formatQty).to.be.a('function');
        });

        it('should format quantity', () => {
            expect(formatQty('55', QuantityFormat.QQ)).to.equal('855');
            expect(formatQty('55555', QuantityFormat.QQQQQ)).to.equal('955555');
        });
    });

    describe('Format Expiration Date', () => {
        it('should be a function', () => {
            expect(formatExpDate).to.be.a('function');
        });

        it('should return "NULL" flag if date is empty', () => {
            expect(formatExpDate()).to.equal('7');
            expect(formatExpDate(null, DateFormat.YYJJJ)).to.equal('7');
        });

        it('should return date with no flag if format is "MMYY', () => {
            expect(formatExpDate('0201', DateFormat.MMYY)).to.equal('0201');
            expect(formatExpDate('1111', DateFormat.MMYY)).to.equal('1111');
        });

        it('should return formatted date with format "YYYYMMDD"', () => {
            expect(formatExpDate('20000101', DateFormat.YYYYMMDD))
                .to.equal('/14D20000101');
            expect(formatExpDate('19920503', DateFormat.YYYYMMDD))
                .to.equal('/14D19920503');
        });

        it('should return formatted date, depending on format', () => {
            expect(formatExpDate('020299', DateFormat.MMDDYY))
                .to.equal('2020299');
            expect(formatExpDate('020202', DateFormat.YYMMDD))
                .to.equal('3020202');
        });
    });

    describe('Format Manufacture Date', () => {
        it('should be a function', () => {
            expect(formatManufactureDate).to.be.a('function');
        });

        it('should return empty string if manufacture date is undefined/null', () => {
            expect(formatManufactureDate(null)).to.equal('');
            expect(formatManufactureDate(undefined)).to.equal('');
        });

        it('should format manufacture date', () => {
            expect(formatManufactureDate('20000101')).to.equal('/16D20000101');
            expect(formatManufactureDate('20160422')).to.equal('/16D20160422');
        });
    });

    describe('Barcodify', () => {
        it('should be a function', () => {
            expect(barcodify).to.be.a('function');
        });

        it('should barcodify data', () => {
            expect(barcodify('abc')).to.equal('*abc*');
            expect(barcodify('GHJ576F')).to.equal('*GHJ576F*');
        });

        it('should replace spaces with underscores (_)', () => {
            expect(barcodify('+A123AA40 ')).to.equal('*+A123AA40_*');
        });
    });
});
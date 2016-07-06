# PTW UDI

[![Build Status](https://travis-ci.org/PTW-Freiburg/store.svg?branch=master)](https://travis-ci.org/PTW-Freiburg/udi) [![npm version](https://badge.fury.io/js/ptw-udi.svg)](https://badge.fury.io/js/ptw-udi)

Generates an unique device identification as speficied by HIBCC UDI (ANSI/HIBC 2.5 - 2015).
You can find more information about the specification of the unique device indification on the [HIBC website](http://www.hibcc.org/udi-labeling-standards/).

This library is very small (~6KB minified, no external dependencies) and its sole purpose is to generate a HIBC-conform data structure that uniquely identifies a product. It will automatically create a string with the correct order of information and check characters. The string can then be used by your favorite barcode generating library to generate a Bar-/QR-Code based on the generated string.

## Install

```
$ npm install ptw-udi --save
```

## Usage

The public API consists of 3 methods to create different types of data structures (primary, secondary and combined) and one method to transform the created data structure to a string that can be placed below the barcode.

Below are some examples that show how to create unique device identifications with `ptw-udi`. For a complete overview of the API, please check out the included declarations files `lib/udi.d.ts`. If you're using [Typescript](http://www.typescriptlang.org/) you also can import `PrimaryDataStructureConfig` and `SecondaryDataStructureConfig` for additional help with the inevitable large signature of the API methods.

### Primary Data Structure

```ts
import { createPrimaryDataStructure } from 'ptw-udi';

const udi = createPrimaryDataStructure({
    lic: 'BLUE',
    pcn: 'UNICORN',
    unitOfMeasure: 7
});
// udi = "+BLUEUNICORN7N"
```

### Secondary Data Structure

```ts
import { createSecondaryDataStructure, DateFormat, QuantityFormat } from 'ptw-udi';

const lic = 'A123';
const pcn = 'BJC5D6E71G';
const unitOfMeasure = 1;

const lot = '3C001';
const sn = '0001';

let udi = createSecondaryDataStructure({
    lic, pcn, unitOfMeasure,
    lot, sn,
    expDate: {
        format: DateFormat.MMDDYY,
        value: '092805'
    },
    manufactureDate: '20000101'
});
// udi = "+$$20928053C001/S0001/16D20000101XQ"

udi = createSecondaryDataStructure({
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
})
// udi = "+$$91234573C001/16D20160101/14D20200101XX"
```

### Combined Data Structure

```ts
import { createCombinedDataStructure, DateFormat } from 'ptw-udi';

const lic = 'A123';
const pcn = 'BJC5D6E71G';
const unitOfMeasure = 1;

const lot = '3C001';
const sn = '0001';

const udi = createCombinedDataStructure({
    lic, pcn, unitOfMeasure,
    lot, sn,
    expDate: {
        format: DateFormat.YYYYMMDD,
        value: '20200101'
    },
    manufactureDate: '20160101'
});
// udi = "+A123BJC5D6E71G1/$$73C001/S0001/16D20160101/14D20200101Y"
```

## Scripts

- Build: `npm run build`
- Test: `npm test`
- Develop: `npm run watch`
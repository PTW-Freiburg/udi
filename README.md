# PTW UDI

Generates an unique device identification as speficied by HIBC UDI (ANSI/HIBC 2.5 - 2015).
You can find more information about the specification of the unique device indification on the [HIBC website](http://www.hibcc.org/udi-labeling-standards/).

This library is very small (~3KB when minified) and its sole purpose is to generate a HIBC-conform data structure that uniquely identifies a product. It will automatically create a string with the correct order of information and check characters. The string can then be used by your favorite barcode generating library to generate a Bar-/QR-Code based on the generated string.

## Usage

The public API consists of 3 methods to create different types of data structures.

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

*Note: Currently there is only support for lot/batch/serial number. Quantity, manufacturer and expiration date are not supported. PRs are welcome!*

```ts
import { createSecondaryDataStructure } from 'ptw-udi';

const udi = createSecondaryDataStructure({
    lot: 'LT34AA'
});
// udi = "+$$7LT34AAV"
```

### Combined Data Structure

```ts
import { createCombinedDataStructure } from 'ptw-udi';

const udi = createCombinedDataStructure({
    lic: 'A999',
    pcn: '1234',
    unitOfMeasure: 5
}, {
    lot: '10X3'
}));
// udi = "+A99912345/$$710X3/"
```
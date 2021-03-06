# typler
[![Build Status](https://travis-ci.org/vladvsydorenko/typler.svg?branch=master)](https://travis-ci.org/vladvsydorenko/typler)

# Install
`npm install https://github.com/vladvsydorenko/typler.git`

# Syntax
Types are represented by strings. E.g. `string`, `number`. Type could be a `container`, like `array<number>` or
`stream<string>`. `Or` is also supported: `string | number | array<array<stream<number>>>`.

# Parse and Validate
Before using you should parse your type
```typescript
import {parseType, isCompatible} from 'typler';

// parse types
const stringOrNumberType = parseType('string | number');
const stringType = parseType('string');

// check
isCompatible(stringOrNumberType, string); // true
```

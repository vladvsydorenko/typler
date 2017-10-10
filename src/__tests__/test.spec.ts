import {isCompatible} from '../isCompatible';
import {parseType} from '../parseType';

describe('Plain types', () => {
  it('number === number', () => {
    expect(isCompatible(
        parseType('number'),
        parseType('number')
    )).toBe(true);
  });

  it('number !== string', () => {
    expect(isCompatible(
        parseType('number'),
        parseType('string')
    )).toBe(false);
  });
});
describe('Simple containers', () => {
  it('array<number> === array<number>', () => {
    expect(isCompatible(
        parseType('array<number>'),
        parseType('array<number>')
    )).toBe(true);
  });

  it('array<number> === array<string>', () => {
    expect(isCompatible(
        parseType('array<number>'),
        parseType('array<string>')
    )).toBe(false);
  });
});
describe('Deep containers', () => {
  it('array<array<stream<number>>> === array<array<stream<number>>>', () => {
    expect(isCompatible(
        parseType('array<array<stream<number>>>'),
        parseType('array<array<stream<number>>>')
    )).toBe(true);
  });

  it('array<array<stream<number>>> !== array<array<stream<string>>>', () => {
    expect(isCompatible(
        parseType('array<array<stream<number>>>'),
        parseType('array<array<stream<string>>>')
    )).toBe(false);
  });
});
describe('Plain types with "or"', () => {
  it('number | string | boolean === number', () => {
    expect(isCompatible(
        parseType('number | string | boolean'),
        parseType('number')
    )).toBe(true);
  });
  it('number | string | boolean === string | boolean', () => {
    expect(isCompatible(
        parseType('number | string | boolean'),
        parseType('string | boolean')
    )).toBe(true);
  });

  it('number | string | boolean !== Date', () => {
    expect(isCompatible(
        parseType('number | string | boolean'),
        parseType('Date')
    )).toBe(false);
  });
  it('number | string | boolean !== Date | Time', () => {
    expect(isCompatible(
        parseType('number | string | boolean'),
        parseType('Date | Time')
    )).toBe(false);
  });
});

describe('Containers with "or"', () => {
  it('array<number> | array<stream<array<number>>> | boolean === boolean', () => {
    expect(isCompatible(
        parseType('array<number> | array<stream<array<number>>> | boolean'),
        parseType('boolean')
    )).toBe(true);
  });
  it('array<number> | array<stream<array<number>>> | boolean === boolean | array<stream<array<number>>>', () => {
    expect(isCompatible(
        parseType('array<number> | array<stream<array<number>>> | boolean'),
        parseType('boolean | array<stream<array<number>>>')
    )).toBe(true);
  });

  it('array<number> | array<stream<array<number>>> | boolean !== number', () => {
    expect(isCompatible(
        parseType('array<number> | array<stream<array<number>>> | boolean | array<stream<array<number>>>'),
        parseType('number')
    )).toBe(false);
  });
  it('array<number> | array<stream<array<number>>> | boolean !== number | array<stream<array<string>>>', () => {
    expect(isCompatible(
        parseType('array<number> | array<stream<array<number>>> | boolean'),
        parseType('number | array<stream<array<string>>>')
    )).toBe(false);
  });

});

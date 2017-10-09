import {isCompatible} from '../src/isCompatible';
import {parseType} from '../src/parseType';
import {expect} from 'chai';
import 'mocha';

describe('Plain types', () => {
  it('number === number', () => {
    expect(isCompatible(
        parseType('number'),
        parseType('number')
    )).to.equal(true);
  });

  it('number !== string', () => {
    expect(isCompatible(
        parseType('number'),
        parseType('string')
    )).to.equal(false);
  });
});
describe('Simple containers', () => {
  it('array<number> === array<number>', () => {
    expect(isCompatible(
        parseType('array<number>'),
        parseType('array<number>')
    )).to.equal(true);
  });

  it('array<number> === array<string>', () => {
    expect(isCompatible(
        parseType('array<number>'),
        parseType('array<string>')
    )).to.equal(false);
  });
});
describe('Deep containers', () => {
  it('array<array<stream<number>>> === array<array<stream<number>>>', () => {
    expect(isCompatible(
        parseType('array<array<stream<number>>>'),
        parseType('array<array<stream<number>>>')
    )).to.equal(true);
  });

  it('array<array<stream<number>>> !== array<array<stream<string>>>', () => {
    expect(isCompatible(
        parseType('array<array<stream<number>>>'),
        parseType('array<array<stream<string>>>')
    )).to.equal(false);
  });
});
describe('Plain types with "or"', () => {
  it('number | string | boolean === number', () => {
    expect(isCompatible(
        parseType('number | string | boolean'),
        parseType('number')
    )).to.equal(true);
  });
  it('number | string | boolean === string | boolean', () => {
    expect(isCompatible(
        parseType('number | string | boolean'),
        parseType('string | boolean')
    )).to.equal(true);
  });

  it('number | string | boolean !== Date', () => {
    expect(isCompatible(
        parseType('number | string | boolean'),
        parseType('Date')
    )).to.equal(false);
  });
  it('number | string | boolean !== Date | Time', () => {
    expect(isCompatible(
        parseType('number | string | boolean'),
        parseType('Date | Time')
    )).to.equal(false);
  });
});

describe('Containers with "or"', () => {
  it('array<number> | array<stream<array<number>>> | boolean === boolean', () => {
    expect(isCompatible(
        parseType('array<number> | array<stream<array<number>>> | boolean'),
        parseType('boolean')
    )).to.equal(true);
  });
  it('array<number> | array<stream<array<number>>> | boolean === boolean | array<stream<array<number>>>', () => {
    expect(isCompatible(
        parseType('array<number> | array<stream<array<number>>> | boolean'),
        parseType('boolean | array<stream<array<number>>>')
    )).to.equal(true);
  });

  it('array<number> | array<stream<array<number>>> | boolean !== number', () => {
    expect(isCompatible(
        parseType('array<number> | array<stream<array<number>>> | boolean | array<stream<array<number>>>'),
        parseType('number')
    )).to.equal(false);
  });
  it('array<number> | array<stream<array<number>>> | boolean !== number | array<stream<array<string>>>', () => {
    expect(isCompatible(
        parseType('array<number> | array<stream<array<number>>> | boolean'),
        parseType('number | array<stream<array<string>>>')
    )).to.equal(false);
  });

});

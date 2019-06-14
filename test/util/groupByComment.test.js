const { groupByComments } = require('../../util/groupByComments');

describe('groupByComment', () => {
  it('empty array', () => {
    expect(groupByComments([])).toEqual([]);
  });

  it('array of empty string', () => {
    expect(groupByComments([''])).toEqual([]);
  });

  it('single import statement', () => {
    const input = ['import something'];

    expect(groupByComments(input)).toEqual(input);
  });

  it('multiple import statements', () => {
    const input = ['import something', 'import anotherThing'];
    expect(groupByComments(input)).toEqual(input);
  });

  it('multiple import statements with comment', () => {
    const input = ['import something', '// This is not a valid import', 'import anotherThing'];

    expect(groupByComments(input)).toEqual([input[0], input[1] + '\n' + input[2]]);
  });

  it('handles a complex case', () => {
    const input = [
      `import something from 'somewhere.js'`,
      '// This is not a valid import',
      'import anotherThing from "anotherPlace.js"',
      '',
      `import 'backticks.scss`,
      '',
      '',
      '// This is not a valid import',
      'import mythings.js',
      ''
    ];
    expect(groupByComments(input)).toEqual([input[0], input[1] + '\n' + input[2], input[4], input[7] + '\n' + input[8]]);
  });
  // TODO: add test to verify all whitespace lines are removed
});
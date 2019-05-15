const Se = require('sanctuary-either');
const cli = require('../cli');

// TODO: add test for the catch path of fsAccess

describe('validateFilePath', () => {
  it('invalid file path', async () => {
    expect(await cli.validateFilePath('./bs/bs.js')).toEqual(Se.Left('Invalid file path'));
  });

  it('valid file path', async () => {
    const path = './test/samples/simple.js';
    expect(await cli.validateFilePath(path)).toEqual(Se.Right(path));
  });
});

describe('getFileContents', () => {
  it('empty file', async () => {
    expect(await cli.getFileContents('./test/samples/empty.js')).toEqual(Se.Right(''));
  });

  it('use strict', async () => {
    expect(await cli.getFileContents('./test/samples/strict.js')).toEqual(Se.Right(`'use strict';`));
  });

  it('catch path', async () => {
    expect(await cli.getFileContents('./tests/samples/strict.js')).toEqual(
      Se.Left("Error: ENOENT: no such file or directory, open './tests/samples/strict.js'")
    );
  });
});

describe('splitFileByImports', () => {
  const testArray1 = [`import React, { Compnent } from 'react';`, `class MyComponent extends Component {`];

  const testArray2 = [
    `import React, { Compnent } from 'react';`,
    `// I have no idea what I am doing...`,
    `import something from 'something`,
    ``,
    `class MyComponent extends Component {`
  ];

  it('empty file', () => {
    expect(cli.splitFileByImports([''])).toEqual({ imports: [''], body: [] });
  });

  it('single import', () => {
    expect(cli.splitFileByImports(testArray1)).toEqual({
      imports: [testArray1[0]],
      body: [testArray1[1]]
    });
  });

  it('multiple imports with comment and white space', () => {
    expect(cli.splitFileByImports(testArray2)).toEqual({
      imports: testArray2.slice(0, 4),
      body: [testArray2[4]]
    });
  });
});

describe('groupByComment', () => {
  it('empty array', () => {
    expect(cli.groupByComments([])).toEqual([]);
  });

  it('array of empty string', () => {
    expect(cli.groupByComments([''])).toEqual([]);
  });

  it('single import statement', () => {
    const input = ['import something'];

    expect(cli.groupByComments(input)).toEqual(input);
  });

  it('multiple import statements', () => {
    const input = ['import something', 'import anotherThing'];
    expect(cli.groupByComments(input)).toEqual(input);
  });

  it('multiple import statements with comment', () => {
    const input = ['import something', '// This is not a valid import', 'import anotherThing'];

    expect(cli.groupByComments(input)).toEqual([input[0], input[1] + '\n' + input[2]]);
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
    expect(cli.groupByComments(input)).toEqual([input[0], input[1] + '\n' + input[2], input[4], input[7] + '\n' + input[8]]);
  });
  // TODO: add test to verify all whitespace lines are removed
});

describe('sortImports', () => {
  it('sorts a simple case (hasvar)', () => {
    const input = [`import something from './somewhere.js'`, 'import "./anotherPlace"'];
    expect(cli.sortImports(input)).toEqual(input);
  });
  it('sorts a simple case (hasVar2)', () => {
    const input = ['import "./anotherPlace.js"', `import something from './somewhere'`];

    expect(cli.sortImports(input)).toEqual(input.reverse());
  });
  it('sorts a simple case (isFromFile)', () => {
    const input = [`import something from 'somewhere'`, 'import "./anotherPlace.js"'];
    expect(cli.sortImports(input)).toEqual(input);
  });
  it('sorts a simple case (isFromFile case 2)', () => {
    const input = ['import "./anotherPlace.js"', `import something from 'somewhere'`];
    expect(cli.sortImports(input)).toEqual(input.reverse());
  });
  it('sorts regardless of quotation type', () => {
    const input = ['import zthing from `./somewhere`', `import something from './somewhere'`, 'import aThing from "./anotherPlace"'];
    expect(cli.sortImports(input)).toEqual(input.reverse());
  });
  it('sorts a case with comments (case 1)', () => {
    const input = ['import something', '// a comment \nimport anotherThing'];
    expect(cli.sortImports(input)).toEqual([input[1], input[0]]);
  });
  it('sorts a case with comments (case 2)', () => {
    const input = ['// a comment \nimport something', 'import aThing'];
    expect(cli.sortImports(input)).toEqual(input.reverse());
  });
  it('sorts React and proptypes correctly', () => {
    const input = [
      `import something from './somewhere.js'`,
      'import React, {Component} from "react"', // 1
      `import PropTypes from 'prop-types'` // 0
    ];
    expect(cli.sortImports(input)).toEqual(input.reverse());
  });
  it('sorts a complex case (case 1)', () => {
    const input = [
      `import something from './somewhere.js'`, // 4
      '// This is not a valid import\n// Another comment line\nimport anotherThing from "anotherPlace.js"', // 3
      'import React, {Component} from "react"', // 2
      `import PropTypes from 'prop-types'`, // 1
      'import $ from "jquery"', // 0
      `import './backticks.scss'`, // 5
      '// This is not a valid import\nimport `./mythings.js`' // 6
    ];
    expect(cli.sortImports(input)).toEqual([input[4], input[3], input[2], input[1], input[0], input[5], input[6]]);
  });
});

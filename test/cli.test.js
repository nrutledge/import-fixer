const Se = require('sanctuary-either');
const cli = require('../cli');

// TODO: add test for the catch path of fsAccess

describe('validateFilePath', () => {
  it('invalid file path', async () => {
    expect(await cli.validateFilePath('./bs/bs.js')).toEqual(Se.Left('Invalid file path'));
  });

  it('valid file path', async () => {
    const path = './test/samples/simple.js'
    expect(await cli.validateFilePath(path)).toEqual(Se.Right(path));
  });
});

describe('getFileContents', () => {
  it('empty file', async () => {
    expect(await cli.getFileContents('./test/samples/empty.js')).toEqual(Se.Right(''));
  });

  it('use strict', async () => {
    expect(await cli.getFileContents('./test/samples/strict.js')).toEqual(Se.Right(`'use strict';`));
  })

  it('catch path', async () => {
    expect(
      await cli.getFileContents('./tests/samples/strict.js'))
        .toEqual(Se.Left("Error: ENOENT: no such file or directory, open './tests/samples/strict.js'")
    );
  })
});

describe('splitFileByImports', () => {
  const testArray1 = [
    `import React, { Compnent } from 'react';`,
    `class MyComponent extends Component {`
  ]

  const testArray2 = [
    `import React, { Compnent } from 'react';`,
    `// I have no idea what I am doing...`,
    `import something from 'something`,
    ``,
    `class MyComponent extends Component {`
  ]

  it('empty file', () => {
    expect(cli.splitFileByImports([''])).toEqual({ imports: [''], body: [] });
  });

  it('single import', () => {
    expect(cli.splitFileByImports(testArray1)).toEqual({ 
      imports: [testArray1[0]],
      body: [testArray1[1]]
    })
  });

  it('multiple imports with comment and white space', () => {
    expect(cli.splitFileByImports(testArray2)).toEqual({ 
      imports: testArray2.slice(0, 4),
      body: [testArray2[4]]
    })
  });
});

describe('groupByComment', () => {
  it('empty array', () => {
    expect(cli.groupByComments([])).toEqual([]);
  });

  it('array of empty string', () => {
    expect(cli.groupByComments([''])).toEqual(['']);
  });

  it('single import statement', () => {
    const input = ['import something'];

    expect(cli.groupByComments(input)).toEqual(input);
  });

  it('multiple import statements', () => {
    const input = [
      'import something',
      'import anotherThing'
    ];
    expect(cli.groupByComments(input)).toEqual(input);
  });

  it('multiple import statements with comment', () => {
    const input = [
      'import something',
      '// This is not a valid import',
      'import anotherThing'
    ];

    expect(cli.groupByComments(input))
      .toEqual([ input[0], input[1] + '\n' + input[2]]);
  });

});
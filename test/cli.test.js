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
  it('empty file', () => {
    expect(cli.splitFileByImports('')).toEqual({ imports: '', body: '' });
  });
});
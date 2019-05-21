const Se = require('sanctuary-either');

const { getFileContents } = require('../../util/getFileContents');

describe('getFileContents', () => {
  it('empty file', async () => {
    expect(await getFileContents('./test/samples/empty.js')).toEqual(Se.Right(''));
  });

  it('use strict', async () => {
    expect(await getFileContents('./test/samples/strict.js')).toEqual(Se.Right(`'use strict';`));
  });

  it('catch path', async () => {
    expect(await getFileContents('./tests/samples/strict.js')).toEqual(
      Se.Left("Error: ENOENT: no such file or directory, open './tests/samples/strict.js'")
    );
  });
});
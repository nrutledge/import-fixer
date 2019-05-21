const Se = require('sanctuary-either');

const { validateFilePath } = require('../../util/validateFilePath');

describe('validateFilePath', () => {
  it('invalid file path', async () => {
    expect(await validateFilePath('./bs/bs.js')).toEqual(Se.Left('Invalid file path'));
  });

  it('valid file path', async () => {
    const path = './test/samples/simple.js';
    expect(await validateFilePath(path)).toEqual(Se.Right(path));
  });
});
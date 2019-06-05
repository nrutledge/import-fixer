const Se = require('sanctuary-either');
const { env: flutureEnv } = require('fluture-sanctuary-types');
const { create, env } = require('sanctuary');

const S = create({ checkTypes: true, env: env.concat(flutureEnv) });

const { getFileContents } = require('../../util/getFileContents');

describe('getFileContents', () => {
  it('empty file', done => {
    getFileContents('./test/samples/empty.js').fork(
      e => {
        expect(false).toEqual(true);
        done();
      },
      s => {
        expect(s).toEqual('');
        done();
      }
    );
  });

  it('use strict', done => {
    getFileContents('./test/samples/strict.js').fork(
      e => {
        expect(false).toEqual(true);
        done();
      },
      s => {
        expect(s).toEqual(`'use strict';`);
        done();
      }
    );
  });

  it('catch path', done => {
    getFileContents('./tests/samples/strict.js').fork(
      e => {
        expect(e.toString()).toEqual("Error: ENOENT: no such file or directory, open './tests/samples/strict.js'");
        done();
      },
      s => {
        expect(false).toEqual(true);
        done();
      }
    );
  });
});

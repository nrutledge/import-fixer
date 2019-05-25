const Se = require('sanctuary-either');
const { env: flutureEnv } = require('fluture-sanctuary-types');
const { create, env } = require('sanctuary');

const Fluture = require('fluture');
const S = create({ checkTypes: true, env: env.concat(flutureEnv) });

const { validateFilePath } = require('../../util/validateFilePath');

describe('validateFilePath', () => {
  it('invalid file path', done => {
    // expect(true);
    const fut1 = validateFilePath('./bs/bs.js');
    fut1.fork(
      s => {
        expect(s).toEqual(Se.Left('Invalid file path'));
        done();
      },
      e => {
        throw new Error();
        done();
      }
    );
  });
  it('valid file path', done => {
    const path = './test/samples/simple.js';
    const fut2 = validateFilePath(path);
    fut2.fork(
      s => {
        expect(s).toEqual(Se.Right(path));
        done();
      },
      e => {
        expect(false).toEqual(true);
        done();
      }
    );
  });
});

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
    console.log('test running');
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
    console.log('test running');
    fut2.fork(
      s => {
        console.log('success callback');
        expect(s).toEqual(Se.Right(path));
        done();
      },
      e => {
        console.log('error callback', e);
        expect(false).toEqual(true);
        done();
      }
    );
  });
  // it('valid file path', async () => {
  //   const path = './test/samples/simple.js';
  //   expect(await validateFilePath(path)).toEqual(Se.Right(path));
  // });
});

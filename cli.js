const { env: flutureEnv } = require('fluture-sanctuary-types');
const { create, env } = require('sanctuary');

const S = create({ checkTypes: true, env: env.concat(flutureEnv) });
const { Future, map, chain } = require('fluture');

const { getFileContents } = require('./util/getFileContents');
const { groupByComments } = require('./util/groupByComments');
const { sortImports } = require('./util/sortImports');
const { splitFileByImports } = require('./util/splitFileByImports');
const { validateFilePath } = require('./util/validateFilePath');

const R = require('ramda');

const program = require('commander');

let targetPath;

program
  .version('0.1.0')
  .arguments('<path>')
  .action(function(path) {
    targetPath = path;
  });

program.parse(process.argv);

if (typeof targetPath === 'undefined') {
  console.error('no path given!');
  process.exit(1);
}
// console.log('command:', targetPath);
const fileStructureLens = R.lensProp('imports');

const main = () => {
  const result = Future.do(function*() {
    const content = yield getFileContents(targetPath);

    const splitContents = splitFileByImports(content.split('\n'));

    const grouped = R.over(
      fileStructureLens,
      R.compose(
        sortImports,
        groupByComments
      ),
      splitContents
    );

    return [grouped.imports.join('\n'), '\n\n', grouped.body.join('\n')].join('');
  });

  result.fork(console.log, console.log);
};

main();

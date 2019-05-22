const S = require('sanctuary');

const { getFileContents } = require('./util/getFileContents');
const { groupByComments } = require('./util/groupByComments')
const { sortImports } = require('./util/sortImports')
const { splitFileByImports } = require('./util/splitFileByImports')
const { validateFilePath } = require('./util/validateFilePath')

const program = require('commander'); 

let targetPath;

program
  .version('0.1.0')
  .arguments('<path>')
  .action(function (path) {
    targetPath = path;
 });

program.parse(process.argv);

if (typeof targetPath === 'undefined') {
  console.error('no path given!');
  process.exit(1);
}
console.log('command:', targetPath);

const main = async () => {
  try { 
    const validatedFilePath = await validateFilePath(targetPath);
    const content = S.map(getFileContents)(validatedFilePath);

    console.log({ content });
  } catch (err) {
    console.log('ERRAR', err)
    
  }
};

main();

const fs = require('fs');
const { Future } = require('fluture');
var read = Future.encaseN2(fs.readFile);

//getFileContents :: String -> Either String String
module.exports.getFileContents = filePath => {
  return read(filePath, 'utf8');
};

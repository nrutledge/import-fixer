const fs = require('fs-extra');
const Se = require('sanctuary-either');
const program = require('commander');

//validateFilePath :: String -> Either String String
module.exports.validateFilePath = async (filePath) => {
  try {
    const result = await fs.exists(filePath);
    return result ? Se.Right(filePath) : Se.Left('Invalid file path');
  }
  catch(err) {
    return Se.Left(err.toString());
  }
}

//getFileContents :: String -> Either String String
module.exports.getFileContents = async (filePath) => {
  try {
    const contents = await fs.readFile(filePath, 'utf8');
    return Se.Right(contents);
  }
  catch(err) {
    return Se.Left(err.toString());
  }
}

//splitFileByImports :: String -> { imports :: String, body :: String }
module.exports.splitFileByImports = (contents) => {
  return { imports: '', body: '' };
};
const fs = require('fs-extra');
const Se = require('sanctuary-either');

//getFileContents :: String -> Either String String
module.exports.getFileContents = async filePath => {
  try {
    const contents = await fs.readFile(filePath, 'utf8');
    return Se.Right(contents);
  } catch (err) {
    return Se.Left(err.toString());
  }
};
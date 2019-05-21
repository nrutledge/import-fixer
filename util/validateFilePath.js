const fs = require('fs-extra');
const Se = require('sanctuary-either');

//validateFilePath :: String -> Either String String
module.exports.validateFilePath = async filePath => {
  try {
    const result = await fs.exists(filePath);
    return result ? Se.Right(filePath) : Se.Left('Invalid file path');
  } catch (err) {
    return Se.Left(err.toString());
  }
};
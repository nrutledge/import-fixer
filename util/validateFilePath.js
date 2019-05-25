const fs = require('fs');
const Se = require('sanctuary-either');
const { Future } = require('fluture');

//validateFilePath :: String -> Either String String
module.exports.validateFilePath = filePath => {
  return Future((resolve, reject) => {
    const result = fs.exists(filePath, (result, err) => {
      if (err) {
        console.log('error returned', err);
        resolve(Se.Left(err.toString()));
      }

      resolve(result ? Se.Right(filePath) : Se.Left('Invalid file path'));
    });
  });
};

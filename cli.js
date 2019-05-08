const fs = require('fs-extra');
const S = require('sanctuary');
const Se = require('sanctuary-either');
const program = require('commander');

const importRegex = /^\s*import/
const commentRegex = /^\s*\/\//

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

// composition step: map lines over the either

// splitFileByImports :: Array String -> { imports :: Array String, body :: Array String }
module.exports.splitFileByImports = (contents) => {
  // Traverse array and find index of line that is not a comment or import or empty
  const breakIndex = contents.findIndex(line => {
    return !(
      importRegex.test(line) ||
      commentRegex.test(line) || 
      !line.trim()
    )
  });

  // Return start of array before index as "imports" and remaining elements joined as "body" 
  return { 
    imports: breakIndex === -1 ? contents : contents.slice(0, breakIndex), 
    body: breakIndex === -1 ? [] : contents.slice(breakIndex) 
  };
};

// groupByComments :: Array String -> Array String
module.exports.groupByComments = (importLines) => {
  // return null

  return importLines.reduce((acc, curr) => {
    const last = S.last(acc);
    
    // maybeIsComment :: Maybe String -> Boolean
    const maybeIsComment = (mStr) => S.fromMaybe (false)(S.map(x => commentRegex.test(x))(mStr))
    // maybeHasNewline :: Maybe String -> Boolean
    const maybeHasNewline = (mStr) => S.fromMaybe(false)(S.map(x => x.includes('\n'))(mStr))

    if (!S.isNothing(last) && maybeIsComment(last) && !maybeHasNewline(last)) {
      const newLast = S.fromMaybe('')(last) + '\n' + curr;
      acc.pop();
      acc.push(newLast); 
    } else {
      acc.push(curr);
    }

    return acc;
  }, []);
};
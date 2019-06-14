'use strict';

const { importRegex, commentRegex } = require('../lib/regex');

// splitFileByImports :: Array String -> { imports :: Array String, body :: Array String }
module.exports.splitFileByImports = contents => {
  // Traverse array and find index of line that is not a comment or import or empty
  const breakIndex = contents.findIndex(line => {
    return !(importRegex.test(line) || commentRegex.test(line) || !line.trim());
  });

  // Return start of array before index as "imports" and remaining elements joined as "body"
  return {
    imports: breakIndex === -1 ? contents : contents.slice(0, breakIndex),
    body: breakIndex === -1 ? [] : contents.slice(breakIndex)
  };
};
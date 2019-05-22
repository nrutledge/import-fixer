'use strict';

const S = require('sanctuary');

// isFromFile :: String -> Bool
const isFromFile = str => /\/.+['"`]$/.test(str.trim());
//hasVar :: String -> Bool
const hasVar = str => /^import\s.+\s+from/.test(str);

// sortImports :: Array String -> Array String
module.exports.sortImports = imports => {
  const bucketify = arr =>
    arr.reduce(
      (acc, cur) => {
        let bucketList = [];
        if (isFromFile(cur)) {
          bucketList.push(1);
        } else {
          bucketList.push(0);
        }
        // [0] or [1]
        if (hasVar(cur)) {
          bucketList.push(0);
        } else {
          bucketList.push(1);
        }
        // [0,0], [0, 1], [1, 0], or [1, 1]

        acc[bucketList[0]][bucketList[1]].push(cur);
        return acc;
      },
      [[[], []], [[], []]]
    );

  const compareIgnoringMultiLine = (a, b) => {
    const getLastLine = str => {
      const i = str.lastIndexOf('\n');
      return i !== -1 ? str.substring(i + 1) : str;
    };
    return getLastLine(a) >= getLastLine(b) ? 1 : -1;
  };
  // S.chain == concat . map
  const sortConcat = y => S.chain(inner => inner.sort(compareIgnoringMultiLine))(y);

  return S.compose(S.chain(sortConcat))(bucketify)(imports);
};
'use strict';

const S = require('sanctuary');

const { commentRegex } = require('../lib/regex');

// groupByComments :: Array String -> Array String
module.exports.groupByComments = importLines => {
  // return null

  return importLines.reduce((acc, curr) => {
    const last = S.last(acc);
    if (curr.trim() === '') {
      return acc;
    }
    // maybeIsComment :: Maybe String -> Boolean
    const maybeIsComment = mStr => S.fromMaybe(false)(S.map(x => commentRegex.test(x))(mStr));
    // maybeHasNewline :: Maybe String -> Boolean
    const maybeHasNewline = mStr => S.fromMaybe(false)(S.map(x => x.includes('\n'))(mStr));

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
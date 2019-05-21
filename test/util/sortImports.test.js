'use strict';

const { sortImports } = require('../../util/sortImports');

describe('sortImports', () => {
  it('sorts a simple case (hasvar)', () => {
    const input = [`import something from './somewhere.js'`, 'import "./anotherPlace"'];
    expect(sortImports(input)).toEqual(input);
  });
  it('sorts a simple case (hasVar2)', () => {
    const input = ['import "./anotherPlace.js"', `import something from './somewhere'`];

    expect(sortImports(input)).toEqual(input.reverse());
  });
  it('sorts a simple case (isFromFile)', () => {
    const input = [`import something from 'somewhere'`, 'import "./anotherPlace.js"'];
    expect(sortImports(input)).toEqual(input);
  });
  it('sorts a simple case (isFromFile case 2)', () => {
    const input = ['import "./anotherPlace.js"', `import something from 'somewhere'`];
    expect(sortImports(input)).toEqual(input.reverse());
  });
  it('sorts regardless of quotation type', () => {
    const input = ['import zthing from `./somewhere`', `import something from './somewhere'`, 'import aThing from "./anotherPlace"'];
    expect(sortImports(input)).toEqual(input.reverse());
  });
  it('sorts a case with comments (case 1)', () => {
    const input = ['import something', '// a comment \nimport anotherThing'];
    expect(sortImports(input)).toEqual([input[1], input[0]]);
  });
  it('sorts a case with comments (case 2)', () => {
    const input = ['// a comment \nimport something', 'import aThing'];
    expect(sortImports(input)).toEqual(input.reverse());
  });
  it('sorts React and proptypes correctly', () => {
    const input = [
      `import something from './somewhere.js'`,
      'import React, {Component} from "react"', // 1
      `import PropTypes from 'prop-types'` // 0
    ];
    expect(sortImports(input)).toEqual(input.reverse());
  });
  it('sorts a complex case (case 1)', () => {
    const input = [
      `import something from './somewhere.js'`, // 4
      '// This is not a valid import\n// Another comment line\nimport anotherThing from "anotherPlace.js"', // 3
      'import React, {Component} from "react"', // 2
      `import PropTypes from 'prop-types'`, // 1
      'import $ from "jquery"', // 0
      `import './backticks.scss'`, // 5
      '// This is not a valid import\nimport `./mythings.js`' // 6
    ];
    expect(sortImports(input)).toEqual([input[4], input[3], input[2], input[1], input[0], input[5], input[6]]);
  });
});
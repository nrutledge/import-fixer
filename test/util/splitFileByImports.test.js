const { splitFileByImports} = require('../../util/splitFileByImports');


describe('splitFileByImports', () => {
  const testArray1 = [`import React, { Compnent } from 'react';`, `class MyComponent extends Component {`];

  const testArray2 = [
    `import React, { Compnent } from 'react';`,
    `// I have no idea what I am doing...`,
    `import something from 'something`,
    ``,
    `class MyComponent extends Component {`
  ];

  it('empty file', () => {
    expect(splitFileByImports([''])).toEqual({ imports: [''], body: [] });
  });

  it('single import', () => {
    expect(splitFileByImports(testArray1)).toEqual({
      imports: [testArray1[0]],
      body: [testArray1[1]]
    });
  });

  it('multiple imports with comment and white space', () => {
    expect(splitFileByImports(testArray2)).toEqual({
      imports: testArray2.slice(0, 4),
      body: [testArray2[4]]
    });
  });
});
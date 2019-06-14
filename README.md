# What is it: A CLI tool that analizes import statements and orders them

## Files to parse

- Default:single file
- Feature- blob matching for a list of files
- Import statement sort options
- Default: external libraries A-Z, internal modules A-Z, Classes first (based on capitalization),modules that do not bind a variable list, single empty line at the bottom.
- Feature- custom sort option
- Module types/languages
  Default: es6 modules
  Feature: commonjs
- Output
  Default stdout
  Feature overwrite option
- Tooling -
  typescript
  eslint
  compiling to executable OR making it behave like command line through npm link
  npm publish
  improve error handling
  prune unused dependancies
  docs/examples

## Potential Bugs/edge cases

- common JS dynamic imports with arguments that depend on each other
- ‘Use strict’
- Preserve ordering of comments
- Long imports that span multiple lines
- Block comments in imports

Example api: importlint index.js

## Workflow

- Check that the file exists
- read into memory
- Divide import statements from code
- Group lines
- Sort groups (recusive)
- Turn sorted structure back to a string
- Append sorted import string to code
- output

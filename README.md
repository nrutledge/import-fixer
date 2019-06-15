# importlint

## What is it?

A CLI tool that analyzes import statements and orders them according to the following:
- External libraries first, then Internal modules
- By assigned variable name: A-Z, a-z (Classes first, based on capitalization). Modules that do not bind a variable such as css imports come last

## Usage

Provide a filepath to be linted. 

**Example:** `importlint ./path/to/myfile.js`

Outputs to standard output with linted file. This can be piped over the target file in bash as shown:

**Output to new file:**
`importlint ./path/to/myfile.js > ./path/to/newfile.js`

**Output to same file:**
`importlint ./path/to/myfile.js > ./.tmp ; cp ./.tmp ./path/to/myfile.js ; rm ./.tmp;`

**WARNING:** Do not use first command to pipe to the same file -- it will overwrite it with an empty file.

Note: currently operates ONLY on es2015 style modules (`import...`), does not operate on commonJS modules(`require...`)

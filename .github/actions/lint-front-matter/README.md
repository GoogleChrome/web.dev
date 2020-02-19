# lint-front-matter

A hopefully extensible system for adding custom YAML front matter checks.
This action will do separate linter passes for:
- All files
- Added files
- Modified files

## Adding a new rule

1. Write a function in the `./rules` directory that accepts:
  - The path to the file being linted.
  - The yaml front matter from the file.
  - An array of failures.
2. If your rule fails, push a new failure message into the failures array.
3. The `./linters` directory contains functions which lint all files, or only
   added or modified files. Add your new rule to the linter pass(es) that make
   sense.
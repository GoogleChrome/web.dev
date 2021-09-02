---
layout: pattern-set
title: Example PatternSet
description: Example set of patterns
hero: image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dYAbN2LdttJ1qYk1gssh.svg
draft: true
---

## Oveview

Code pattern is a snippet of code, representing a solution to a typical problem.
Patterns are organized as follows: `/patterns/PatternSuite/PatternSet/Pattern`

To create a new pattern:
1. Add a new directory in a chosen
`PatternSuite` or `PatternSet` folder. The directory name becomes the ID
of the pattern. For example, for a pattern in
`/patterns/some-suite/my-pattern/` the pattern ID is `some-suite/my-pattern`.
1. Add the following files to the directory:

```text
site/content/en/patterns/SomePatternSuite/
  |-- pattern-name/
          |-- index.md
          |-- demo.md
          |-- assets/
                    |--some-asset.ext
```

### `index.md`

The overview and the description of the pattern.

YAML front matter must contain `layout` and `title`.

  ```text
  ---
  layout: pattern
  title: Example Pattern
  ---
  ```

### `demo.md`

The demo.

YAML front matter must contain `patternId`.
Leave the content blank if you want to build the demo out of `body.html`,
CSS and JS files included in `assets`.
 
For different kinds of demos, see the examples below.

### `assets` directory

Assets directory can contain one or more files named `asset-name.ext`,
such as `style.css` or `script.js`.

Each file is displayed as a tab in samples area of the code pattern.
 
The file extension is the label of the tab with the sample. For example, the tab
displaying `style.css` is labeled `CSS`.

- If the file name is `body.html`, it will be used as the body for the demo.
- `*.css` files get included in the `<head>` of the demo.
- `*.js` files get included at the end of the body of the demo.

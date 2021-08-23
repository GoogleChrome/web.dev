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
  * leave the content blank if you want to build the demo out of *body.html*,
  *css* and *js* files included in assets
  * for different kinds of demos, see the examples below

* **assets** directory:
  * 1+ files named `asset-name.ext`, e.g. *style.css*
  * Each file is displayed as a tab in samples area of the CodePattern
  * `ext` becomes the label of the tab with the sample
  * if the file name is `body.html`, it will be used as the body for the demo
  * `*.css` files get included in the `<head>` of the demo
  * `*.js` files get included at the end of the body of the demo

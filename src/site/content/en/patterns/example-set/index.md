---
layout: pattern-set
title: Example PatternSet
description: Example set of patterns
hero: image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dYAbN2LdttJ1qYk1gssh.svg
draft: true
noindex: true
---

## Oveview

Code pattern is a snippet of code, representing a solution to a typical problem.
Patterns are organized as follows: "/patterns/PatternSuite/PatternSet/PatternName"

To create a new pattern:

1. Add a new directory in a chosen "PatternSuite" or "PatternSet" folder.
   The directory name becomes the ID of the pattern.
   For example, for a pattern in "/patterns/some-suite/my-pattern/" the pattern ID is "some-suite/my-pattern".

2. Add the following files to the directory:

```text
site/content/en/patterns/SomePatternSuite/
  |-+ SomePatternName/
    |-- index.md
    |-- demo.md
    |-+ assets/
      |--some-asset.ext
```

### "index.md""

The overview and the description of the pattern.

YAML front matter must contain `layout: pattern` and `title`.

```yaml
---
layout: pattern
title: Example Pattern
---
```

### "demo.md"

The actual demo that gets included via `<iframe>`.
YAML front matter must contain `patternId`.

You have two options for how to build the actual rendered HTML.

1. Include `layout: demo` in the front matter.
   By doing this, the demo will be built out of "body.html" and all CSS and JS files found in "assets".
   Most authors will want this!

2. Include the HTML you want to render, but _do not_ specify any `layout:`.
   (See the "Full HTML demo pattern" and "Image demo pattern", below.)

### "assets" directory

Assets directory can contain one or more files named "asset-name.ext",
such as "style.css" and "script.js"

Each file is displayed as a tab in samples area of the code pattern.

The file extension is the label of the tab with the sample. For example, the tab
displaying "style.css" is labeled **CSS**.

If `layout: demo` is specified, as it is in the default example pattern, then the demo HTML will be assembled by including "body.html" from this folder, as well as:

- "*.css" files get included in the `<head>` of the demo.
- "*.js" files get included at the end of the body of the demo.

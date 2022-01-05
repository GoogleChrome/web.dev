---
permalink: '/design-system/index.html'
title: 'Welcome to the web.dev design system'
layout: 'design-system-documentation.njk'
quickLinks:
  - title: 'Colors'
    url: '/design-system/colors'
    summary: 'All the available colors and guides for their usage'
  - title: 'Themes'
    url: '/design-system/colors/#theme-usage'
    summary: 'How the theming stying works and how to use it'
  - title: 'Typography'
    url: '/design-system/typography/'
    summary: 'Font sizes, the size scale and available fonts'
  - title: 'Spacing'
    url: '/design-system/spacing/'
    summary: 'The spacing scale and spacing utilities'
  - title: 'CSS Compositions'
    url: '/design-system/css-compositions/'
    summary: 'Flexible and skeletal compositional layouts that work site-wide'
  - title: 'Utilities'
    url: '/design-system/css-utilities/'
    summary: 'Flexible utilities that solve common UI problems'
  - title: 'CUBE CSS'
    url: 'https://cube.fyi/'
    summary: 'The CSS Methodology all of the CSS in this system uses'
  - title: 'Gorko CSS Framework'
    url: 'https://github.com/hankchizljaw/gorko'
    summary: 'Documentation for the CSS (Sass) framework that’s used in this design system'
---

<nav class="cluster" aria-label="key sections">
<a href="#for-developers">For developers</a>
<a href="#for-authors">For authors</a>
<a href="#about-the-css">About the CSS</a>
</nav>

{% Aside %}

This design system will help you to maintain consistency around the web.dev website by providing CSS structure, design tokens, typography rules and spacing rules, along with a comprehensive component library.

{% endAside %}

## Quick start

<div class="breakout">
<div class="auto-grid gap-top-size-2">
  {% for item in quickLinks -%}
  <a class="card flow bg-mid-bg" href="{{ item.url }}">
    <h3>{{ item.title }}</h3>
    <p>{{ item.summary }}</p>
  </a>
  {%- endfor %}
</div>
</div>

## For developers

This design system should be treated as the source of truth for **any** front-end development work that requires CSS.

### About the CSS

The design system is built around [CUBE CSS](https://cube.fyi/), a methodology that’s orientated towards simplicity and pragmatism. Versus the previous system on web.dev, a lot of CSS is declared as high up as possible—globally—rather than concentrated on complex BEM components.

The CSS is pre-processed using SCSS, which in turn, uses [Gorko](https://github.com/hankchizljaw/gorko) to provide structure, mixins and generated utility classes. The design system uses utilities regularly, so ensure you read up on [how Gorko generates them](https://github.com/hankchizljaw/gorko#utility-class-generator). They are [defined here](https://github.com/GoogleChrome/web.dev/blob/main/src/scss/_config.scss#L19).

Everything in CSS is powered by [design tokens](https://piccalil.li/tutorial/what-are-design-tokens/), which are [defined here](https://github.com/GoogleChrome/web.dev/blob/main/src/site/_data/design/tokens.json). The design tokens mainly define colors, fonts, spacing, sizes, transitions and decorative elements, such as border radius.

Lastly, the whole design system is **theme-driven**. This means that tokens are applied to contexts, rather than directly to elements. This makes working with dark/light themes much easier with less authored code. [Read more in the color section](/design-system/colors/#theme-usage).

### SCSS file and folder structure

The structure is as follows:

```plaintext
src
└── scss
    ├── blocks
    ├── compositions
    ├── functions
    ├── mixins
    ├── pages
    ├── utilities
    ├── web-components
    ├── _config.scss
    ├── _fonts.scss
    ├── _reset.scss
    ├── _rollout.scss
    ├── _themes.scss (generated)
    ├── _tokens.scss (generated)
    └── next.scss
```

The Sass folder mostly resembles the CUBE CSS structure and is as follows:

1. `blocks`: [contained components](https://cube.fyi/block.htm)
2. `compositions`: [layout compositions](/design-system/css-compositions/)
3. `functions`: Sass functions used across the SCSS files
4. `mixins`: Sass mixins used across the SCSS files
5. `pages`: specific styles for pages and page types
6. `utilities`: [core utilities](/design-system/css-utilities/)
7. `web-components`: styles for [specific web-components](https://github.com/GoogleChrome/web.dev/tree/main/src/lib/components)
8. `_config.scss`: core [Gorko configuration](https://github.com/andy-piccalilli/gorko#configuration)
9. `_fonts.scss`: `@font-face` declarations
10. `_reset.scss`: a [lightweight CSS reset](https://piccalil.li/blog/a-modern-css-reset/)
11. `_rollout.scss`: Temporary styles to provide a bridge between the old system and new system while the new system is rolled out
12. `_themes.scss`: an auto-generated file by `src/site/_data/design/themes.js`
13. `_tokens.scss`: an auto-generated file by `src/site/_data/design/tokens.js`
14. `next.css`: the main SCSS file that pulls everything together and defines [global CSS](https://cube.fyi/css.html)

## For authors

Please use the same [component guide in the handbook](/handbook/web-dev-components/) as always.

## How to use the pattern/component generator

To prevent repetitive file creation, you can use the pattern generator to create a new pattern, or pattern's variant with a npm task.

### Example

Let's say you want a new pattern called "my-pattern":

```bash
npm run patterns:create -- -p my-pattern -n my-pattern -t My\ Pattern
```

This will create the following folder and file structure:

```plaintext
web.dev
└── src/
    └── component-library/
        └── my-pattern/
            ├── my-pattern.njk
            ├── my-pattern.json
            └── my-pattern.md
```

Let's you want to create a variant of "my-pattern":

```bash
npm run patterns:create -- -p my-pattern/variants -n my-pattern-primary -t Primary
```

It'll result in this structure:

```plaintext
web.dev
└── src/
    └── components/
        └── patterns/
            └── my-pattern/
                ├── my-pattern.njk
                ├── my-pattern.json
                ├── my-pattern.md
                └── variants/
                    ├── my-pattern-primary.njk
                    └── my-pattern-primary.json
```

### Arguments

There are 2 required arguments to pass in—`-p` and `-n`. The rest are optional.

{% Aside %}

Make sure you add the `--` _after_ `npm run patterns:create` so the arguments get passed into the task.

Also make sure you escape spaces with a `\`.

{% endAside %}

- `-p` is the path from `src/components/patterns`
- `-n` is the file name
- `-t` is the title. If this is not set, the `-n` will be used
- `-sm` allows you to skip markup being generated if you are generating a variant

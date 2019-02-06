# web.dev

[![Build Status](https://travis-ci.org/GoogleChrome/web.dev.svg?branch=master)](https://travis-ci.org/GoogleChrome/web.dev)

web.dev is the ultimate resource for developers of all backgrounds to learn,
create, and solve on the web. It's meant to not only educate developers, but
help them apply what they've learned to any site they work on, be it personal or
business.

Note: this repo contains the written content for web.dev. The actual front-end
(CSS,JS) is not yet open source.

## Development

```shell
git clone https://github.com/GoogleChrome/web.dev.git
```

Install the deps:

```shell
npm ci
```

Build the page templates:

```shell
npm run build
```

Build JS/CSS:

```shell
npm run dev
```

## New stuff

- Removed most of gulp, except for the linter
- Removed the puppeteer server — Our goal is to preview locally 💪
- Added `src/` which contains script and styles
- Added [LitElement](https://lit-element.polymer-project.org)
  - Added fancy TypeScript decorators to DRY up custom element code.
    Take a look at `src/components/web_progress_bar/`.
- Added example SCSS in `src/styles/`
- Added [webpack](https://webpack.js.org/) 😈

## Found a bug?

You can file an issue [in our issue tracker](https://github.com/GoogleChrome/web.dev/issues)
and a team member should reply shortly.

## Want to help?

Take a look [in the issue tracker](https://github.com/GoogleChrome/web.dev/issues)
for any bugs with a **content** label.

[Our wiki](https://github.com/GoogleChrome/web.dev/wiki) provides guides on
authoring guides and codelabs.

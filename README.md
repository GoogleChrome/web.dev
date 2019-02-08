# web.dev

[![Build Status](https://travis-ci.org/GoogleChrome/web.dev.svg?branch=master)](https://travis-ci.org/GoogleChrome/web.dev)

web.dev is the ultimate resource for developers of all backgrounds to learn, create, and solve on the web. It's meant to not only educate developers, but help them apply what they've learned to any site they work on, be it personal or business.

Note: this repo contains the written content for web.dev. The actual front-end
(CSS,JS) is not yet open source.

## Authoring content

[Our wiki](https://github.com/GoogleChrome/web.dev/wiki) provides docs on authoring guides and codelabs.

## Development

```shell
git clone https://github.com/GoogleChrome/web.dev.git
```

Install the deps:

```shell
yarn
```

### Previewing the site

To create/edit content and preview a page locally as you make edits, start the "preview server":

```shell
 yarn dev
```

This also runs `gulp watch` which rebuild pages as you make edits.

Next,  open `http://localhost:8080/` to see the site locally. The preview server
allows you to see how the content will look on the production site, but it's
not a true staging server. For example, features like search and JS components
may not work or be entirely broken on the local preview.

### Running the tests

The preview server has tests to verify that pages render locally.

```shell
yarn test
```

## Found a bug?

You can file an issue [in our issue tracker](https://github.com/GoogleChrome/web.dev/issues) and a team member should reply shortly.

## Want to help?

Take a look [in the issue tracker](https://github.com/GoogleChrome/web.dev/issues) for any bugs with a **content** label.

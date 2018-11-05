Thie repo contains content and build scripts for [web.dev](https://web.dev).

## Authoring Guide

### Codelabs

Use [the ImageMin CLI codelab as an example](https://github.com/GoogleChrome/web.dev/blob/master/content/path/fast/use-imagemin-to-compress-images/codelab-imagine-cli.md).

- When you first mention a Glitch panel or button, put its name in bold, followed by a screenshot. You can use `<web-screenshot>` ([preview](https://glitch.com/edit/#!/web-screenshot)) to add the screenshot.

Example:
```
- Click the **Status** button.

<web-screenshot type="status"></web-screenshot>

- Click the **Console** button. This will open a new window.

<web-screenshot type="console"></web-screenshot>
```

## Usage

To get started, clone this repo and run `yarn` (or `npm`).

Run the build command to generate output files for [DevSite](https://developers.google.com) into `build/`:

```bash
yarn build                  # builds everything
yarn build content/*.md     # for specific files
yarn build -r content/test  # recursive
```

Warnings will cause the build command to fail, but output typically still be generated.
For more information on the build system (such as how to write build steps), [see the docs](./lib/).

### Internal Users

Googlers may use the `deploy` command to deploy changed files to the internal staging environment.
Contact the web.dev team for more information.

## Staging

web.dev currently has no public staging environment.

Thie repo contains content and build scripts for [web.dev](https://web.dev).

## Authoring Guide

### Guides

Tips:

- Use sentence case throughout, i.e. "Measure web performance", instead of "Measure Web Performance".
- Use `<pre class="prettyprint">` and escape HTML to make fancy code blocks:

```html
<pre class="prettyprint">
<s>&lt;div&gt;I am old busted&lt;/div&gt;</s>
<strong>&lt;div&gt;I am new hotness&lt;/div&gt;</strong>
</pre>
```

- Use `<pre class="devsite-terminal devsite-click-to-copy">` to wrap terminal commands. This'll insert a `$`.
- Put notes in `<div class="aside note">`. We also support `.caution`, `.warning`, `.success`.

### Codelabs

Use the ImageMin CLI codelab as an example—[source](https://github.com/GoogleChrome/web.dev/blob/master/content/fast/use-imagemin-to-compress-images/codelab-imagine-cli.md), [preview](https://web.devsite.corp.google.com/fast/use-imagemin-to-compress-images/codelab-imagine-cli).

- When you first mention a Glitch panel or button, put its name in bold, followed by a screenshot. You can use `<web-screenshot>` ([preview](https://glitch.com/edit/#!/web-screenshot)) to add the screenshot.

Example:
```
- Click the **Status** button. # Always put a newline between the list and the element.

<web-screenshot type="status"></web-screenshot> # Remember to close the element!

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

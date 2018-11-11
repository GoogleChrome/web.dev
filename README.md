Thie repo contains content and build scripts for [web.dev](https://web.dev).

## Want to help?

Pitch in on one of the docs fixups!

- [Fast Docs Fixup](https://github.com/GoogleChrome/web.dev/milestone/1)
- [Discoverable Docs Fixup](https://github.com/GoogleChrome/web.dev/milestone/10)
- [Reliable Docs Fixup](https://github.com/GoogleChrome/web.dev/milestone/12)

In general we need folks to read through all of the docs in a learning path, and fix any markdown issues or style issues they come across. See style notes below in [the Authoring Guide section](https://github.com/GoogleChrome/web.dev#authoring-guide).

## Writing on web.dev

The site has two main content types: **guides** and **codelabs**.


A guide is any written post or tutorial. For example:

![image](https://user-images.githubusercontent.com/1066253/48244806-5aa58380-e39c-11e8-9e84-9ced3d1e97c5.png)

---


A codelab is a step-by-step coding exercise, paired with an embedded Glitch editor. For example:

![image](https://user-images.githubusercontent.com/1066253/48244753-16b27e80-e39c-11e8-92b9-016e17867ba4.png)

---

### Guides

Every subfolder of a learning path should contain a single `index.md`. That markdown file is where your guide lives, and the sub-directory gives it its URL. For example:

```
# Produces the URL: https://web.dev/fast/avoid-invisible-text
/fast/avoid-invisible-text/index.md
```

Tips:

- If you want your image to be 100% width, just make sure it's >735px. Then Devsite will handle compressing it, and creating variations for `srcset`.
- Use sentence case throughout, i.e. "Measure web performance", instead of "Measure Web Performance".
- Key commands should look like 👉 "Open the DevTools by pressing `CMD + OPTION + i` / `CTRL + SHIFT + i`."
- Use `<pre class="prettyprint">` and escape HTML to make fancy code blocks:

```html
<pre class="prettyprint">
<s>&lt;div&gt;I am old busted&lt;/div&gt;</s>
<strong>&lt;div&gt;I am new hotness&lt;/div&gt;</strong>
</pre>
```

- Use `<pre class="devsite-terminal devsite-click-to-copy">` to wrap terminal commands. This'll insert a `$`.
- Put notes in `<div class="aside note">`. We also support `.caution`, `.warning`, `.success`.
- Many images just use markdown but you can also use the Web Fundamentals approach of figure/figcaption:
```
<figure>
  <img src="/apps-script/images/alert.png"
       alt="Alert dialog" class="screenshot">
  <figcaption><b>Figure 1</b>: Alert dialog</figcaption>
</figure>
```

### Codelabs

To create a codelab, add a markdown file to a content subdirectory and name it anything other than `index.md`.

Use the ImageMin CLI codelab as an example to emulate—[source](https://github.com/GoogleChrome/web.dev/blob/master/content/fast/use-imagemin-to-compress-images/codelab-imagine-cli.md), [preview](https://web.devsite.corp.google.com/fast/use-imagemin-to-compress-images/codelab-imagine-cli).

- When you first mention a Glitch panel or button, put its name in bold, followed by a screenshot. You can use `<web-screenshot>` ([preview](https://glitch.com/edit/#!/web-screenshot)) to add the screenshot.

Example:
```
- Click the **Remix This** button to make the project editable.

<web-screenshot type="remix"></web-screenshot> # Remember to close the element!

- Click the **Status** button.

<web-screenshot type="status"></web-screenshot>

- Click the **Console** button.

<web-screenshot type="console"></web-screenshot>
```

- Most codelabs should start with an instruction for the user to Click the **Remix This** button, followed by `<web-screenshot type="remix"></web-screenshot>`

## Staging

https://web.devsite.corp.google.com

## Build it yourself!

Note—**this requires access to google3**.

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

To preview changes to templates, it's easiest to edit the file in g3, and then stage the cl:

```
devsite2 stage --cl=<CL_NUM>
```

Once things look good, upstream your template changes here in Github.

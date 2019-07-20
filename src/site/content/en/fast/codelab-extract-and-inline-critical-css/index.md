---
layout: codelab
title: Extract and inline critical CSS with Critical
authors:
  - mihajlija
description: |
  Learn how use Critical to extract and inline critical CSS, and improve render times.
glitch: critical-css-starter
date: 2019-05-29
related_post: extract-critical-css
---

Whether you use a UI library or handcraft your styles, shipping a significant amount of CSS delays rendering because the browser must download and parse CSS files before it can show the page.

This responsive ice cream gallery is built with [Bootstrap](https://getbootstrap.com/). UI libraries like Bootstrap speed up the development, but that often comes at the expense of bloated and unnecessary CSS which can slow down your load times. Bootstrap 4 is 187 KB, while [Semantic UI](https://semantic-ui.com/), another UI library, is a whopping 730 KB uncompressed. Even when minified and gzipped, Bootstrap still weighs around 20 KB, well over the [14 KB threshold](/extract-critical-css/#14KB) for the first roundtrip.

[Critical](https://github.com/addyosmani/critical) is a tool that extracts, minifies and inlines [above-the-fold](/extract-critical-css) CSS. This allows above-the-fold content to be rendered as soon as possible, even if CSS for other parts of the page has not yet loaded. In this codelab, you'll learn how to use Critical's npm module. 

## Measure

To preview the site, mouse over the editor and press the **View App** button.

To run a Lighthouse audit on this site:

1. Press **Control+Shift+J** or **Command+Option+J** (Mac) to open DevTools.

2. Click the **Audits** tab.

3. Make sure the **Mobile** radio button is selected.

4. Make sure the **Performance** checkbox is enabled. You can disable the rest of the checkboxes in the Audits section.

5. Make sure the **Simulated Fast 3G, 4x CPU Slowdown** radio button is selected.

6. Make sure that the **Clear Storage** checkbox is enabled. With this option selected, Lighthouse will not load resources from the cache, which simulates how first-time visitors would experience the page.

7. Click **Run Audits**.

![Audits panel of Chrome DevTools, powered by Lighthouse](lighthouse-audits.png)

When you run an audit on your machine, the exact results may vary, but in the filmstrip view, you'll notice the app has a blank screen for quite a while before finally rendering the content. This is why [First Contentful Paint](https://web.dev/first-contentful-paint/) (FCP) is high and why overall performance score is not great.

<img src="lighthouse-audit-before.png" alt='Lighthouse audit showing performance score of 84, FCP 3 seconds and a filmstrip view of loading the app' class="w-screenshot">

Lighthouse is here to help you fix performance issues, so look for solutions in the **Opportunities** section. **Eliminate render-blocking resources** is listed as an opportunity and that's where Critical shines!


<img src="eliminate-render-blocking-resources.png" alt='Lighthouse audit "Opportunities" section listing "Eliminate render-blocking resources"' class="w-screenshot">

## Optimize

Click the **Remix to Edit** button to make the project editable.

To speed things up, Critical is already installed and an empty configuration file is included in the codelab.

In the configuration file `critical.js`, add a reference to Critical and then invoke the `critical.generate()` function. This function accepts an object containing the configuration.

```js
const critical = require('critical');

critical.generate({
	// configuration
},(err, output) => {
  if (err) {
    console.error(err);
  } else if (output) {
    console.log('Generated critical CSS');
  }
});
```

Error handling isn't mandatory, but it's an easy way to gauge the operation success in the console.

### Configure Critical

The table below contains some useful Critical options. You can check out all of the [available options on Github](https://github.com/addyosmani/critical#usage).

<table>
    <th>Option</th>
    <th>Type</th>
    <th>Explanation</th>
  <tr>
    <td><code>base</code></td>
    <td>string</td>
    <td>The base directory for your files.</td>
  </tr>
  <tr>
    <td><code>src</code></td>
    <td>string</td>
    <td>HTML source file.</td>
  </tr>
  <tr>
    <td><code>dest</code></td>
    <td>string</td>
    <td>The target for the output file. If CSS is inlined the output file is HTML. If not, the output is a CSS file.</td>
  </tr>
  <tr>
    <td><code>width</code>, <code>height</code></td>
    <td>numbers</td>
    <td>Viewport width and height in pixels.</td>
  </tr>
  <tr>
    <td><code>dimensions</code></td>
    <td>array</td>
    <td>Contains objects with width and height properties. These objects represent the viewports you want to target with above-the-fold CSS. If you have media queries in your CSS, this allows you to generate critical CSS that covers multiple viewport sizes.</td>
  </tr>
  <tr>
    <td><code>inline</code></td>
    <td>boolean</td>
    <td>When set to true, the generated critical CSS is inlined in the <head> of the HTML source file.</td>
  </tr>
  <tr>
    <td><code>minify</code></td>
    <td>boolean</td>
    <td>When set to true, Critical minifies the generated critical CSS. Can be omitted when extracting critical CSS for multiple resolutions because Critical automatically minifies it to avoid duplicate rule inclusion.</td>
  </tr>
</table>


Below is a configuration example for extracting critical CSS for multiple resolutions. Add it to `critical.js` or play around and tweak the options.

```js/1-14/
critical.generate({
  base: 'public/',
  src: './index.html',
  dest: './index.html',
  inline: true,
  dimensions: [
    {
      height: 500,
      width: 300,
    },
    {
      height: 720,
      width: 1280,
    },
  ]
}, (err, output) => {
  if (err) {
    console.error(err);
  } else if (output) {
    console.log('Generated critical CSS');
  }
});
```

In this example, `index.html` is both the source file and the destination file because the `inline` option is set to true. Critical first reads the HTML source file, extracts critical CSS and then overwrites `index.html` with critical CSS inlined in the `<head>`.

`dimensions` array has two viewport sizes specified: 300 x 500 for extra small screens and 1280 x 720 for standard laptop screens.

`minify` option is omitted because Critical automatically minifies the extracted CSS when there are multiple viewport sizes specified.

### Run Critical

Add Critical to your scripts in `package.json`:

```js/2-2/
scripts: {
    "start": "node server.js",
    "critical": "node critical.js"
  }
```

Click **Tools** > **Logs** > **Console**.

To generate critical CSS, in the console, run:

```
npm run critical
refresh
```

<figure class="w-figure">
  <img src="console-success.png" alt='Success message saying "Generated critical CSS" in the console]()' style="max-width: 243px">
  <figcaption class="w-figcaption">Success message in the console</figcaption>
</figure>

{% Aside 'note' %}
Glitch console and editor don't automatically sync, so `refresh` command is neccessary to update the editor with files generated from the console.
{% endAside %}

Now in the `<head>` tag of `index.html`, generated critical CSS is inlined between `<style>` tags, followed by a script that loads the rest of the CSS asynchronously.

<figure class="w-figure">
  <img src="inline-critical-css.png" alt="index.html with inlined critical CSS" class="w-screenshot">
  <figcaption class="w-figcaption">Inlined critical CSS</figcaption>
</figure>

## Measure again

Follow the steps from the beginning of the codelab to run Lighthouse performance audit again. The results you get will look similar to this:

 <img src="lighthouse-audit-after.png" alt='Lighthouse audit showing performance score of 100, FCP 0.9 seconds and improved filmstrip view of loading the app' class="w-screenshot">

{% Aside 'success' %}
The filmstrip view shows that content is rendered much sooner and this is reflected in improved paint metrics. And "Eliminate render-blocking resources" has been eliminated! 🎉
{% endAside %}

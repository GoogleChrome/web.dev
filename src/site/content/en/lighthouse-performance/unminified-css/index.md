---
layout: post
title: Minify CSS
description: |
  Learn about the unminified-css audit.
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - unminified-css
---

The Opportunities section of your Lighthouse report lists
all unminified CSS files,
along with the potential savings in [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte)
when these files are minified:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/C1ah0bnY6JQsffdO446S.png", alt="A screenshot of the Lighthouse Minify CSS audit", width="800", height="212", class="w-screenshot" %}
</figure>


## How minifying CSS files can improve performance

Minifying CSS files can improve your page load performance.
CSS files are often larger than they need to be. For example:

```css
/* Header background should match brand colors. */
h1 {
  background-color: #000000;
}
h2 {
  background-color: #000000;
}
```

Can be reduced to:

```css
h1, h2 { background-color: #000000; }
```

From the perspective of the browser,
these 2 code samples are functionally equivalent,
but the second example uses less bytes.
Minifiers can further improve byte efficiency by removing whitespace:

```css
h1,h2{background-color:#000000;}
```

Some minifiers employ clever tricks to minimize bytes.
For example, the color value `#000000` can be further reduced to `#000`,
which is its shorthand equivalent.

Lighthouse provides an estimate of potential savings based
on the comments and whitespace characters that it finds in your CSS.
This is a conservative estimate.
As mentioned earlier,
minifiers can perform clever optimizations (such as reducing `#000000` to `#000`)
to further reduce your file size.
So, if you use a minifier,
you may see more savings than what Lighthouse reports.

## Use a CSS minifier to minify your CSS code

For small sites that you don't update often,
you can probably use an online service for manually minifying your files.
You paste your CSS into the service's UI, and it returns a minified version of the code.

For professional developers,
you probably want to set up an automated workflow that minifies your CSS automatically
before you deploy your updated code.
This is usually accomplished with a build tool like Gulp or Webpack.

Learn how to minify your CSS code in [Minify CSS](/minify-css).

## Stack-specific guidance

### Drupal

Enable **Aggregate CSS files** in **Administration** > **Configuration** >
**Development**. You can also configure more advanced aggregation options
through [additional
modules](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=im_vid_3%3A123&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=css+aggregation&solrsort=iss_project_release_usage+desc&op=Search)
to speed up your site by concatenating, minifying, and compressing your CSS
styles.

### Joomla

A number of [Joomla
extensions](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=performance)
can speed up your site by concatenating, minifying, and compressing your css
styles. There are also templates that provide this functionality.

### Magento

Enable the [**Minify CSS Files** option](https://devdocs.magento.com/guides/v2.3/performance-best-practices/configuration.html?itm_source=devdocs&itm_medium=search_page&itm_campaign=federated_search&itm_term=minify%20css%20files)
in your store's Developer settings.

### React

If your build system minifies CSS files automatically, ensure that you are
deploying the [production
build](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build)
of your application. You can check this with the React Developer Tools
extension.

### WordPress

A number of [WordPress
plugins](https://wordpress.org/plugins/search/minify+css/) can speed up your
site by concatenating, minifying, and compressing your styles. You may also want
to use a build process to do this minification up-front if possible.

## Resources

- [Source code for **Minify CSS** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/unminified-css.js)
- [Minify CSS](/minify-css)
- [Minify and compress network payloads](/reduce-network-payloads-using-text-compression)

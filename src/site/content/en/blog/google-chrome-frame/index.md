---
layout: post
title: Rendering HTML5 in older browsers with Google Chrome Frame
authors:
  - malteubl
date: 2011-05-30
tags:
  - blog
---

{% Aside %}
**Update June 2013:** Google is winding down Chrome Frame, and plans to cease support and updates to it in January 2014. Please read the [Chromium blog post](http://blog.chromium.org/2013/06/retiring-chrome-frame.html) for more information. For guidance on what you need to know as a developer, please read the [developer FAQ for Chrome Frame](https://developers.google.com/chrome/chrome-frame/).
{% endAside %}

## Introduction
HTML5 adds a multitude of new awesome tools to the web developer toolbox, including the following:

- New, more powerful JavaScript APIs
- SVG for vector graphics
- Canvas for 2D and with WebGL 3D graphics
- CSS3 for rounded corners, gradients, etc.
- More expressive markup

This list is, of course, not comprehensive; the web platform
has moved forward massively, and the gap between old browsers and modern ones is widening every day.<br>
Every major desktop browser now supports significant parts of HTML5 in the latest version but old browsers sticking around create a challenge for adopting the latest and greatest features today.

[Google Chrome Frame](http://www.google.com/chromeframe) can help you build state-of-the-art HTML5 pages today while still enabling people using
older browsers to see your content. 

## What is Google Chrome Frame

Google Chrome Frame is a plugin for Internet Explorer that enables rendering the full browser canvas
using Google Chrome’s rendering engine. It supports all the HTML5 features that you find in Chrome
seamlessly integrated into the Internet Explorer user experience. Chrome Frame is available for
Internet Explorer 6, 7, 8, and 9. Chrome Frame is certainly more useful when supporting old browser such as
IE6-to-IE8 but if you, for example, require WebGL for your application, requiring Chrome Frame for IE9 users might
be useful as well.

HTML5 polyfills provide another way to smooth out the transition to newer browsers. Unfortunately,
they cannot emulate every feature, and they slow down your page in old browsers, which are already
slower that the new generation, even more.


Even if your site does not need HTML5 features, using Chrome Frame could still provide a better
user experience. For users who already have it installed, rendering is generally faster and they can
get access to features that are not supported in older browsers. You
can, of course, still decide to support old browsers for  users who do not have Chrome Frame on
their machine.

## Opting in

You can enable Chrome Frame to render a page by adding an HTML metatag or using an HTTP header. This is very important. It means no site will break
if a user has Chrome Frame installed, because the site is in full control of using the plugin or default
rendering. The following code snippets show how a site can opt into being rendered by Chrome Frame.

Option 1: HTTP-Header (you can add this to your [HTTP server (e.g. Apache) configuration)](http://www.chromium.org/developers/how-tos/chrome-frame-getting-started#TOC-Making-Your-Pages-Work-With-Google-): 

```http
X-UA-Compatible: chrome=1
```

Option 2: Meta-tag (Just paste this into your HTML `<head>` section)

```html
<meta http-equiv="X-UA-Compatible" content="chrome=1">
```

Once you have added either one of these to your site, pages are rendered using Chrome Frame if it is
installed on the user’s machine.

## Prompting for Google Chrome Frame

You may decide to fully deprecate support for old browsers for many reasons including the following:

- Your site requires modern features such as HTML5 video, canvas, WebGL, or CSS3
- Development time spent on old browsers is too high
- Speed up development time for new features

Chrome Frame might provide a strategy to continue giving users of old browsers a way to still use
your site.

Chrome Frame transmits that it is available by extending the host's User-Agent header with the string "chromeframe".
For more information see [Chrome Frame User Agent.](http://www.google.com/url?q=http%3A%2F%2Fwww.chromium.org%2Fdevelopers%2Fhow-tos%2Fchrome-frame-getting-started%2Funderstanding-chrome-frame-user-agent)

Use server-side detection to look for this token and determine whether Chrome Frame can be used for a page. If Chrome Frame is present, you can insert the required meta tag; if not, you can redirect users to a page that explains how to install Chrome Frame. As an alternative to server-side sniffing, you can use the CFInstall.js script to detect Chrome Frame and prompt users to install the plug-in without restarting their browsers. Using the script is straightforward. Just add the script tags and optional styles to your page as in the following example:

```html
<html>
<body>
<script type="text/javascript"
src="http://ajax.googleapis.com/ajax/libs/chrome-frame/1/CFInstall.min.js"></script>

<style>
/*
CSS rules to use for styling the overlay:
    .chromeFrameOverlayContent
    .chromeFrameOverlayContent iframe
    .chromeFrameOverlayCloseBar
    .chromeFrameOverlayUnderlay
*/
</style>

<script>
// You may want to place these lines inside an onload handler
CFInstall.check({
mode: "overlay",
destination: "http://www.waikiki.com"
});
</script>
</body>
</html>
```

### Prompt yourself

You might also decide to build a landing page or layer yourself. Send users to this URL

[http://www.google.com/chromeframe/](http://www.google.com/chromeframe/)

which can be put in an IFRAME.

Append a redirect parameter to send users back to your site after installation is complete:

[http://www.google.com/chromeframe/?redirect=http://www.google.com/](http://www.google.com/chromeframe/?redirect=http://www.google.com/)
Instead of going to the Chrome Frame landing page, you could also send the users directly to the EULA thus saving one step in the installation process.
[http://www.google.com/chromeframe/eula.html](http://www.google.com/chromeframe/eula.html)

### No admin-rights needed

Users can install Chrome Frame without having administrative privileges on their machines.

Append the `user=true` parameter to enable user level installation of Chrome Frame, as in the following:

[http://www.google.com/chromeframe/?user=true](http://www.google.com/chromeframe/?user=true)

### Enterprise installation

Enterprises can deploy Chrome Frame company wide using the MSI installer which can be downloaded here:
[http://www.google.com/chromeframe/eula.html?msi=true](http://www.google.com/chromeframe/eula.html?msi=true).

For more information on Chrome and enterprise deployments see [http://www.chromium.org/administrators](http://www.chromium.org/administrators).

## Adoption

Many major websites such as [yahoo.com](http://yahoo.com), [wordpress.com](http://wordpress.com) and several Google properties have adopted Google
Chrome Frame. Besides giving their users access to a more modern web experience for many sites, Chrome Frame
also presents a significant improvement in initial load time. You can check whether Chrome Frame helps your
site get faster rendering by going to [webpagetest.org](http://webpagetest.org) and selecting Chrome Frame as the browser.

## More info

For more Information see the [Getting Started Guide](http://www.google.com/url?q=http%3A%2F%2Fwww.chromium.org%2Fdevelopers%2Fhow-tos%2Fchrome-frame-getting-started) or watch this video from Google IO 2011
{% YouTube id="3YkEUpJQP3o" %}

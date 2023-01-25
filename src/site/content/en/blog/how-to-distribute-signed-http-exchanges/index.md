---
layout: post
title: How to distribute Signed HTTP Exchanges (SXG) using nginx
subhead: How to get and serve SXG files using nginx, and the challenges of subresource prefetching.
authors:
  - kumagi
date: 2020-03-11
description: How to get and serve SXG files using nginx, and the challenges of subresource prefetching.
tags:
  - blog
  - SXG
  - nginx
feedback:
  - api
---

As a [Signed HTTP Exchanges (SXG)](https://developers.google.com/web/updates/2018/11/signed-exchanges) distributor, you can deliver SXG files on behalf of the original content creators. Web browsers that support SXG will display such SXG files as if they were delivered from the original content creators. This enables you to implement cross-site preloading without violating privacy. This guide shows you how to distribute SXG properly.

## Cross-browser support

Chrome is currently the only browser that supports SXG. See the Consensus & Standardization section of [Origin-Signed HTTP Exchanges](https://www.chromestatus.com/feature/5745285984681984) for more up-to-date information.

## Get SXG files

Specify in your `Accept` request header that you want the server to return an SXG file along with the request:

```bash
Accept: application/signed-exchange;v=b3,*/*;q=0.8
```

This guide assumes that you put your SXG files in `/var/www/sxg`.

## Serve a simple SXG file

Attach the following headers to distribute a single SXG file:

```text
Content-Type: application/signed-exchange;v=v3
X-Content-Type-Options: nosniff
```

Configure `nginx`:

```nginx
http {
    ...
    types {
        application/signed-exchange;v=b3  sxg;
    }
    add_header X-Content-Type-Options nosniff;

    location / {
        more_set_headers "Content-Type: application/signed-exchange;v=b3";
        alias /var/www/sxg/;
        try_files $uri.sxg $uri =404;
        autoindex off;
    }
    ...
```

Load the new configuration into `nginx`:

```bash
sudo systemctl restart nginx.service
```

`nginx` will start serving SXG files.
When Chrome accesses your server, the address of the original content publisher will appear in the bar!

## Prefetch subresources

Most web pages consist of multiple subresources, such as CSS, JavaScript, fonts, and images.
The content of SXG cannot be changed without the content creator's private key.
This causes problems when the browser tries to resolve subresources.

For example, suppose `index.html.sxg` from `https://website.test/index.html` has a link to `https://website.test/app.js`. When a user's browser receives the SXG file from `https://distributor.test/example.com/index.html.sxg`, it will find the link to `https://website.test/app.js`.
The browser can fetch `https://website.test/app.js` directly on actual access, but it should not be done in the preload phase to preserve privacy.
If the resource was fetched during the preload phase, it would be possible for the content creator (`website.test`) to be able to detect which content distributor (`distributor.test`) is requesting the resource.

{% Img src="image/admin/1wbVnJkocJ9cv3lR2wZv.png", alt="The link to app.js in distributor.test/index.html.sxg points to website.test/app.js.", width="800", height="214" %}

If the distributor wants to serve `app.js.sxg` from their own service and tries to modify `https://website.test/app.js` to be the distributor's version of that subresource (such as `https://distributor.test/website.test/app.js.sxg`), it will cause a signature mismatch and make the SXG invalid.

{% Img src="image/admin/IRRFoXyhnmwVXwiDgeny.png", alt="An attempt to link the reference to app.js in distributor.test/index.html.sxg to distributor.test/app.js causes a signature mismatch.", width="592", height="258" %}

To solve this problem, there's an experimental SXG subresource prefetching feature in Chrome now.
You can enable it at: `chrome://flags/#enable-sxg-subresource-prefetching`.
To use subresource prefetching the following conditions must be met:

- The publisher must embed a response header entry in SXG, such as: `link: <https://website.test/app.js>;rel="preload";as="script",<https://website.test/app.js>;rel="allowed-alt-sxg";header-integrity="sha256-h6GuCtTXe2nITIHHpJM+xCxcKrYDpOFcIXjihE4asxk="`. This specifies the subresource that can be substituted with the SXG's specific integrity hash.
- The distributor must attach a response header when serving the SXG, such as: `link: <https://distributor.test/website.test/app.js.sxg>;rel="alternate";type="application/signed-exchange;v=b3";anchor="https://website.test/app.js"`. This specifies the path of `app.js` and corresponds to the subresource.

{% Img src="image/admin/zsSl4DBys5jv8i5bQ6AT.png", alt="anchor", width="800", height="244" %}

The first one is relatively easy because [`nginx-sxg-module`](https://github.com/google/nginx-sxg-module) can calculate integrity hashes and embed them into link headers from upstream responses. But the second one is more difficult because the content distributor must be aware of the specified subresources in the SXG.

If there are no subresources other than `https://website.test/app.js`, then all you need to append in your nginx config is:

```nginx
add_header link <https://distributor.test/website.test/app.js.sxg>;rel="alter...
```
But such cases are rare because typical websites consist of a lot of subresources. Additionally, the distributor must attach the proper anchor link header when serving an SXG file. Currently, there is no easy way to resolve this issue, so stay tuned for updates!

## Send feedback

Chromium engineers are keen to hear your feedback on distributing SXG at [webpackage-dev@chromium.org](mailto:webpackage-dev@chromium.org).
You can also join [the spec discussion](https://github.com/WICG/webpackage/issues), or [report a bug](https://bugs.chromium.org/p/chromium/issues/entry?status=untriaged&components=Blink%3ELoader&labels=Type-Bug,Hotlist-SignedExchange) to the team.
Your feedback will greatly help the standardization process and also help address implementation issues.
Thank you!

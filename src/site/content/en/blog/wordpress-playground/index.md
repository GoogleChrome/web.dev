---
title: Build in-browser WordPress experiences with WordPress Playground and WebAssembly
subhead: The full WordPress powered by PHP running solely in the browser with WebAssembly
description: The full WordPress powered by PHP running solely in the browser with WebAssembly
authors:
  - adamzielinski
  - nattestad
date: 2023-04-12
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/gaEAYfVaiHsMEz07wZSn.jpg
alt: A developer with a WordPress t-shirt sitting in front of a computer.
tags:
  - blog
  - webassembly
---

When you first see [WordPress Playground](http://wasm.wordpress.net/), it seems
like an ordinary site–maybe except for the colorful background. It's anything
but. What you're actually looking at is an entire WordPress tech stack,
including PHP and a database, running directly in your browser.

In this post, Adam Zieliński (lead of WordPress Playground) and Thomas Nattestad
(Product Manager for V8) explore:

- How WordPress Playground can help you as a WordPress developer.
- How it works under the hood.
- What it means for the future of WordPress.

## Use WordPress without installation, embed it in your app, and even control it with JavaScript

You can use and customize the WordPress embedded at
[playground.wordpress.net](http://playground.wordpress.net/) for free. There's
no cloud infrastructure and support to pay for, because that site lives entirely
in your browser–no one else can visit it. It's also temporary. As soon as you
refresh the page, it's gone. You can get as many of these sites as you want for
prototyping, trying out plugins, and quickly exploring ideas.

You can even use them to test your code in different environments using the
built-in PHP and WordPress version switcher:

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/tVA8iwBfR187eUUwCLAL.png", alt="phpinfo page.", width="800", height="699" %}

WordPress Playground is an entirely new way of using WordPress. Its full power,
however, is only unlocked by including it in your app. The easy way is to embed
WordPress Playground in an `<iframe>` and configure it using the
[query parameters API](https://wordpress.github.io/wordpress-playground/pages/embedding-wordpress-playground-on-other-websites.html).
That's what the [official showcase](https://developer.wordpress.org/playground)
does. When you select, for example, the
[Pendant theme](https://wordpress.org/themes/pendant/) and the
[Coblocks plugin](https://wordpress.org/plugins/coblocks/), the embedded iframe
gets updated to point to
[https://playground.wordpress.net/?theme=pendant&plugin=coblocks](https://playground.wordpress.net/?theme=pendant&plugin=coblocks).

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/lPMfWljMKZbMluoN4971.png", alt="WordPress Playground showcase.", width="800", height="740" %}

The iframe is an easy way of getting started, but it's also limited to just the
basic configuration option. If you need more than that, there is another, more
powerful API.

### The WordPress Playground JavaScript client enables full control over the embedded site

You can control the entire WordPress site, including the filesystem and PHP,
using the full API available via the
[@wp-playground/client](https://www.npmjs.com/package/@wp-playground/client) npm
package. The following example shows to use it—check
[the interactive tutorial](https://adamadam.blog/2023/04/12/interactive-intro-to-wordpress-playground-public-api/)
for even more examples:

```js
import {
  connectPlayground,
  login,
  connectPlayground,
} from '@wp-playground/client';

const client = await connectPlayground(
  document.getElementById('wp'), // An iframe
  { loadRemote: 'https://playground.wordpress.net/remote.html' },
);
await client.isReady();

// Login the user as admin and go to the post editor:
await login(client, 'admin', 'password');
await client.goTo('/wp-admin/post-new.php');

// Run arbitrary PHP code:
await client.run({ code: '<?php echo "Hi!"; ?>' });

// Install a plugin:
const plugin = await fetchZipFile();
await installPlugin(client, plugin);
```

### Use WebAssembly PHP even without WordPress

WordPress Playground is not a monolith. WebAssembly PHP is released
independently from WordPress and you can use it separately as well. For the web,
you may use the [@php-wasm/web](https://www.npmjs.com/package/@php-wasm/web) npm
package optimized for a low bundle size, and in Node.js you can lean
on [@php-wasm/node](https://www.npmjs.com/package/@php-wasm/node) which provides
more PHP extensions. Adam used the former to add interactive PHP snippets
to [this WP_HTML_Tag_Processor tutorial](https://adamadam.blog/2023/02/16/how-to-modify-html-in-a-php-wordpress-plugin-using-the-new-tag-processor-api/).
Here's a sneak peek of how to use it:

```js
import { PHP } from '@php-wasm/web';
const php = await PHP.load('8.0', {
  requestHandler: {
    documentRoot: '/www',
  },
});

// Create and run a script directly
php.mkdirTree('/www');
php.writeFile('/www/index.php', `<?php echo "Hello " . $_POST['name']; ?>`);
php.run({ scriptPath: '/www/index.php' });

// Or use the familiar HTTP concepts:
const response = php.request({
  method: 'POST',
  relativeUrl: '/index.php',
  data: { name: 'John' },
});
console.log(response.text); // Hello John
```

At this point you must be thinking–_how does that even work?_ Great question!
Let's dive into the internals and find out. Buckle up!

## Under the hood, there's WebAssembly PHP, a SQL translator, and an in-browser server

### PHP runs as a WebAssembly binary

PHP doesn't just work in the browser out of the box. WordPress Playground
developed a
[dedicated pipeline](https://github.com/WordPress/wordpress-playground/blob/0d451c33936a8db5b7a158fa8aad288c19370a7d/packages/php-wasm/compile/Dockerfile)
to build [the PHP interpreter](https://github.com/php/php-src) to WebAssembly
using [Emscripten](https://emscripten.org/docs/porting/networking.html).
Building vanilla PHP isn't overly complex–it only takes
[adjusting a function signature here](https://github.com/WordPress/wordpress-playground/blob/0d451c33936a8db5b7a158fa8aad288c19370a7d/packages/php-wasm/compile/build-assets/php7.1.patch#L8-L9),
[forcing a config variable there](https://github.com/WordPress/wordpress-playground/blob/0d451c33936a8db5b7a158fa8aad288c19370a7d/packages/php-wasm/compile/Dockerfile#L495),
and applying
[a few small patches](https://github.com/WordPress/wordpress-playground/tree/0d451c33936a8db5b7a158fa8aad288c19370a7d/packages/php-wasm/compile/build-assets).
Here's how you can build it yourself:

```bash
git clone https://github.com/WordPress/wordpress-playground
cd wordpress-playground && npm install
# Below, you can replace "8.2" with any other valid PHP version number.
npm run recompile:php:web:8.2
```

However, vanilla PHP builds aren't very useful in the browser. As a server
software, PHP doesn't have a JavaScript API to pass the request body, upload
files, or populate the `php://stdin` stream. WordPress Playground had to build
one from scratch. The WebAssembly binary comes with a
[dedicated PHP API module](https://github.com/WordPress/wordpress-playground/blob/0d451c33936a8db5b7a158fa8aad288c19370a7d/packages/php-wasm/compile/build-assets/php_wasm.c)
written in C and a
[JavaScript PHP class](https://github.com/WordPress/wordpress-playground/blob/da38192af57a95699d8731c855b82ac0222df61b/packages/php-wasm/common/src/lib/php.ts) that
exposes methods like `writeFile()` or `run()`.

Because every PHP version is just a static `.wasm` file, the PHP version
switcher is actually pretty boring. It simply tells the browser to download, for
example, `php_7_3.wasm` instead of, say, `php_8_2.wasm`.

### Database is supported with a SQL translation layer

WordPress requires MySQL. However, there isn't a WebAssembly version of MySQL
you could run in the browser. WordPress Playground therefore ships PHP with the
[native SQLite driver](https://www.php.net/manual/en/ref.pdo-sqlite.php) and
leans on SQLite.

But how can WordPress run on a different database?

Behind the scenes, the official
[SQLite Database Integration](https://github.com/WordPress/sqlite-database-integration)
plugin intercepts all MySQL queries and rewrites them in SQLite dialect. The 2.0
release ships
[a new WordPress Playground-informed translation layer](https://github.com/WordPress/sqlite-database-integration/pull/9)
that allows WordPress on SQLite to pass 99% of the WordPress unit test suite.

### The web server lives inside the browser

In a regular WordPress, clicking on a link, say _Blog,_ would initiate an HTTP
request to the remote backend to fetch the `blog` page. However, WordPress
Playground has no remote backend. It has a
[Service Worker](https://developer.mozilla.org/docs/Web/API/Service_Worker_API)
that intercepts all the outgoing requests and passes them to an in-browser PHP
instance running in a separate
[Web Worker](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers).

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/EAYGDJ5cBGHFnQuFYjEw.png", alt="Flow diagram starting with an iframe pointing at the resource wp-admin, calls to which are intercepted by the service worker, rendered in the worker thread, and ultimately translated to a WordPress response by the in-browser server.", width="800", height="675" %}

### Networking is supported through WebSockets

When it comes to networking, WebAssembly programs are limited to calling
JavaScript APIs. It is a safety feature, but also presents a challenge. How do
you support low-level, synchronous networking code used by PHP with the
high-level asynchronous APIs available in JavaScript?

For WordPress Playground, the answer involves a WebSocket to TCP socket proxy,
[Asyncify](https://emscripten.org/docs/porting/asyncify.html), and patching deep
PHP internals like `php_select`. It's complex, but there's a reward. The
Node.js-targeted PHP build can request web APIs, install composer packages, and
even connect to a MySQL server.

## WordPress can be used in even more places than the browser

Since WordPress can now run on WebAssembly, you could also run it in a Node.js
server—it's the same V8 engine! Of course with StackBlitz you can also run
Node.js directly in the browser, meaning that you could run WordPress and PHP
compiled to WebAssembly, executing in Node.js, which is also compiled to
WebAssembly running
[in the browser](https://stackblitz.com/edit/node-zt3hpi?file=todo-list%2Fsrc%2Fedit.js).
WebAssembly is also exploding in popularity in the serverless space, and in the
future this could run on that infrastructure as well.

## The future may bring zero-setup, interactive, and collaborative WordPress apps

Imagine jumping straight into a code editor where you're free to just get
building right away, with all of the setup completed. You could even share a
simple link and start a multiplayer editing session, such as in Google Docs. And
when you're done, it would only take a single click to seamlessly deploy your
creations to a variety of hosting services–all without ever installing anything
locally!

And that's just a glimpse! We may see interactive tutorials, live plugin demos,
staging sites, decentralized WordPress on edge servers, and even building
plugins on your phone.

The future is exciting and you can be a part of it! Your ideas and contributions
are the oxygen of WordPress Playground. Visit
[the GitHub repository](https://github.com/WordPress/wordpress-playground), say
hi in the #meta-playground
[WordPress.org Slack channel](https://make.wordpress.org/chat/), and feel free
to contact Adam at [adam@adamziel.com](mailto:adam@adamziel.com).
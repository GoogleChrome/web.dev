---
layout: post
title: Progressively enhance your Progressive Web App
subhead: Building for modern browsers and progressively enhancing like it's 2003
authors:
  - thomassteiner
description: |
  Learn how to progressively enhance your Progressive Web App so that it remains useful
  on all modern browsers, but delivers an advanced experience on browsers that support
  new web capabilities like file system access, system clipboard access,
  contacts retrieval, periodic background sync, screen wake lock, web sharing features,
  and many more.
scheduled: true
date: 2020-06-29
updated: 2020-07-10
tags:
  - blog
  - capabilities
  - fugu
  - progressive-web-apps
hero: image/admin/0uSwSmGHmPXimU3dz8Xa.jpg
alt: An image of a fish.
thumbnail: image/admin/X84uooDup0B9OYWY4ZKh.jpg
---

{% YouTube 'NXCT3htg9nk' %}

Back in March 2003, [Nick Finck](https://twitter.com/nickf) and
[Steve Champeon](https://twitter.com/schampeo) stunned the web design world
with the concept of
[progressive enhancement](http://www.hesketh.com/publications/inclusive_web_design_for_the_future/),
a strategy for web design that emphasizes loading core web page content first,
and that then progressively adds more nuanced
and technically rigorous layers of presentation and features on top of the content.
While in 2003, progressive enhancement was about using—at the time—modern
CSS features, unobtrusive JavaScript, and even just Scalable Vector Graphics.
Progressive enhancement in 2020 and beyond is about using
[modern browser capabilities](/fugu-status/).

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/IEOd4MT9BqnbeXQ7z0vC.png", alt="Inclusive web design for the future with progressive enhancement. Title slide from Finck and Champeon's original presentation.", width="800", height="597", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Slide: Inclusive Web Design for the Future With Progressive Enhancement.
    (<a href="http://www.hesketh.com/publications/inclusive_web_design_for_the_future/">Source</a>)
  </figcaption>
</figure>

## Modern JavaScript

Speaking of JavaScript, the browser support situation for the latest core ES&nbsp;2015 JavaScript
features is great.
The new standard includes promises, modules, classes, template literals, arrow functions, `let` and `const`,
default parameters, generators, the destructuring assignment, rest and spread, `Map`/`Set`,
`WeakMap`/`WeakSet`, and many more.
[All are supported](https://caniuse.com/#feat=es6).

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/sYcABrEPMr01C2ilp4B0.png", alt="The CanIUse support table for ES6 features showing support across all major browsers.", width="800", height="296", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    The ECMAScript 2015 (ES6) browser support table. (<a href="https://caniuse.com/#feat=es6">Source</a>)
  </figcaption>
</figure>

Async functions, an ES&nbsp;2017 feature and one of my personal favorites,
[can be used](https://caniuse.com/#feat=async-functions)
in all major browsers.
The `async` and `await` keywords enable asynchronous, promise-based behavior
to be written in a cleaner style, avoiding the need to explicitly configure promise chains.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/0WFlQTFFTlqXKvpROMu9.png", alt="The CanIUse support table for async functions showing support across all major browsers.", width="800", height="247", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    The Async functions browser support table. (<a href="https://caniuse.com/#feat=async-functions">Source</a>)
  </figcaption>
</figure>

And even super recent ES&nbsp;2020 language additions like
[optional chaining](https://caniuse.com/#feat=mdn-javascript_operators_optional_chaining) and
[nullish coalescing](https://caniuse.com/#feat=mdn-javascript_operators_nullish_coalescing)
have reached support really quickly. You can see a code sample below.
When it comes to core JavaScript features, the grass couldn't be much greener than it
is today.

```js
const adventurer = {
  name: 'Alice',
  cat: {
    name: 'Dinah',
  },
};
console.log(adventurer.dog?.name);
// Expected output: undefined
console.log(0 ?? 42);
// Expected output: 0
```

<figure class="w-figure w-figure--fullbleed">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/v1nhcTV9aaqPKd9oRvYz.png", alt="The iconic Windows XP green grass background image.", width="800", height="500" %}
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    The grass is green when it comes to core JavaScript features.
    (Microsoft product screenshot, used with
    <a href="https://www.microsoft.com/en-us/legal/intellectualproperty/permissions/default">permission</a>.)
  </figcaption>
</figure>

## The sample app: Fugu Greetings

For this article, I work with a simple PWA, called
[Fugu Greetings](https://tomayac.github.io/fugu-greetings/public/)
([GitHub](https://github.com/tomayac/fugu-greetings)).
The name of this app is a tip of the hat to Project Fugu 🐡, an effort to give the web all
the powers of Android/iOS/desktop applications.
You can read more about the project on its
[landing page](/fugu-status).

Fugu Greetings is a drawing app that lets you create virtual greeting cards, and send
them to your loved ones. It exemplifies
[PWA's core concepts](/progressive-web-apps/). It's
[reliable](/reliable/) and fully offline enabled, so even if you don't
have a network, you can still use it. It's also [Installable](/install-criteria/)
to a device's home screen and integrates seamlessly with the operating system
as a stand-alone application.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w0id013BKBF2z7m70TrX.png", alt="Fugu Greetings PWA with a drawing that resembles the PWA community logo.", width="800", height="543", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    The <a href="https://tomayac.github.io/fugu-greetings/public/">Fugu Greetings</a> sample app.
  </figcaption>
</figure>

## Progressive enhancement

With this out of the way, it's time to talk about *progressive enhancement*.
The MDN Web Docs Glossary [defines](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)
the concept as follows:

{% Blockquote 'MDN contributors' %}
Progressive enhancement is a design philosophy that provides a baseline of
essential content and functionality to as many users as possible, while
delivering the best possible experience only to users of the most modern
browsers that can run all the required code.

[Feature detection](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/Feature_detection)
is generally used to determine whether browsers can handle more modern functionality,
while [polyfills](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill)
are often used to add missing features with JavaScript.

[…]

Progressive enhancement is a useful technique that allows web developers to focus
on developing the best possible websites while making those websites work
on multiple unknown user agents.
[Graceful degradation](https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation)
is related, but is not the same thing and is often seen as going in the opposite direction
to progressive enhancement.
In reality, both approaches are valid and can often complement one another.
{% endBlockquote %}

{%Aside 'note' %}
  This is not an introductory article on progressive enhancement, but assumes you are familiar
  with the concept.
  For a solid foundation, I recommend Steve Champeon's article
  [Progressive Enhancement and the Future of Web Design](http://www.hesketh.com/progressive_enhancement_and_the_future_of_web_design.html).
{% endAside %}

Starting each greeting card from scratch can be really cumbersome.
So why not have a feature that allows users to import an image, and start from there?
With a traditional approach, you'd have used an
[`<input type=file>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file)
element to make this happen.
First, you'd create the element, set its `type` to `'file'` and add MIME types to the `accept` property,
and then programmatically "click" it and listen for changes.
When you select an image, it is imported straight onto the canvas.

```js
const importImage = async () => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', () => {
      resolve(input.files[0]);
    });
    input.click();
  });
};
```

When there's an *import* feature, there probably should be an *export* feature
so users can save their greeting cards locally.
The traditional way of saving files is to create an anchor link
with a [`download`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download)
attribute and with a blob URL as its `href`.
You'd also programmatically "click" it to trigger the download,
and, to prevent memory leaks, hopefully not forget to revoke the blob object URL.

```js
const exportImage = async (blob) => {
  const a = document.createElement('a');
  a.download = 'fugu-greeting.png';
  a.href = URL.createObjectURL(blob);
  a.addEventListener('click', (e) => {
    setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
  });
  a.click();
};
```

But wait a minute. Mentally, you haven't "downloaded" a greeting card, you have
"saved" it.
Rather than showing you a "save" dialog that lets you choose where to put the file,
the browser has directly downloaded the greeting card without user interaction
and has put it straight into your Downloads folder. This isn't great.

What if there were a better way?
What if you could just open a local file, edit it, and then save the modifications,
either to a new file, or back to the original file that you had initially opened?
Turns out there is. The [File System Access API](/file-system-access/)
allows you to open and create files and
directories, as well as modify and save them .

So how do I feature-detect an API?
The File System Access API exposes a new method `window.chooseFileSystemEntries()`.
Consequently, I need to conditionally load different import and export modules depending on whether this method is available. I've shown how to do this below.

```js
const loadImportAndExport = () => {
  if ('chooseFileSystemEntries' in window) {
    Promise.all([
      import('./import_image.mjs'),
      import('./export_image.mjs'),
    ]);
  } else {
    Promise.all([
      import('./import_image_legacy.mjs'),
      import('./export_image_legacy.mjs'),
    ]);
  }
};
```

But before I dive into the File System Access API details,
let me just quickly highlight the progressive enhancement pattern here.
On browsers that currently don't support the File System Access API, I load the legacy scripts.
You can see the network tabs of Firefox and Safari below.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rnPL8xIMt6HJEUbDfrez.png", alt="Safari Web Inspector showing the legacy files getting loaded.", width="800", height="114", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Safari Web Inspector network tab.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bui4rcv0jvlVLHI3jBoo.png", alt="Firefox Developer Tools showing the legacy files getting loaded.", width="800", height="166", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Firefox Developer Tools network tab.
  </figcaption>
</figure>

However, on Chrome, a browser that supports the API, only the new scripts are loaded.
This is made elegantly possible thanks to
[dynamic `import()`](https://v8.dev/features/dynamic-import), which all modern browsers
[support](https://caniuse.com/#feat=es6-module-dynamic-import).
As I said earlier, the grass is pretty green these days.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/plf6kGtFE8g9Fjogv8ia.png", alt="Chrome DevTools showing the modern files getting loaded.", width="800", height="241", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Chrome DevTools network tab.
  </figcaption>
</figure>

## The File System Access API

So now that I have addressed this, it's time to look at the actual implementation based on the File System Access API.
For importing an image, I call `window.chooseFileSystemEntries()`
and pass it an `accepts` property where I say I want image files.
Both file extensions as well as MIME types are supported.
This results in a file handle, from which I can get the actual file by calling `getFile()`.

```js
const importImage = async () => {
  try {
    const handle = await window.chooseFileSystemEntries({
      accepts: [
        {
          description: 'Image files',
          mimeTypes: ['image/*'],
          extensions: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
        },
      ],
    });
    return handle.getFile();
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

Exporting an image is almost the same, but this time
I need to pass a type parameter of `'save-file'` to the `chooseFileSystemEntries()` method.
From this I get a file save dialog.
With file open, this wasn't necessary since `'open-file'` is the default.
I set the `accepts` parameter similarly to before, but this time limited to just PNG images.
Again I get back a file handle, but rather than getting the file,
this time I create a writable stream by calling `createWritable()`.
Next, I write the blob, which is my greeting card image, to the file.
Finally, I close the writable stream.

Everything can always fail: The disk could be out of space,
there could be a write or read error, or maybe simply the user cancels the file dialog.
This is why I always wrap the calls in a `try...catch` statement.

```js
const exportImage = async (blob) => {
  try {
    const handle = await window.chooseFileSystemEntries({
      type: 'save-file',
      accepts: [
        {
          description: 'Image file',
          extensions: ['png'],
          mimeTypes: ['image/png'],
        },
      ],
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

Using progressive enhancement with the File System Access API,
I can open a file as before.
The imported file is drawn right onto the canvas.
I can make my edits and finally save them with a real save dialog box
where I can choose the name and storage location of the file.
Now the file is ready to be preserved for eternity.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TEKHbetFMURVWh4QPRJw.png", alt="Fugu Greetings app with a file open dialog.", width="800", height="480", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    The file open dialog.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/tls52mkxDB513SzzcfNj.png", alt="Fugu Greetings app now with an imported image.", width="800", height="480", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    The imported image.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3LwHvtROaN1bHJN1El5D.png", alt="Fugu Greetings app with the modified image.", width="800", height="480", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Saving the modified image to a new file.
  </figcaption>
</figure>

## The Web Share and Web Share Target APIs

Apart from storing for eternity, maybe I actually want to share my greeting card.
This is something that the [Web Share API](/web-share/) and
[Web Share Target API](/web-share-target/) allow me to do.
Mobile, and more recently desktop operating systems have gained built-in sharing
mechanisms.
For example, below is desktop Safari's share sheet on macOS triggered from an article on
my [blog](https://blog.tomayac.com/).
When you click the **Share Article** button, you can share a link to the article with a friend, for
example, via the macOS Messages app.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/sinRHRHFgSgwAC7x8dIZ.png", alt="Desktop Safari's share sheet on macOS triggered from an article's Share button", width="800", height="423", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Web Share API on desktop Safari on macOS.
  </figcaption>
</figure>

The code to make this happen is pretty straightforward. I call `navigator.share()` and
pass it an optional `title`, `text`, and `url` in an object.
But what if I want to attach an image? Level&nbsp;1 of the Web Share API doesn't support this yet.
The good news is that Web Share Level&nbsp;2 has added file sharing capabilities.

```js
try {
  await navigator.share({
    title: 'Check out this article:',
    text: `"${document.title}" by @tomayac:`,
    url: document.querySelector('link[rel=canonical]').href,
  });
} catch (err) {
  console.warn(err.name, err.message);
}
```

Let me show you how to make this work with the Fugu Greeting card application.
First, I need to prepare a `data` object with a `files` array consisting of one blob, and then
a `title` and a `text`. Next, as a best practice, I use the new `navigator.canShare()` method which does
what its name suggests:
It tells me if the `data` object I'm trying to share can technically be shared by the browser.
If `navigator.canShare()` tells me the data can be shared, I'm ready to
call `navigator.share()` as before.
Because everything can fail, I'm again using a `try...catch` block.

```js
const share = async (title, text, blob) => {
  const data = {
    files: [
      new File([blob], 'fugu-greeting.png', {
        type: blob.type,
      }),
    ],
    title: title,
    text: text,
  };
  try {
    if (!(navigator.canShare(data))) {
      throw new Error("Can't share data.", data);
    }
    await navigator.share(data);
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

As before, I use progressive enhancement.
If both `'share'` and `'canShare'` exist on the `navigator` object, only then I go forward and
load `share.mjs` via dynamic `import()`.
On browsers like mobile Safari that only fulfill one of the two conditions, I don't load
the functionality.

```js
const loadShare = () => {
  if ('share' in navigator && 'canShare' in navigator) {
    import('./share.mjs');
  }
};
```

In Fugu Greetings, if I tap the **Share** button on a supporting browser like Chrome on Android,
the built-in share sheet opens.
I can, for example, choose Gmail, and the email composer widget pops up with the
image attached.

<div class="w-columns">
  <figure class="w-figure">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/szInJQl908kv9GEU8EJf.png", alt="OS-level share sheet showing various apps to share the image to.", width="800", height="1645", class="w-screenshot" %}
    <figcaption class="w-figcaption">
      Choosing an app to share the file to.
    </figcaption>
  </figure>

  <figure class="w-figure">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mKmdg1OMGpWDukmfSSOl.png", alt="Gmail's email compose widget with the image attached.", width="800", height="1645", class="w-screenshot" %}
    <figcaption class="w-figcaption">
      The file gets attached to a new email in Gmail's composer.
    </figcaption>
  </figure>
</div>

## The Contact Picker API

Next, I want to talk about contacts, meaning a device's address book
or contacts manager app.
When you write a greeting card, it may not always be easy to correctly write
someone's name.
For example, I have a friend Sergey who prefers his name to be spelled in Cyrillic letters. I'm
using a German QWERTZ keyboard and have no idea how to type their name.
This is a problem that the [Contact Picker API](/contact-picker/) can solve.
Since I have my friend stored in my phone's contacts app,
via the Contacts Picker API, I can tap into my contacts from the web.

First, I need to specify the list of properties I want to access.
In this case, I only want the names,
but for other use cases I might be interested in telephone numbers, emails, avatar
icons, or physical addresses.
Next, I configure an `options` object and set `multiple` to `true`, so that I can select more
than one entry.
Finally, I can call `navigator.contacts.select()`, which returns the desired properties
for the user-selected contacts.

```js
const getContacts = async () => {
  const properties = ['name'];
  const options = { multiple: true };
  try {
    return await navigator.contacts.select(properties, options);
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

And by now you've probably learned the pattern:
I only load the file when the API is actually supported.

```js
if ('contacts' in navigator) {
  import('./contacts.mjs');
}
```

In Fugu Greeting, when I tap the **Contacts** button and select my two best pals,
[Сергей Михайлович Брин](https://ru.wikipedia.org/wiki/%D0%91%D1%80%D0%B8%D0%BD,_%D0%A1%D0%B5%D1%80%D0%B3%D0%B5%D0%B9_%D0%9C%D0%B8%D1%85%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2%D0%B8%D1%87) and [劳伦斯·爱德华·"拉里"·佩奇](https://zh.wikipedia.org/wiki/%E6%8B%89%E9%87%8C%C2%B7%E4%BD%A9%E5%A5%87),
you can see how the
contacts picker is limited to only show their names,
but not their email addresses, or other information like their phone numbers.
Their names are then drawn onto my greeting card.

<div class="w-columns">
  <figure class="w-figure">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/T5gmSr1XGiVIV9Pw1HbC.png", alt="Contacts picker showing the names of two contacts in the address book.", width="800", height="1645", class="w-screenshot" %}
    <figcaption class="w-figcaption">
      Selecting two names with the contact picker from the address book.
    </figcaption>
  </figure>

  <figure class="w-figure">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ioMOCEHwvwdyzS7DX5L8.png", alt="The names of the two previously picked contacts drawn on the greeting card.", width="800", height="1644", class="w-screenshot" %}
    <figcaption class="w-figcaption">
      The two names then get drawn onto the greeting card.
    </figcaption>
  </figure>
</div>

## The Asynchronous Clipboard API

Up next is copying and pasting.
One of our favorite operations as software developers is copy and paste.
As a greeting card author, at times, I may want to do the same.
I may want to either paste an image into a greeting card I'm working on,
or copy my greeting card so I can continue editing it from
somewhere else.
The [Async Clipboard API](/image-support-for-async-clipboard/),
supports both text and images.
Let me walk you through how I added copy and paste support to the Fugu
Greetings app.

In order to copy something onto the system's clipboard, I need to write to it.
The `navigator.clipboard.write()` method takes an array of clipboard items as a
parameter.
Each clipboard item is essentially an object with a blob as a value, and the blob's type
as the key.

```js
const copy = async (blob) => {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

To paste, I need to loop over the clipboard items that I obtain by calling
`navigator.clipboard.read()`.
The reason for this is that multiple clipboard items might be on the clipboard in
different representations.
Each clipboard item has a `types` field that tells me the MIME types of the available
resources.
I call the clipboard item's `getType()` method, passing the
MIME type I obtained before.

```js
const paste = async () => {
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      try {
        for (const type of clipboardItem.types) {
          const blob = await clipboardItem.getType(type);
          return blob;
        }
      } catch (err) {
        console.error(err.name, err.message);
      }
    }
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

And it's almost needless to say by now. I only do this on supporting browsers.

```js
if ('clipboard' in navigator && 'write' in navigator.clipboard) {
  import('./clipboard.mjs');
}
```

So how does this work in practice? I have an image open in the macOS Preview app and
copy it to the clipboard.
When I click **Paste**, the Fugu Greetings app then asks me
whether I want to allow the app to see text and images on the clipboard.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/EO9BemEDnDtO3SvLl8u5.png", alt="Fugu Greetings app showing the clipboard permission prompt.", width="800", height="543", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    The clipboard permission prompt.
  </figcaption>
</figure>

Finally, after accepting the permission, the image is then pasted into the application.
The other way round works, too.
Let me copy a greeting card to the clipboard.
When I then open Preview and click **File** and then **New from Clipboard**,
the greeting card gets pasted into a new untitled image.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/VAkvEYWsQsJ0VJ8IjEs1.png", alt="The macOS Preview app with an untitled, just pasted image.", width="800", height="464", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    An image pasted into the macOS Preview app.
  </figcaption>
</figure>


## The Badging API

Another useful API is the [Badging API](/badging-api/).
As an installable PWA, Fugu Greetings of course does have an app icon
that users can place on the app dock or the home screen.
A fun and easy way to demonstrate the API is to (ab)use it in Fugu Greetings
as a pen strokes counter.
I have added an event listener that increments the pen strokes counter whenever the `pointerdown` event occurs
and then sets the updated icon badge.
Whenever the canvas gets cleared, the counter resets, and the badge is removed.

```js
let strokes = 0;

canvas.addEventListener('pointerdown', () => {
  navigator.setAppBadge(++strokes);
});

clearButton.addEventListener('click', () => {
  strokes = 0;
  navigator.setAppBadge(strokes);
});
```

This feature is a progressive enhancement, so the loading logic is as usual.

```js
if ('setAppBadge' in navigator) {
  import('./badge.mjs');
}
```

In this example, I have drawn the numbers from one to seven, using one pen stroke
per number.
The badge counter on the icon is now at seven.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uKurKxYeRlLCLXJYhX9I.png", alt="The numbers from one to seven drawn onto the greeting card, each with just one pen stroke.", width="800", height="480", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Drawing the numbers from 1 to 7, using seven pen strokes.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/5uOcN2MdjKVnWXRyTmCG.png", alt="Badge icon on the Fugu Greetings app showing the number 7.", width="742", height="448", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    The pen strokes counter in the form of the app icon badge.
  </figcaption>
</figure>

## The Periodic Background Sync API

Want to start each day fresh with something new?
A neat feature of the Fugu Greetings app is that it can inspire you each morning
with a new background image to start your greeting card.
The app uses the [Periodic Background Sync API](/periodic-background-sync/)
to achieve this.

The first step is to *register* a periodic sync event in the service worker registration.
It listens for a sync tag called `'image-of-the-day'`
and has a minimum interval of one day,
so the user can get a new background image every 24 hours.

```js
const registerPeriodicBackgroundSync = async () => {
  const registration = await navigator.serviceWorker.ready;
  try {
    registration.periodicSync.register('image-of-the-day-sync', {
      // An interval of one day.
      minInterval: 24 * 60 * 60 * 1000,
    });
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

The second step is to *listen* for the `periodicsync` event in the service worker.
If the event tag is `'image-of-the-day'`, that is, the one that was registered before,
the image of the day is retrieved via the `getImageOfTheDay()` function,
and the result propagated to all clients, so they can update their canvases and
caches.

```js
self.addEventListener('periodicsync', (syncEvent) => {
  if (syncEvent.tag === 'image-of-the-day-sync') {
    syncEvent.waitUntil(
      (async () => {
        const blob = await getImageOfTheDay();
        const clients = await self.clients.matchAll();
        clients.forEach((client) => {
          client.postMessage({
            image: blob,
          });
        });
      })()
    );
  }
});
```

Again this is truly a progressive enhancement, so the code is only loaded when the
API is supported by the browser.
This applies to both the client code and the service worker code.
On non-supporting browsers, neither of them is loaded.
Note how in the service worker, instead of a dynamic `import()`
(that isn't supported in a service worker context
[yet](https://github.com/w3c/ServiceWorker/issues/1356#issuecomment-433411852)),
I use the classic
[`importScripts()`](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts).

```js
// In the client:
const registration = await navigator.serviceWorker.ready;
if (registration && 'periodicSync' in registration) {
  import('./periodic_background_sync.mjs');
}
```

```js
// In the service worker:
if ('periodicSync' in self.registration) {
  importScripts('./image_of_the_day.mjs');
}
```

In Fugu Greetings, pressing the **Wallpaper** button reveals the greeting card image of the day
that is updated every day via the Periodic Background Sync API.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/YdSHSI4pZcTPyVv8CVx8.png", alt="Fugu Greetings app with a new greeting card image of the day.", width="800", height="481", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Pressing the <strong>Wallpaper</strong> button displays the image of the day.
  </figcaption>
</figure>

## Notification Triggers API

Sometimes even with a lot of inspiration, you need a nudge to finish a started greeting
card.
This is a feature that is enabled by the [Notification Triggers API](/notification-triggers/).
As a user, I can enter a time when I want to be nudged to finish my greeting card.
When that time comes, I will get a notification that my greeting card is waiting.

After prompting for the target time,
the application schedules the notification with a `showTrigger`.
This can be a `TimestampTrigger` with the previously selected target date.
The reminder notification will be triggered locally, no network or server side is needed.

```js
const targetDate = promptTargetDate();
if (targetDate) {
  const registration = await navigator.serviceWorker.ready;
  registration.showNotification('Reminder', {
    tag: 'reminder',
    body: "It's time to finish your greeting card!",
    showTrigger: new TimestampTrigger(targetDate),
  });
}
```

As with everything else I have shown so far, this is a progressive enhancement,
so the code is only conditionally loaded.

```js
if ('Notification' in window && 'showTrigger' in Notification.prototype) {
  import('./notification_triggers.mjs');
}
```

When I check the **Reminder** checkbox in Fugu Greetings, a prompt asks
me when I want to be reminded to finish my greeting card.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xtD7PtIIBO0Yn1ISFSyz.png", alt="Fugu Greetings app with a prompt asking the user when they want to be reminded to finish their greeting card.", width="800", height="480", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Scheduling a local notification to be reminded to finish a greeting card.
  </figcaption>
</figure>

When a scheduled notification triggers in Fugu Greetings,
it is shown just like any other notification, but as I wrote before,
it didn't require a network connection.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/e1FJA11UE3lrL1d4mCCo.png", alt="macOS Notification Center showing a triggered notification from Fugu Greetings.", width="300", height="172", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    The triggered notification appears in the macOS Notification Center.
  </figcaption>
</figure>

## The Wake Lock API

I also want to include the [Wake Lock API](/wakelock/).
Sometimes you just need to stare long enough at the screen until inspiration
kisses you.
The worst that can happen then is for the screen to turn off.
The Wake Lock API can prevent this from happening.

The first step is to obtain a wake lock with the `navigator.wakelock.request method()`.
I pass it the string `'screen'` to obtain a screen wake lock.
I then add an event listener to be informed when the wake lock is released.
This can happen, for example, when the tab visibility changes.
If this happens, I can, when the tab becomes visible again, re-obtain the wake lock.

```js
let wakeLock = null;
const requestWakeLock = async () => {
  wakeLock = await navigator.wakeLock.request('screen');
  wakeLock.addEventListener('release', () => {
    console.log('Wake Lock was released');
  });
  console.log('Wake Lock is active');
};

const handleVisibilityChange = () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    requestWakeLock();
  }
};

document.addEventListener('visibilitychange', handleVisibilityChange);
document.addEventListener('fullscreenchange', handleVisibilityChange);
```

Yes, this is a progressive enhancement, so I only need to load it when the browser
supports the API.

```js
if ('wakeLock' in navigator && 'request' in navigator.wakeLock) {
  import('./wake_lock.mjs');
}
```
In Fugu Greetings, there's an **Insomnia** checkbox that, when checked, keeps the
screen awake.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kB5LkdV3cVKaJ0Xze76v.png", alt="The insomnia checkbox, if checked, keeps the screen awake.", width="800", height="480", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    The <strong>Insomnia</strong> checkbox keeps app awake.
  </figcaption>
</figure>

## The Idle Detection API

At times, even if you stare at the screen for hours,
it's just useless and you can't come up with the slightest idea what to do with your greeting card.
The [Idle Detection API](/idle-detection/) allows the app to detect user idle time.
If the user is idle for too long, the app resets to the initial state
and clears the canvas.
This API is currently gated behind the
[notifications permission](https://developer.mozilla.org/en-US/docs/Web/API/Notification/requestPermission),
since a lot of production use cases of idle detection are notifications-related,
for example, to only send a notification to a device the user is currently actively using.

After making sure that the notifications permission is granted, I then instantiate the
idle detector.
I register an event listener that listens for idle changes, which includes the user and
the screen state.
The user can be active or idle,
and the screen can be unlocked or locked.
If the user is idle, the canvas clears.
I give the idle detector a threshold of 60 seconds.

```js
const idleDetector = new IdleDetector();
idleDetector.addEventListener('change', () => {
  const userState = idleDetector.userState;
  const screenState = idleDetector.screenState;
  console.log(`Idle change: ${userState}, ${screenState}.`);
  if (userState === 'idle') {
    clearCanvas();
  }
});

await idleDetector.start({
  threshold: 60000,
  signal,
});
```

And as always, I only load this code when the browser supports it.

```js
if ('IdleDetector' in window) {
  import('./idle_detection.mjs');
}
```

In the Fugu Greetings app, the canvas clears when the **Ephemeral** checkbox is
checked and the user is idle for for too long.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yq3IsOqp01AZTw7nvfnB.png", alt="Fugu Greetings app with a cleared canvas after the user has been idle for too long.", width="800", height="480", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    When the <strong>Ephemeral</strong> checkbox is checked and the user has been idle for too long, the canvas is cleared.
  </figcaption>
</figure>

## Closing

Phew, what a ride. So many APIs in just one sample app.
And, remember, I never make the user pay the download cost
for a feature that their browser doesn't support.
By using progressive enhancement, I make sure only the relevant code gets loaded.
And since with HTTP/2, requests are cheap, this pattern should work well for a lot of
applications,
although you might want to consider a bundler for really large apps.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/DOnuk7CHPsnbTdlqOHXM.png", alt="Chrome DevTools Network panel showing only requests for files with code that the current browser supports.", width="800", height="566", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Chrome DevTools Network tab showing only requests for files with code that the current browser supports.
  </figcaption>
</figure>

The app may look a little different on each browser since not all platforms support all features,
but the core functionality is always there—progressively enhanced according to the particular browser's capabilities.
Note that these capabilities may change even in one and the same browser,
depending on whether the app is running as an installed app or in a browser tab.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/LmUW0CZpH5eXIoHTZ6kH.png", alt="Fugu Greetings running on Android Chrome, showing many available features.", width="500", height="243", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    <a href="https://github.com/tomayac/fugu-greetings">Fugu Greetings</a> running on Android Chrome.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BOcbAW4FCi10d9cGdeNW.png", alt="Fugu Greetings running on desktop Safari, showing fewer available features.", width="500", height="403", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    <a href="https://github.com/tomayac/fugu-greetings">Fugu Greetings</a> running on desktop Safari.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7zT4BEUzxTkjg8e08OJU.png", alt="Fugu Greetings running on desktop Chrome, showing many available features.", width="500", height="348", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    <a href="https://github.com/tomayac/fugu-greetings">Fugu Greetings</a> running on desktop Chrome.
  </figcaption>
</figure>

If you're interested in the [Fugu Greetings](https://tomayac.github.io/fugu-greetings/public/) app,
go find and [fork it on GitHub](https://github.com/tomayac/fugu-greetings).

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/l260mtBzRi8OxdV8gXSg.png", alt="Fugu Greetings repo on GitHub.", width="800", height="490", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    <a href="https://github.com/tomayac/fugu-greetings">Fugu Greetings</a> app on GitHub.
  </figcaption>
</figure>

The Chromium team is working hard on making the grass greener when it comes to advanced Fugu APIs.
By applying progressive enhancement in the development of my app,
I make sure that everybody gets a good, solid baseline experience,
but that people using browsers that support more Web platform APIs get an even better experience.
I'm looking forward to seeing what you do with progressive enhancement in your apps.

## Acknowledgements

I'm grateful to [Christian Liebel](https://christianliebel.com/) and
[Hemanth HM](https://h3manth.com/) who both have contributed to Fugu Greetings.
This article was reviewed by [Joe Medley](https://github.com/jpmedley) and
[Kayce Basques](https://github.com/kaycebasques).
[Jake Archibald](https://github.com/jakearchibald/) helped me find out the situation
with dynamic `import()` in a service worker context.

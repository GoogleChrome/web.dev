---
layout: post
title: Progressively enhance your Progressive Web App
subhead: Building for modern browsers and progressively enhancing like it's 2003
authors:
  - thomassteiner
description: |
  Learn how to progressively enhance your Progressive Web App so that it remains useful
  on all modern browsers, but delivers an advanced experience on browsers that support
  new web capabilities like native file system access, system clipboard access,
  contacts retrieval, periodic background sync, screen wake lock, web sharing features,
  and many more.
date: 2020-06-09
updated: 2020-06-11
tags:
  - blog
  - capabilities
  - fugu
  - progressive-web-apps
---

Back in March 2003, [Nick Finck](https://twitter.com/nickf) and
[Steve Champeon](https://twitter.com/schampeo) stunned the web design world
with the concept of
[progressive enhancement](http://www.hesketh.com/publications/inclusive_web_design_for_the_future/).
A strategy for web design that emphasizes core webpage content first,
and that then progressively adds more nuanced
and technically rigorous layers of presentation and features on top of the content.
While in 2003, progressive enhancement was about using, at the time,
modern CSS features, unobtrusive JavaScript, and even Scalable Vector Graphics,
progressive enhancement in 2020 is about using modern browser capabilities.

<figure class="w-figure">
  <img class="w-screenshot"
       src="100002010000053C000003E8B978FE17E590BC9A.png"
       alt="">
  <figcaption class="w-figcaption">
    Inclusive web design for the future with progressive enhancement.
    (<a href="http://www.hesketh.com/publications/inclusive_web_design_for_the_future/">Source</a>)
  </figcaption>
</figure>

Talking of JavaScript, the browser support situation for the latest core JavaScript
features is great.
Promises, modules, classes, template literals, arrow functions, `let` and `const`,
default parameters, generators, the destructuring assignment, rest and Spread, `Map`/`Set`,
`WeakMap`/`WeakSet`, and many more.
[All supported](https://caniuse.com/#feat=es6).

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000000000009C40000039EF0A6FE5C50E42DEA.png"
       alt="">
  <figcaption class="w-figcaption">
    ECMAScript 2015 (ES6) browser support table.
  </figcaption>
</figure>

Async functions [work](https://caniuse.com/#feat=async-functions) across the board in all major browsers.

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000000000009C400000304A19EF0FF1D72987D.png"
       alt="">
  <figcaption class="w-figcaption">
    Async functions browser support table.
  </figcaption>
</figure>

And even super recent language additions like
[optional chaining](https://caniuse.com/#feat=mdn-javascript_operators_optional_chaining) and
[nullish coalescing](https://caniuse.com/#feat=mdn-javascript_operators_nullish_coalescing)
reach support really quickly—you can see a code sample below.

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

When it comes to core JavaScript features, the grass couldn't be much greener than it
is today.

<figure class="w-figure w-figure--fullbleed">
  <img src="1000020100000640000003E810E16D93C747B2D5.png"
       alt="">
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    The grass is green when it comes to core JavaScript features.
  </figcaption>
</figure>

## The sample app: Fugu Greetings

For this article, I work with a simple PWA, called
[Fugu Greetings](https://tomayac.github.io/fugu-greetings/public/).
The name of this app is a hat tip to Project Fugu 🐡, where we work on giving the web all
the powers of native applications.
You can read more about the project on the
[Project Fugu 🐡landing page](https://web.dev/fugu-status).

Fugu Greetings is a drawing app that allows you to create virtual greeting cards.
Just imagine you actually had traveled to Google I/O and you wanted to send a
greeting card to your loved ones.
Let me recall some of the [PWA concepts](https://web.dev/progressive-web-apps/).
Fugu Greetings is [reliable](https://web.dev/reliable/) and fully offline enabled,
so even if you don't have network, you can still use it.
It can be [installed](https://web.dev/install-criteria/) to the home screen of the device
and integrates seamlessly into the operating system as a stand-alone application.

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000201000009C4000006A2F58B840608CEA761.png"
       alt="">
  <figcaption class="w-figcaption">
    The Fugu Greetings sample app.
  </figcaption>
</figure>

## Progressive enhancement

With this out of the way, let's dive into the actual topic of this talk: progressive
enhancement.

{%Aside 'note' %}
  This article assumes you are already familiar with the concept of progressive enhancement.
  For a good introduction, I recommend Steve Champeon's article
  [Progressive Enhancement and the Future of Web Design](http://www.hesketh.com/progressive_enhancement_and_the_future_of_web_design.html).
{% endAside %}

Starting each greeting card from scratch can be really cumbersome.
So why not have a feature that allows users to import an image, and start from there?
With a traditional approach, you'd have used an
[`<input type=file>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file)
element to make this happen.
First, you'd create the element, set its `type` and the to-be-`accept`ed MIME types,
and then programmatically click it and listen for changes.
And it works perfectly fine. When you select an image, it is imported straight onto the canvas.

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

When there's an import feature, there probably should be an export feature,
so users can save their greeting cards locally.
Similarly to before, the traditional way to saving files is to create an anchor link
with a [`download`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download:~:text=download)
attribute and with a blob URL as its `href`.
You would then programmatically click it to trigger the download,
and to prevent memory leaks, hopefully make sure not to forget to revoke the blob
URL.

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
the browser has directly downloaded the greeting card without interaction
And has put it straight into your Downloads folder. This isn't great.

What if there were a better way?
What if you could just open a local file, edit it, and then save the modifications,
either to a new file, or back to the original file that you had initially opened?
Turns out there is. The [Native File System API](https://web.dev/native-file-system/)
allows you to open and create files and
directories, make modifications, and save them back.

Let's see how I can feature-detect if the API exists.
The Native File System API exposes a new method `window.chooseFileSystemEntries()`.
I can use this to conditionally load `import_image.mjs` and `export_image.mjs` if the API exists,
and if it isn't available, load the files with the legacy approaches from above.

```js
const loadImportAndExport = () => {
  if ('chooseFileSystemEntries' in window) {
    Promise.all([import('./import_image.mjs'), import('./export_image.mjs')]);
  } else {
    Promise.all([
      import('./import_image_legacy.mjs'),
      import('./export_image_legacy.mjs'),
    ]);
  }
};
```

But before I dive into the Native File System API details,
let me just quickly highlight the progressive enhancement pattern here.
On browsers that currently don't support the Native File System API, I load the legacy scripts.
You can see the network tabs of Firefox and Safari below.

<figure class="w-figure">
  <img class="w-screenshot"
       src="100002010000058C000000CA65613FEC1D7FB3E2.png"
       alt="">
  <figcaption class="w-figcaption">
    Safari Web Inspector network tab.
  </figcaption>
</figure>

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000201000005800000012430B7B8786BF315DD.png"
       alt="">
  <figcaption class="w-figcaption">
    Firefox Developer Tools network tab.
  </figcaption>
</figure>

However, on Chrome, only the new scripts are loaded.
This is made elegantly possible thanks to
[dynamic `import()`](https://v8.dev/features/dynamic-import) that all modern browsers support.
As I said earlier, the grass is pretty green these days.

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000201000006FC0000021AD16A28BA8F5CBF1A.png"
       alt="">
  <figcaption class="w-figcaption">
    Chrome DevTools network tab.
  </figcaption>
</figure>

## The Native File System API

So now that I have addressed this, let's look at the actual Native File System API based
implementation.
For importing an image, I call `window.chooseFileSystemEntries()`
and pass it an `accepts` option parameter where I say I want image files.
Both file extensions as well as MIME types are supported.
This results in a file handle. From the file handle, I can obtain the actual file by calling
its `getFile()` method.

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
I need to pass a type parameter of `"save-file"` to the `chooseFileSystemEntries()` method,
so I get a file save dialog.
Before with file open, this wasn't necessary since `"open-file"` is the default.
I set the `accepts` parameter similar as before, but this time limited to just PNG images.
Again I get back a file handle, but rather than getting the file,
this time I'm creating a writable stream by calling `createWritable()`.
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

After the progressive enhancement of using the Native File System API if it's supported,
I can open a file as before.
The imported file is drawn right onto the canvas.
I can make my edits, and finally save them, with a real save dialog
where I can choose the name and storage location of the file.
Now the file is ready to be preserved for the eternity.

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000201000009C4000005DB39851711E3CB3BF0.png"
       alt="">
  <figcaption class="w-figcaption">
    The file open dialog.
  </figcaption>
</figure>

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000201000009C4000005DB01941257D7BE6A85.png"
       alt="">
  <figcaption class="w-figcaption">
    The imported image.
  </figcaption>
</figure>

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000201000006FC0000021AD16A28BA8F5CBF1A.png"
       alt="">
  <figcaption class="w-figcaption">
    Saving the modified image to a new file.
  </figcaption>
</figure>

## The Web Share and Web Share Target APIs

Apart from storing for the eternity, maybe I actually want to share my greeting card.
This is something that the Web Share and Web Share Target APIs allow me to do.
Mobile, and more recently also desktop operating systems have gained native sharing
mechanisms.
For example, here's Safari's share sheet on macOS Safari triggered from an article on
my [blog](https://blog.tomayac.com/).
When you click the share button, you can share a link to the article with a friend, for
example, via the native Messages app.

<figure class="w-figure">
  <img class="w-screenshot"
       src="1000020100000356000001C434F5DD5D64721768.png"
       alt="">
  <figcaption class="w-figcaption">
    Web Share API on desktop Safari.
  </figcaption>
</figure>

```js
try {
  await navigator.share({
    title: '',
    text: `"${document.title}" by @tomayac:`,
    url: document.querySelector('link[rel=canonical]').href,
  });
} catch (err) {
  console.warn(err.name, err.message);
}
```

The code to make this happen is pretty straightforward. I call `navigator.share()` and
pass it an optional `title`, `text`, and `url`.
But what if I want to attach an image? Level&nbsp;1 of the Web Share API doesn't support this yet.
The good news is that Web Share Level&nbsp;2 has added file sharing capabilities.

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
    if (!(await navigator.canShare(data))) {
      throw new Error("Can't share data.", data);
    }
    await navigator.share(data);
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

Let me show you how to make this work with the Fugu Greeting card application.
First, I need to prepare a `data` object with a `files` array consisting of one blob, and then
a title and a text.

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
    if (!(await navigator.canShare(data))) {
      throw new Error("Can't share data.", data);
    }
    await navigator.share(data);
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

Next, as a best practice, I make use of the new `navigator.canShare()` method that does
what its name suggests:
It tells me if the `data` object I'm trying to share can technically be shared by the
browser.

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
    if (!navigator.canShare(data)) {
      throw new Error("Can't share data.", data);
    }
    await navigator.share(data);
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

If `navigator.canShare()` tells me the data can be shared, I am in the final step ready to
call `navigator.share()` as before.
Again everything can fail, in the simplest way when the user cancels the sharing
operation,
So it's all wrapped in `try...catch` blocks.

```js
const loadShare = () => {
  if ('share' in navigator && 'canShare' in navigator) {
    import('./share.mjs');
  }
};
```

As before, I use a progressive enhancement loading strategy.
If both `'share'` and `'canShare'` exist on the `navigator` object, only then I go forward and
load `share.mjs` via dynamic import.
On browsers like Mobile Safari that only fulfill one of the two conditions, I don't load
the functionality.
If I tap the share button on a supporting browser, the native share sheet opens.
I can, for example, choose Gmail, and the email composer widget pops up with the
image attached.

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000201000003E400000800D873C982E6D44C89.png"
       alt="">
  <figcaption class="w-figcaption">
    Choosing an app to share the file to.
  </figcaption>
</figure>

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000201000003E4000008004D3AEA65DB2ABA6C.png"
       alt="">
  <figcaption class="w-figcaption">
    The file gets attached to a new email in Gmail's composer.
  </figcaption>
</figure>

## The Contact Picker API

Up next, I want to talk about contacts. And when I say contacts,
I mean contacts as in the device's address book.
When you write a greeting card, it may not always be easy to correctly write
someone's name.
For example, I have a friend who prefers their name to be spelled in Cyrillic letters. I'm
using a German QWERTZ keyboard and have no idea how to type their name.
This is a problem that the Contact Picker API solves.
Since I have my friend stored in my phone's contacts app,
via the Contacts Picker API I can tap into my contacts from the web.

First, I need to specify the list of properties I want to access.
In this case, I only want the names,
but for other use cases I might be interested in telephone numbers, emails, avatar
icon, or physical addresses.
Next, I configure an `options` object and set `multiple` to `true`, so that I can select more
than one entry.
Finally, I can call `navigator.contacts.select()`, which results in the desired properties
once the user selects one or multiple of their contacts.

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

In Fugu Greeting, when I tap the contacts button and select my two best pals,
Сергей Михайлович Брин and 劳伦斯·爱德华·"拉里"·佩奇, you can see how the
contacts picker is limited to only show their names,
but not their email addresses, or other information like their phone numbers.
Their names are then drawn onto my greeting card.

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000201000003E400000800AD376E3B4B3386C6.png"
       alt="">
  <figcaption class="w-figcaption">
    Selecting two names with the contact picker from the address book.
  </figcaption>
</figure>

<figure class="w-figure">
  <img class="w-screenshot"
       src="1000000000000438000008AC945569E52CE934FA.png"
       alt="">
  <figcaption class="w-figcaption">
    The names get inserted in the greeting card.
  </figcaption>
</figure>

```js
if ('contacts' in navigator) {
  import('./contacts.mjs');
}
```

And by now you've probably learned the pattern:
I only load the file when the API is actually supported.

## The Asynchronous Clipboard API

Up next is copying and pasting.
One of our favorite operations as software developers is copy and paste.
As greeting card authors, at times, I may want to do the same.
Either paste an image into a greeting card I'm working on,
or the other way round: copy my greeting card so I can continue editing it from
somewhere else.
The Async Clipboard API, apart from text, also supports images.
Let me walk you through how I have added copy and paste support to the Fugu
Greetings app.

In order to copy something onto the system's clipboard, I need to write to it.
The `navigator.clipboard.write()` method takes an array of clipboard items as a
parameter.
Each clipboard item essentially is an object with a blob as a value, and the blob's type
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
Each clipboard item has a `types` field that tells me in which MIME type the resource is
available.
I simply take the first one and call the clipboard item's `getType()` method, passing the
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

And almost needless to say by now, I only do this only on supporting browsers.

```js
if ('clipboard' in navigator && 'write' in navigator.clipboard) {
  import('./clipboard.mjs');
}
```

So how does this work? I have an image open in the macOS Preview app and
copy it to the clipboard.
When I click Paste, the Fugu Greetings app then asks me
whether I want to allow the app to see text and images on the clipboard.

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000201000009C4000006A2FE8CEB5EE2FB3F83.png"
       alt="">
  <figcaption class="w-figcaption">
    The clipboard permission prompt.
  </figcaption>
</figure>

Finally, after accepting the permission, the image is then pasted into the application.
The other way round works, too.
Let me copy a greeting card to the clipboard.
When I then open Preview and click "File" and then "New from Clipboard",
the greeting card gets pasted into a new untitled image.

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000201000009C4000005A941A3287F1A5052A8.png"
       alt="">
  <figcaption class="w-figcaption">
    An image pasted into the macOS Preview app.
  </figcaption>
</figure>


## The Badging API

Another useful API is the Badging API.
As an installable PWA, Fugu Greetings of course does have an app icon
that users can place on the app dock or the home screen.
Something fun to do with it in the context of Fugu Greetings is to use it as a pen
stroke counter.

With the Badging API, it is a straightforward task to do this.
I have added an event listener that on pointer down increments the pen strokes
counter
and sets the icon.
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

In this example, I have drawn the numbers from one to seven, using one pen stroke
for each number.
The badge counter on the icon is now at seven.

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000201000009C4000005DBE9BF427ABD63947A.png"
       alt="">
  <figcaption class="w-figcaption">
    Drawing the numbers from 1 to 7, using seven pen strokes.
  </figcaption>
</figure>

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000201000002E6000001C0855AA2DF1E30228C.png"
       alt="">
  <figcaption class="w-figcaption">
    The pen strokes counter in form of the app icon badge reflects this.
  </figcaption>
</figure>

This feature is a progressive enhancement, so the loading logic is as usual.

```js
if ('setAppBadge' in navigator) {
  import('./badge.mjs');
}
```

## The Periodic Background Sync API

Want to start each day fresh with something new?
A neat feature of the Fugu Greetings app is that in can inspire you each morning
with a new background image to start your greeting card.
The app uses the Periodic Background Sync API to achieve this.

The first step is to register a periodic sync event in the service worker registration.
It listens for a sync tag called `"image-of-the-day"`
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

The second step is to listen for the periodic sync event in the service worker.
If the event tag is the one that was registered before,
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
Note how in the service worker, instead of a dynamic import, I use the classic
`importScripts()` function to the same effect.


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

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000201000009C4000005E0B042853D0E77C224.png"
       alt="">
  <figcaption class="w-figcaption">
    Pressing the Wallpaper button displays the image of the day.
  </figcaption>
</figure>

## Notification Triggers API

Sometimes even with a lot of inspiration, you need a nudge to finish a started greeting
card.
This is a feature that is enabled by the Notification Triggers API.
As a user, I can enter a time when I want to be nudged to finish my greeting card,
and when that time has come, I will get a notification that my greeting card is waiting.

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

As everything else I have shown so far, this is a progressive enhancement,
so the code is only conditionally loaded.


```js
if ('Notification' in window && 'showTrigger' in Notification.prototype) {
  import('./notification_triggers.mjs');
}
```

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000201000009C4000005DB0D42F493ACFD1B53.png"
       alt="">
  <figcaption class="w-figcaption">
    Scheduling a local notification to be reminded to finish a greeting card.
  </figcaption>
</figure>

## The Wake Lock API

I also want to include the wake lock API.
Sometimes you need to just stare long enough on the screen until the inspiration
kisses you.
The worst that can happen then is the screen to turn off.
The Wake Lock API can prevent this from happening.
In Fugu Greetings, there's an insomnia checkbox that, when checked, keeps your
screen awake.

In a first step I obtain a wake lock with the `navigator.wakelock.request method()`.
I pass it the string `"screen"` to obtain a screen wake lock.
I then add an event listener to be informed when the wake lock is released.
This can happen, for example, when the tab visibility changes.
If this happens, I can when the tab becomes visible again reobtain the wake lock.

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

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000201000009C4000005DBCD9D10DD0A745315.png"
       alt="">
  <figcaption class="w-figcaption">
    The insomnia checkbox keeps app awake.
  </figcaption>
</figure>

## The Idle Detection API

At times, even if you stare at the screen for hours,
it's just useless.
The Idle Detection API allows the app to detect user idle time.
If the user is detected to be idle for too long, the app resets to the initial state
and clears the canvas.
This API is currently gated behind the notifications permission,
since a lot of production use cases of idle detection are notifications-related,
for example, to only send a notification to a device the user is currently actively using.

After making sure that the notifications permission is granted, I then instantiate the
idle detector.
I register an event listener that listens for idle changes, which includes the user and
the screen state.
The user can be active or idle,
and the screen can be unlocked or locked.
If the user is detected to be idle, the canvas clears.
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

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000201000009C4000005DBB930B1D3F8F5D1DA.png"
       alt="">
  <figcaption class="w-figcaption">
    When the ephemeral checkbox is checked and the user has been idle for too long, the canvas is cleared.
  </figcaption>
</figure>

## Closing

Phew, what a ride. So many APIs in just one sample app.
And, reminder, I never make the user pay the download cost
for a feature that their browser doesn't support.
By using progressive enhancement, I make sure only the relevant code gets loaded.
And since with HTTP/2, requests are cheap, this pattern should work well for a lot of
applications,
although at times you might still want to consider a bundler for really large apps.

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000201000009C4000006E8D776365D6B538C9A.png"
       alt="">
  <figcaption class="w-figcaption">
    Chrome DevTools panel showing only the relevant requests are made.
  </figcaption>
</figure>

If you're interested in the [Fugu Greetings](https://tomayac.github.io/fugu-greetings/public/) app,
go find and [fork it on GitHub.](https://github.com/tomayac/fugu-greetings).

<figure class="w-figure">
  <img class="w-screenshot"
       src="10000201000009C4000005FB1EF077CDF01B8588.png"
       alt="">
  <figcaption class="w-figcaption">
    Fugu Greetings app on GitHub.
  </figcaption>
</figure>

We are working hard on making the grass greener when it comes to advanced Fugu APIs.
By applying a progressive enhancement in the development of your app,
you can make sure that everybody gets a good, solid baseline experience,
but that people using browsers that support more Web platform APIs get an even better experience.

## Acknowledgements

I'm grateful to [Christian Liebel](https://christianliebel.com/) and
[Hemanth HM](https://h3manth.com/) who have contributed to Fugu Greetings.

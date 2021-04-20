---
layout: post
title: Breaking down the barriers using the DataTransfer API
authors:
  - joriktangelder
  - thomassteiner
description: >
  The DataTransfer object is used to hold the data that is being dragged during a drag and drop
  operation. It may hold one or more data items, each of one or more data types. This article
  explains what developers can do with the DataTransfer API.
date: 2021-04-21
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/QDbWuORGDrUkKquHEeAU.jpeg
tags:
  - blog
  - progressive-web-apps
---

You might have heard about the
[DataTransfer API](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer) before that is
part of the
[HTML5 Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
and [Clipboard events](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event). It can
be used to transfer data between source and receiving targets. This API is available and
[ready to use](https://caniuse.com/mdn-api_datatransfer_setdata) in all modern desktop browsers.

The drag-drop and copy-paste interactions are often used for interactions within the page,
transferring a simple text from A to B. But what is oftentimes overlooked is the ability to use
these same interactions to go beyond the browser window.

Both the browser's built-in drag-and-drop as well as the copy-paste interactions can communicate
with other (web) applications, not tied to an origin. The API has support for providing multiple
data entries that can have different behavior based on where it is transferred to. Your
web application can send and receive the transferred data when listening to incoming events.

This powerful capability can change the way we think about sharing and interoperability in web
applications on desktop. Transferring data between other applications doesn't need to rely on
tightly coupled integrations anymore, but you can give the user the full control to transfer their
data to wherever they would like.

<figure class="w-figure">
  {% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/QzLyuLo3xCiRTA29oYx6.png", alt="Two app windows, one with a drag source and one with a paste target.", width="800", height="433" %}
  <figcaption class="w-figcaption">An example of interactions that are possible with the DataTransfer API.</figcaption>
</figure>

## Transferring data

To get started with transferring data, you'll need to implement drag-drop or copy-paste. The examples
below will be based on drag-drop interactions, but the process for copy-paste is very similar. If
you are unfamiliar with the Drag and Drop API, there's a great article
[explaining HTML5 Drag and Drop](https://web.dev/drag-and-drop/) that details the ins and outs.

By providing MIME-type keyed data, you are able to interact with external applications, for free!
Most WYSIWYG editors, text editors, and browsers respond to the "primitive" mime-types used in the
example below.

```js
document.querySelector('#dragSource').addEventListener('dragstart', (event) => {
  event.dataTransfer.setData('text/plain', 'Foo bar');
  event.dataTransfer.setData('text/html', '<h1>Foo bar</h1>');
  event.dataTransfer.setData('text/uri-list', 'https://example.com');
});
```

Receiving the data transfer works almost the same as providing it. Listen to the receiving events
(`drop`, or `paste`) and read the keys. When dragging over an element, the browser only has access
to the `type` keys of the data. The data itself can only be accessed after a drop.

```js
document.querySelector('#dropTarget').addEventListener('dragover', (event) => {
  console.log(event.dataTransfer.types);
  // Accept the drag-drop transfer.
  event.preventDefault();
});

document.querySelector('#dropTarget').addEventListener('drop', (event) => {
  // Log all the transferred data items to the console.
  for (let type of event.dataTransfer.types) {
    console.log({ type, data: event.dataTransfer.getData(type) });
  }
  event.preventDefault();
});
```

There are several MIME-types that can be used with wide adoption across applications:

- **`text/html`:** Will render the HTML payload in <code>contentEditable</code> elements and rich
  text (WYSIWYG) editors like Google Docs, Microsoft Word, and others.</th>
- **`text/plain:`** Will set the value of input elements, content of code editors, and the fallback
  from <code>text/html</code>.
- **`text/uri-list`:** Will navigate to the URL when dropping on the URL bar or browser page. A URL
  shortcut will be created when dropping on a directory or the desktop.</td>

The widespread adoption of `text/html` by WYSIWYG editors makes it very powerful. Like in HTML
documents, you can embed resources by using
[Data URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) or publicly
accessible URLs. This works well with exporting visuals (for example from a canvas) to editors like
Google Docs.

```js
const redPixel = 'data:image/gif;base64,R0lGODdhAQABAPAAAP8AAAAAACwAAAAAAQABAAACAkQBADs=';
const html = '<img src="' + redPixel + '" width="100" height="100" alt="" />';
event.dataTransfer.setData('text/html', html);
```

For posterity, using DataTransfer with copy-paste interactions looks like the following. Notice that
the `dataTransfer` property is named `clipboardData` for clipboard events.

```js
const copySource = document.querySelector('#copySource');
const pasteTarget = document.querySelector('#pasteTarget');
// Listen to copy-paste events on the document.
document.addEventListener('copy', (event) => {
  // Only copy when the `activeElement` (i.e., focused element) is, or is within,
  // the `copySource` element.
  if (copySource.contains(document.activeElement)) {
    event.clipboardData.setData('text/plain', 'Foo bar');
    // Prevent the browser's default copy behavior.
    event.preventDefault();
  }
});
document.addEventListener('paste', (event) => {
  if (pasteTarget.contains(document.activeElement)) {
    const data = event.clipboardData.getData('text/plain');
    console.log(data);
  }
});
```

## Custom data formats

You are not limited to the primitive MIME types, but can use any key to identify the transferred
data. This can be useful for cross-browser interactions within your application. As shown below, you
can transfer more complex data using the `JSON.stringify()` and `JSON.parse()` functions.

```js
document.querySelector('#dragSource').addEventListener('dragstart', (event) => {
  const data = { foo: 'bar' };
  event.dataTransfer.setData('my-custom-type', JSON.stringify(data));
});

document.querySelector('#dropTarget').addEventListener('dragover', (event) => {
  // Only allow dropping when our custom data is available.
  if (event.dataTransfer.types.includes('my-custom-type')) {
    event.preventDefault();
  }
});

document.querySelector('#dropTarget').addEventListener('drop', (event) => {
  if (event.dataTransfer.types.includes('my-custom-type')) {
    event.preventDefault();
    const dataString = event.dataTransfer.getData('my-custom-type');
    const data = JSON.parse(dataString);
    console.log(data);
  }
});
```

## Connecting the web

While custom formats are great for communication between applications you have in your control, it
also limits the user to transfer data to applications that aren't using your format. If you want to
connect with third-party applications across the web, you need a universal data format.

The [JSON-LD](https://json-ld.org/) (Linked Data) standard is a great candidate for this. It is
lightweight and easy to read and write to from JavaScript. [Schema.org](Schema.org) contains many
predefined types that can be used, while custom schema definitions are an option as well.

```js
const data = {
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  contentLocation: 'Venice, Italy',
  contentUrl: 'venice.jpg',
  datePublished: '2010-08-08',
  description: 'I took this picture during our honey moon.',
  name: 'Canal in Venice',
};
event.dataTransfer.setData('application/ld+json', JSON.stringify(data));
```

When using the Schema.org types, you can start with the generic [Thing](schema.org/Thing) type, but
go down to types like [Event](schema.org/Event), [Person](schema.org/Person),
[MediaObject](schema.org/MediaObject), [Place](schema.org/Place), and even
[MedicalEntity](schema.org/MedicalEntity) if you like. If you use TypeScript, you can use the
interface definitions from the [schema-dts](github.com/google/schema-dts) type definitions.

By transmitting and receiving JSON-LD data, you will support a more connected and open web. With
applications speaking the same language, you can create deep integrations with external
applications. No need for complicated API integrations; all the information that's needed is
included in the transferred data.

Think of all the possibilities when you can transfer data between any (web) application with no
restrictions. Sharing events from a calendar to your favorite ToDo app, attaching virtual files to
emails, sharing contacts. That would be great, right? This starts with you! 🙌

## Concerns

While transferring data between web applications with DataTransfer is available and ready to use
today, there are some things to be aware of before integrating.

### Browser compatibility

Desktop browsers all have great support for the technique described above, while mobile devices have
not. The technique has been tested on all major browsers (Chrome, Edge, Firefox, Safari) and
operating systems (Android, Chrome OS, iOS, macOS, Ubuntu Linux, and Windows), but unfortunately Android
and iOS didn't pass the test. While browsers continue to develop, for now the technique is limited
to desktop browsers only.

### Discoverability

Drag-drop and copy-paste are system-level interactions when working on a desktop computer, with
roots back to the first GUIs about 40 years ago. Think for example about how many times you have
used these interactions for organizing files. On the web, this is not very common yet.

You will need to educate users about this new interaction, and come up with UX patterns to make this
recognizable.

### Accessibility

Drag-drop is not a very accessible interaction, but the DataTransfer API works with copy-paste, too.
Please make sure you listen to copy-paste events! It doesn't take much extra work, and your users
will be grateful to you for adding it.

### Security and privacy

There are some security and privacy considerations you should be aware of when using the technique.

- Clipboard data is available to other applications on the user's device.
- Web applications you are dragging over have access to the type keys, not the data. The data only
  becomes available on drop or paste.
- The received data should be treated like any other user input; sanitize and validate before using.

## Getting started with DataTransfer!

Are you excited about using the DataTransfer in your application? Consider taking a look at the
[Transmat library on GitHub](google.github.io/transmat). This open-source library aligns browser
differences, provides JSON-LD utilities, contains an observer to respond to transfer events for
highlighting drop-areas, and lets you integrate DataTransfer along existing drag and drop
implementations.

```js
import { Transmat, TransmatObserver, addListeners } from 'transmat';

// Send data on drag/copy.
addListeners(myElement, 'transmit', (event) => {
  const transmat = new Transmat(event);
  transmat.setData({
    'text/plain': 'Foobar',
    'application/json': { foo: 'bar' },
  });
});

// Receive data on drop/paste.
addListeners(myElement, 'receive', (event) => {
  const transmat = new Transmat(event);
  if (transmat.hasType('application/json') && transmat.accept()) {
    const data = JSON.parse(transmat.getData('application/json'));
  }
});

// Observe transfer events and highlight drop areas.
const obs = new TransmatObserver((entries) => {
  for (const entry of entries) {
    const transmat = new Transmat(entry.event);
    if (transmat.hasMimeType('application/json')) {
      entry.target.classList.toggle('drag-over', entry.isTarget);
      entry.target.classList.toggle('drag-active', entry.isActive);
    }
  }
});
obs.observe(myElement);
```

## Acknowledgements

Hero image by [Luba Ertel](https://unsplash.com/@ertelier) on
[Unsplash](https://unsplash.com/photos/WlL8aHeMcVM).

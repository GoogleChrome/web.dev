---
title: Interact with NFC devices on Chrome for Android
subhead: Reading and writing to NFC tags is now possible.
authors:
  - beaufortfrancois
date: 2020-02-12
updated: 2021-02-23
hero: image/admin/TqG3qb5MiLGNTnAgKtqO.jpg
thumbnail: image/admin/8tWkeYbKLxSd2YgTUSGv.jpg
alt: A photo of NFC tags
description: |
  Reading and writing to NFC tags is now possible on Chrome for Android.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - devices
feedback:
  - api
stack_overflow_tag: webnfc
---

{% Aside 'success' %}
Web NFC, part of the [capabilities project](/fugu-status/), launched in
Chrome&nbsp;89 for Android.
{% endAside %}

## What is Web NFC? {: #what }

NFC stands for Near Field Communications, a short-range wireless technology
operating at 13.56 MHz that enables communication between devices at a distance
less than 10 cm and a transmission rate of up to 424 kbit/s.

Web NFC provides sites the ability to read and write to NFC tags when they are
in close proximity to the user's device (usually 5-10 cm, 2-4 inches).
The current scope is limited to NFC Data Exchange Format (NDEF), a lightweight
binary message format that works across different tag formats.

<figure class="w-figure">
  {% Img src="image/admin/jWmCabXZCB6zNwQIR90I.png", alt="Phone powering up an NFC tag to exchange data", width="800", height="489" %}
  <figcaption class="w-figcaption">Diagram of an NFC operation</figcaption>
</figure>

## Suggested use cases {: #use-cases }

Web NFC is limited to NDEF because the security properties of reading and
writing NDEF data are more easily quantifiable. Low-level I/O operations (e.g.
ISO-DEP, NFC-A/B, NFC-F), Peer-to-Peer communication mode and Host-based Card
Emulation (HCE) are not supported.

Examples of sites that may use Web NFC include:
- Museums and art galleries can display additional information about a display
  when the user touches their device to an NFC card near the exhibit.
- Inventory management sites can read or write data to the NFC tag on a
  container to update information on its contents.
- Conference sites can use it to scan NFC badges during the event.
- Sites can use it for sharing initial secrets needed for device or service
  provisioning scenarios and also to deploy configuration data in operational
  mode.

<figure class="w-figure">
  {% Img src="image/admin/zTEXhIx9nDWtbKrIPN0x.png", alt="Phone scanning several NFC tags", width="800", height="383" %}
  <figcaption class="w-figcaption">NFC inventory management illustrated</figcaption>
</figure>

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                       | Status                       |
| ------------------------------------------ | ---------------------------- |
| 1. Create explainer                        | [Complete][explainer]        |
| 2. Create initial draft of specification   | [Complete][spec]             |
| 3. Gather feedback & iterate on design     | [Complete](#feedback)        |
| 4. Origin trial                            | [Complete][ot]               |
| **5. Launch**                              | **Complete**                 |

</div>

## Using Web NFC {: #use }

### Feature detection {: #feature-detection }

Feature detection for hardware is different from what you're probably used to.
The presence of `NDEFReader` tells you that the browser supports Web NFC, but
not whether the required hardware is present. In particular, if the hardware is
missing, the promise returned by certain calls will reject. I'll provide
details when I describe `NDEFReader`.

```js
if ('NDEFReader' in window) { /* Scan and write NFC tags */ }
```

### Terminology {: #terminology }

An NFC tag is a passive NFC device, meaning that is powered by magnetic
induction when an active NFC device (.e.g a phone) is in proximity. NFC tags
come in many forms and fashions, as stickers, credit cards, arm wrists, etc.

<figure class="w-figure">
  {% Img src="image/admin/uUBxSkSc3MJBG8Lw52fV.jpg", alt="Photo of a transparent NFC tag", width="800", height="450" %}
  <figcaption class="w-figcaption">A transparent NFC tag</figcaption>
</figure>

The `NDEFReader` object is the entry point in Web NFC that exposes functionality
for preparing reading and/or writing actions that are fulfilled when an NDEF tag
comes in proximity. The `NDEF` in `NDEFReader` stands for NFC Data Exchange
Format, a lightweight binary message format standardized by the [NFC Forum].

The `NDEFReader` object is for acting on incoming NDEF messages from NFC tags
and for writing NDEF messages to NFC tags within range.

An NFC tag that supports NDEF is like a post-it note. Anyone can read it, and
unless it is read-only, anyone can write to it. It contains a single NDEF
message which encapsulates one or more NDEF records. Each NDEF record is a
binary structure that contains a data payload, and associated type information.
Web NFC supports the following NFC Forum standardized record types: empty, text,
URL, smart poster, MIME type, absolute URL, external type, unknown, and local
type.

<figure class="w-figure">
  {% Img src="image/admin/50clBWSJbKkyumsxrioB.png", alt="Diagram of an NDEF message", width="800", height="243" %}
  <figcaption class="w-figcaption">Diagram of an NDEF message</figcaption>
</figure>

### Scan NFC tags {: #scan }

To scan NFC tags, first instantiate a new `NDEFReader` object. Calling `scan()`
returns a promise. The [user may be prompted] if access was not previously
granted. The promise will resolve if the following conditions are all met:

- User has allowed the website to interact with NFC devices when they tap their
  phone.
- The user's phone supports NFC.
- The user has enabled NFC on their phone.

Once the promise is resolved, incoming NDEF messages are available by
subscribing to `reading` events via an event listener. You should also subscribe
to `readingerror` events to be notified when incompatible NFC tags are in
proximity.

```js
const ndef = new NDEFReader();
ndef.scan().then(() => {
  console.log("Scan started successfully.");
  ndef.onreadingerror = () => {
    console.log("Cannot read data from the NFC tag. Try another one?");
  };
  ndef.onreading = event => {
    console.log("NDEF message read.");
  };
}).catch(error => {
  console.log(`Error! Scan failed to start: ${error}.`);
});
```

When an NFC tag is in proximity, a `NDEFReadingEvent` event is fired. It
contains two properties unique to it:

- `serialNumber` represents the serial number of the device (.e.g
  00-11-22-33-44-55-66), or an empty string if none is available.
- `message` represents the NDEF message stored in the NFC tag.

To read the content of the NDEF message, loop through `message.records` and
process their `data` members [appropriately] based on their `recordType`.
The `data` member is exposed as a <code>[DataView]</code> as it allows handling
cases where data is encoded in UTF-16.

```js
ndef.onreading = event => {
  const message = event.message;
  for (const record of message.records) {
    console.log("Record type:  " + record.recordType);
    console.log("MIME type:    " + record.mediaType);
    console.log("Record id:    " + record.id);
    switch (record.recordType) {
      case "text":
        // TODO: Read text record with record data, lang, and encoding.
        break;
      case "url":
        // TODO: Read URL record with record data.
        break;
      default:
        // TODO: Handle other records with record data.
    }
  }
};
```

{% Aside %}
The [cookbook](#cookbook) contains many examples of how to read NDEF records based on
their types.
{% endAside %}

### Write NFC tags {: #write }

To write NFC tags, first instantiate a new `NDEFReader` object. Calling
`write()` returns a promise. The [user may be prompted] if access was not
previously granted. At this point, an NDEF message is "prepared" and promise
will resolve if the following conditions are all met:

- User has allowed the website to interact with NFC devices when they tap their
  phone.
- The user's phone supports NFC.
- The user has enabled NFC on their phone.
- User has tapped an NFC tag and an NDEF message has been successfully written.

To write text to an NFC tag, pass a string to the `write()` method.

```js
const ndef = new NDEFReader();
ndef.write(
  "Hello World"
).then(() => {
  console.log("Message written.");
}).catch(error => {
  console.log(`Write failed :-( try again: ${error}.`);
});
```

To write a URL record to an NFC tag, pass a dictionary that represents an NDEF
message to `write()`. In the example below, the NDEF message is a dictionary
with a `records` key. Its value is an array of records - in this case, a URL
record defined as an object with a `recordType` key set to `"url"` and a `data`
key set to the URL string.

```js
const ndef = new NDEFReader();
ndef.write({
  records: [{ recordType: "url", data: "https://w3c.github.io/web-nfc/" }]
}).then(() => {
  console.log("Message written.");
}).catch(error => {
  console.log(`Write failed :-( try again: ${error}.`);
});
```

It is also possible to write multiple records to an NFC tag.

```js
const ndef = new NDEFReader();
ndef.write({ records: [
    { recordType: "url", data: "https://w3c.github.io/web-nfc/" },
    { recordType: "url", data: "https://web.dev/nfc/" }
]}).then(() => {
  console.log("Message written.");
}).catch(error => {
  console.log(`Write failed :-( try again: ${error}.`);
});
```

{% Aside %}
The [cookbook](#cookbook) contains many examples of how to write other types of
NDEF records.
{% endAside %}

If the NFC tag contains an NDEF message that is not meant to be overwritten, set
the `overwrite` property to `false` in the options passed to the `write()`
method. In that case, the returned promise will reject if an NDEF message is
already stored in the NFC tag.

```js
const ndef = new NDEFReader();
ndef.write("Writing data on an empty NFC tag is fun!", { overwrite: false })
.then(() => {
  console.log("Message written.");
}).catch(_ => {
  console.log(`Write failed :-( try again: ${error}.`);
});
```

### Security and permissions {: #security-and-permissions }

The Chrome team has designed and implemented Web NFC using the core principles
defined in [Controlling Access to Powerful Web Platform
Features][powerful-apis], including user control, transparency, and ergonomics.

Because NFC expands the domain of information potentially available to malicious
websites, the availability of NFC is restricted to maximize users' awareness and
control over NFC use.

<figure class="w-figure">
  {% Img src="image/admin/PjUcOk4zbtOFJLXfSeSD.png", alt="Screenshot of a Web NFC prompt on a website", width="800", height="407" %}
  <figcaption class="w-figcaption">Web NFC user prompt</figcaption>
</figure>

Web NFC is only available to top-level frames and secure browsing contexts (HTTPS
only). Origins must first request the `"nfc"` [permission] while handling a
user gesture (e.g a button click). The NDEFReader `scan()` and `write()` methods
trigger a user prompt, if access was not previously granted.

```js
  document.querySelector("#scanButton").onclick = async () => {
    const ndef = new NDEFReader();
    // Prompt user to allow website to interact with NFC devices.
    await ndef.scan();
    ndef.onreading = event => {
      // TODO: Handle incoming NDEF messages.
    };
  };
```

The combination of a user-initiated permission prompt and real-world, physical
movement of bringing the device over a target NFC tag mirrors the chooser
pattern found in the other file and device-access APIs.

To perform a scan or write, the web page must be visible when the user touches
an NFC tag with their device. The browser uses haptic feedback to indicate a
tap. Access to the NFC radio is blocked if the display is off or the device is
locked. For non visible web pages, receiving and pushing NFC content are
suspended, and resumed when a web page becomes visible again.

Thanks to the [Page Visibility API], it is possible to track when document
visibility changes.

```js
document.onvisibilitychange = event => {
  if (document.hidden) {
    // All NFC operations are automatically suspended when document is hidden.
  } else {
    // All NFC operations are resumed, if needed.
  }
};
```

## Cookbook {: #cookbook }

Here's some code samples to get you started.

### Check for permission

The [Permissions API] allows checking whether the `"nfc"` permission was
granted. This example shows how to scan NFC tags without user interaction if
access was previously granted, or show a button otherwise. Note that the same
mechanism works for writing NFC tags as it uses the same permission under the
hood.

```js
const ndef = new NDEFReader();

async function startScanning() {
  await ndef.scan();
  ndef.onreading = event => {
    /* handle NDEF messages */
  };
}

const nfcPermissionStatus = await navigator.permissions.query({ name: "nfc" });
if (nfcPermissionStatus.state === "granted") {
  // NFC access was previously granted, so we can start NFC scanning now.
  startScanning();
} else {
  // Show a "scan" button.
  document.querySelector("#scanButton").style.display = "block";
  document.querySelector("#scanButton").onclick = event => {
    // Prompt user to allow UA to send and receive info when they tap NFC devices.
    startScanning();
  };
}
```

### Abort NFC operations

Using the <code>[AbortController]</code> primitive makes it easy to abort NFC
operations. The example below shows you how to pass the `signal` of an
`AbortController` through the options of NDEFReader `scan()` and `write()`
methods and abort both NFC operations at the same time.

```js
const abortController = new AbortController();
abortController.signal.onabort = event => {
  // All NFC operations have been aborted.
};

const ndef = new NDEFReader();
await ndef.scan({ signal: abortController.signal });

await ndef.write("Hello world", { signal: abortController.signal });

document.querySelector("#abortButton").onclick = event => {
  abortController.abort();
};
```

### Read and write a text record

The text record `data` can be decoded with a `TextDecoder` instantiated with the
record `encoding` property. Note that the language of the text record is
available through its `lang` property.

```js
function readTextRecord(record) {
  console.assert(record.recordType === "text");
  const textDecoder = new TextDecoder(record.encoding);
  console.log(`Text: ${textDecoder.decode(record.data)} (${record.lang})`);
}
```

To write a simple text record, pass a string to the NDEFReader `write()` method.

```js
const ndef = new NDEFReader();
await ndef.write("Hello World");
```

Text records are UTF-8 by default and assume the current document's language but
both properties (`encoding` and `lang`) can be specified using the full syntax
for creating a custom NDEF record.

```js
function a2utf16(string) {
  let result = new Uint16Array(string.length);
  for (let i = 0; i < string.length; i++) {
    result[i] = string.codePointAt(i);
  }
  return result;
}

const textRecord = {
  recordType: "text",
  lang: "fr",
  encoding: "utf-16",
  data: a2utf16("Bonjour, François !")
};

const ndef = new NDEFReader();
await ndef.write({ records: [textRecord] });
```

### Read and write a URL record

Use `TextDecoder` to decode the record's `data`.

```js
function readUrlRecord(record) {
  console.assert(record.recordType === "url");
  const textDecoder = new TextDecoder();
  console.log(`URL: ${textDecoder.decode(record.data)}`);
}
```

To write a URL record, pass an NDEF message dictionary to the NDEFReader
`write()` method. The URL record contained in the NDEF message is defined as an
object with a `recordType` key set to `"url"` and a `data` key set to the URL
string.

```js
const urlRecord = {
  recordType: "url",
  data:"https://w3c.github.io/web-nfc/"
};

const ndef = new NDEFReader();
await ndef.write({ records: [urlRecord] });
```

### Read and write a MIME type record

The `mediaType` property of a MIME type record represents the MIME type of the
NDEF record payload so that `data` can be properly decoded. For instance, use
`JSON.parse` to decode JSON text and an Image element to decode image data.

```js
function readMimeRecord(record) {
  console.assert(record.recordType === "mime");
  if (record.mediaType === "application/json") {
    const textDecoder = new TextDecoder();
    console.log(`JSON: ${JSON.parse(decoder.decode(record.data))}`);
  }
  else if (record.mediaType.startsWith('image/')) {
    const blob = new Blob([record.data], { type: record.mediaType });
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    document.body.appendChild(img);
  }
  else {
    // TODO: Handle other MIME types.
  }
}
```

To write a MIME type record, pass an NDEF message dictionary to the NDEFReader
`write()` method. The MIME type record contained in the NDEF message is defined
as an object with a `recordType` key set to `"mime"`, a `mediaType` key set to
the actual MIME type of the content, and a `data` key set to an object that can
be either an `ArrayBuffer` or provides a view on to an `ArrayBuffer` (e.g.
`Uint8Array`, `DataView`).

```js
const encoder = new TextEncoder();
const data = {
  firstname: "François",
  lastname: "Beaufort"
};
const jsonRecord = {
  recordType: "mime",
  mediaType: "application/json",
  data: encoder.encode(JSON.stringify(data))
};

const imageRecord = {
  recordType: "mime",
  mediaType: "image/png",
  data: await (await fetch("icon1.png")).arrayBuffer()
};

const ndef = new NDEFReader();
await ndef.write({ records: [jsonRecord, imageRecord] });
```

### Read and write an absolute-URL record

The absolute-URL record `data` can be decoded with a simple `TextDecoder`.

```js
function readAbsoluteUrlRecord(record) {
  console.assert(record.recordType === "absolute-url");
  const textDecoder = new TextDecoder();
  console.log(`Absolute URL: ${textDecoder.decode(record.data)}`);
}
```

To write an absolute URL record, pass an NDEF message dictionary to the
NDEFReader `write()` method. The absolute-URL record contained in the NDEF
message is defined as an object with a `recordType` key set to `"absolute-url"`
and a `data` key set to the URL string.

```js
const absoluteUrlRecord = {
  recordType: "absolute-url",
  data:"https://w3c.github.io/web-nfc/"
};

const ndef = new NDEFReader();
await ndef.write({ records: [absoluteUrlRecord] });
```

### Read and write a smart poster record

A smart poster record (used in magazine advertisements, fliers, billboards,
etc.), describes some web content as an NDEF record that contains an NDEF
message as its payload. Call `record.toRecords()` to transform `data` to a list
of records contained in the smart poster record. It should have a URL record, a
text record for the title, a MIME type record for the image, and some [custom
local type records] such as `":t"`, `":act"`, and `":s"` respectively for the
type, action, and size of the smart poster record.

Local type records are unique only within the local context of the containing
NDEF record. Use them when the meaning of the types doesn't matter outside
of the local context of the containing record and when storage usage is a hard
constraint. Local type record names always start with `:` in Web NFC (e.g.
`":t"`, `":s"`, `":act"`). This is to differentiate a text record from a local
type text record for instance.

```js
function readSmartPosterRecord(smartPosterRecord) {
  console.assert(record.recordType === "smart-poster");
  let action, text, url;

  for (const record of smartPosterRecord.toRecords()) {
    if (record.recordType == "text") {
      const decoder = new TextDecoder(record.encoding);
      text = decoder.decode(record.data);
    } else if (record.recordType == "url") {
      const decoder = new TextDecoder();
      url = decoder.decode(record.data);
    } else if (record.recordType == ":act") {
      action = record.data.getUint8(0);
    } else {
      // TODO: Handle other type of records such as `:t`, `:s`.
    }
  }

  switch (action) {
    case 0:
      // Do the action
      break;
    case 1:
      // Save for later
      break;
    case 2:
      // Open for editing
      break;
  }
}
```

To write a smart poster record, pass an NDEF message to the NDEFReader `write()`
method. The smart poster record contained in the NDEF message is defined as an
object with a `recordType` key set to `"smart-poster"` and a `data` key set to
an object that represents (once again) an NDEF message contained in the
smart poster record.

```js
const encoder = new TextEncoder();
const smartPosterRecord = {
  recordType: "smart-poster",
  data: {
    records: [
      {
        recordType: "url", // URL record for smart poster content
        data: "https://my.org/content/19911"
      },
      {
        recordType: "text", // title record for smart poster content
        data: "Funny dance"
      },
      {
        recordType: ":t", // type record, a local type to smart poster
        data: encoder.encode("image/gif") // MIME type of smart poster content
      },
      {
        recordType: ":s", // size record, a local type to smart poster
        data: new Uint32Array([4096]) // byte size of smart poster content
      },
      {
        recordType: ":act", // action record, a local type to smart poster
        // do the action, in this case open in the browser
        data: new Uint8Array([0])
      },
      {
        recordType: "mime", // icon record, a MIME type record
        mediaType: "image/png",
        data: await (await fetch("icon1.png")).arrayBuffer()
      },
      {
        recordType: "mime", // another icon record
        mediaType: "image/jpg",
        data: await (await fetch("icon2.jpg")).arrayBuffer()
      }
    ]
  }
};

const ndef = new NDEFReader();
await ndef.write({ records: [smartPosterRecord] });
```

### Read and write an external type record

To create application defined records, use external type records. These may
contain an NDEF message as payload that is accessible with `toRecords()`. Their
name contains the domain name of the issuing organization, a colon and a type
name that is at least one character long, for instance `"example.com:foo"`.

```js
function readExternalTypeRecord(externalTypeRecord) {
  for (const record of externalTypeRecord.toRecords()) {
    if (record.recordType == "text") {
      const decoder = new TextDecoder(record.encoding);
      console.log(`Text: ${textDecoder.decode(record.data)} (${record.lang})`);
    } else if (record.recordType == "url") {
      const decoder = new TextDecoder();
      console.log(`URL: ${decoder.decode(record.data)}`);
    } else {
      // TODO: Handle other type of records.
    }
  }
}
```

To write an external type record, pass an NDEF message dictionary to the
NDEFReader `write()` method. The external type record contained in the NDEF
message is defined as an object with a `recordType` key set to the name of the
external type and a `data` key set to an object that represents an NDEF message
contained in the external type record. Note that the `data` key can also be
either an `ArrayBuffer` or provides a view on to an `ArrayBuffer` (e.g.
`Uint8Array`, `DataView`).

```js
const externalTypeRecord = {
  recordType: "example.game:a",
  data: {
    records: [
      {
        recordType: "url",
        data: "https://example.game/42"
      },
      {
        recordType: "text",
        data: "Game context given here"
      },
      {
        recordType: "mime",
        mediaType: "image/png",
        data: await (await fetch("image.png")).arrayBuffer()
      }
    ]
  }
};

const ndef = new NDEFReader();
ndef.write({ records: [externalTypeRecord] });
```

### Read and write an empty record

An empty record has no payload.

To write an empty record, pass an NDEF message dictionary to the NDEFReader
`write()` method. The empty record contained in the NDEF message is defined as
an object with a `recordType` key set to `"empty"`.

```js
const emptyRecord = {
  recordType: "empty"
};

const ndef = new NDEFReader();
await ndef.write({ records: [emptyRecord] });
```

## Browser support {: #browser-support }

Web NFC is available on Android in Chrome 89.

## Dev Tips

Here's a list of things I wish I had known when I started playing with Web NFC:

- Android handles NFC tags at the OS-level before Web NFC is operational.
- You can find an NFC icon on [material.io].
- Use NDEF record `id` to easily identifying a record when needed.
- An unformatted NFC tag that supports NDEF contains a single record of the empty type.
- Writing an [android application record] is easy, as shown below.

```js
const encoder = new TextEncoder();
const aarRecord = {
  recordType: "android.com:pkg",
  data: encoder.encode("com.example.myapp")
};

const ndef = new NDEFReader();
await ndef.write({ records: [aarRecord] });
```

## Demos {: #demos }

Try out the [official sample] and check out some cool Web NFC demos:
- [Cards demo]
- [Grocery Demo]
- [Intel RSP Sensor NFC]
- [Media MEMO]

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/webfundamentals-assets/videos/web-nfc-cards-demo.mp4">
  </video>
  <figcaption class="w-figcaption">
    Web NFC cards demo at Chrome Dev Summit 2019
  </figcaption>
</figure>

## Feedback {: #feedback }

The [Web NFC Community Group](https://www.w3.org/community/web-nfc/) and the
Chrome team would love to hear about your thoughts and experiences with Web NFC.

### Tell us about the API design

Is there something about the API that doesn't work as expected? Or are there
missing methods or properties that you need to implement your idea?

File a spec issue on the [Web NFC GitHub repo][issues] or add your thoughts to
an existing issue.

### Report a problem with the implementation

Did you find a bug with Chrome's implementation? Or is the implementation
different from the spec?

File a bug at [https://new.crbug.com][new-bug]. Be sure to include as much
detail as you can, provide simple instructions for reproducing the bug, and have
*Components* set to `Blink>NFC`. [Glitch](https://glitch.com) works great for
sharing quick and easy repros.

### Show support

Are you planning to use Web NFC? Your public support helps the Chrome team
prioritize features and shows other browser vendors how critical it is to
support them.

Send a tweet to [@ChromiumDev][cr-dev-twitter] using the hashtag
[`#WebNFC`](https://twitter.com/search?q=%23WebNFC&src=typed_query&f=live)
and let us know where and how you're using it.

## Helpful links {: #helpful }

* [Specification][spec]
* [Web NFC Demo][demo] | [Web NFC Demo source][demo-source]
* [Tracking bug][cr-bug]
* [ChromeStatus.com entry][cr-status]
* Blink Component: [`Blink>NFC`](https://chromestatus.com/features#component%3ABlink%3ENFC)

## Acknowledgements

Big thanks to the [folks at Intel] for implementing Web NFC. Google Chrome
depends on a community of committers working together to move the Chromium
project forward. Not every Chromium committer is a Googler, and these
contributors deserve special recognition!

[explainer]: https://github.com/w3c/web-nfc/blob/gh-pages/EXPLAINER.md#web-nfc-explained
[spec]: https://w3c.github.io/web-nfc/
[ot]: https://developers.chrome.com/origintrials/#/view_trial/236438980436951041
[issues]: https://github.com/w3c/web-nfc/issues
[demo]: https://web-nfc-demo.glitch.me/
[demo-source]: https://glitch.com/edit/#!/web-nfc-demo?path=script.js:1:0
[new-bug]: https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3ENFC
[cr-dev-twitter]: https://twitter.com/chromiumdev
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=520391
[cr-status]: https://www.chromestatus.com/feature/6261030015467520
[powerful-apis]: https://chromium.googlesource.com/chromium/src/+/master/docs/security/permissions-for-powerful-web-platform-features.md
[Permissions API]: https://www.w3.org/TR/permissions/
[AbortController]: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
[Page Visibility API]: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
[user may be prompted]: #security-and-permissions
[permission]: https://w3c.github.io/permissions/
[folks at Intel]: https://github.com/w3c/web-nfc/graphs/contributors
[android application record]: https://developer.android.com/guide/topics/connectivity/nfc/nfc#aar
[NFC forum]: https://nfc-forum.org/
[android application record]: https://developer.android.com/guide/topics/connectivity/nfc/nfc#aar
[official sample]: https://googlechrome.github.io/samples/web-nfc/
[Cards demo]: https://web-nfc-demo.glitch.me
[Grocery Demo]: https://kenchris.github.io/webnfc-groceries
[Media MEMO]: https://webnfc-media-memo.netlify.com/
[Intel RSP Sensor NFC]: https://kenchris.github.io/webnfc-rsp/
[material.io]: https://material.io/resources/icons/?icon=nfc&style=baseline
[appropriately]: https://w3c.github.io/web-nfc/#data-mapping
[custom local type records]: https://w3c.github.io/web-nfc/#smart-poster-record
[DataView]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView

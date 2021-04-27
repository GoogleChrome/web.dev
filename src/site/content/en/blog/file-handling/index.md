---
title: Let web applications be file handlers
subhead: Register an app as a file handler with the operating system.
authors:
  - thomassteiner
Description: |
  Register an app as a file handler with the operating system
  and open files with their proper app.
date: 2020-10-22
updated: 2020-11-02
tags:
  - blog
  - file-handling
hero: image/admin/tf0sUZX6G7AM8PvU1t0B.jpg
alt: Binders in many colors.
origin_trial:
  url:
---

{% Aside %}
  The File Handling API is part of the
  [capabilities project](/fugu-status/) and is currently in development. This post will
  be updated as the implementation progresses.
{% endAside %}

Now that web apps are [capable of reading and writing files](/file-system-access/), the next logical
step is to let developers declare these very web apps as file handlers for the files their apps can
create and process. The File Handling API allows you to do exactly this.
After registering a text editor app as a file handler, you can right-click a `.txt` file on macOS
and select "Get Info" to then instruct the OS that it should always open `.txt` files with this app as default.

### Suggested use cases for the File Handling API {: #use-cases }

Examples of sites that may use this API include:

- Office applications like text editors, spreadsheet apps, and slideshow creators.
- Graphics editors and drawing tools.
- Video game level editor tools.

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                     | Status                   |
| ---------------------------------------- | ------------------------ |
| 1. Create explainer                      | [Complete][explainer]    |
| 2. Create initial draft of specification | Not started              |
| 3. Gather feedback & iterate on design   | [In progress](#feedback) |
| 4. Origin trial                          | Not started              |
| 5. Launch                                | Not started              |

</div>

## How to use the File Handling API {: #use }

### Enabling via chrome://flags

To experiment with the File Handling API locally, without an origin trial token, enable the
`#file-handling-api` flag in `chrome://flags`.

### Progressive enhancement

The File Handling API per se cannot be polyfilled. The functionality of opening files with a web
app, however, can be achieved through two other means:

- The [Web Share Target API](/web-share-target/) lets developers specify their app as a share target
  so files can be opened from the operating system's share sheet.
- The [File System Access API](/file-system-access/) can be integrated with file drag and drop, so
  developers can handle dropped files in the already opened app.

### Feature detection

To check if the File Handling API is supported, use:

```javascript
if ('launchQueue' in window) {
  // The File Handling API is supported.
}
```

### The declarative part of the File Handling API

As a first step, web apps need to declaratively describe in their [Web App Manifest](/add-manifest/)
what kind of files they can handle. The File Handling API extends Web App Manifest with a new
property called `"file_handlers"` that accepts an array of, well, file handlers. A file handler is an
object with two properties:

- An `"action"` property that points to a URL within the scope of the app as its value.
- An `"accept"` property with an object of MIME-types as keys and lists of file extensions as their
  values.

The example below, showing only the relevant excerpt of the Web App Manifest, should make it clearer:

```json
{
  …
  "file_handlers": [
    {
      "action": "/open-csv",
      "accept": {
        "text/csv": [".csv"]
      }
    },
    {
      "action": "/open-svg",
      "accept": {
        "image/svg+xml": ".svg"
      }
    },
    {
      "action": "/open-graf",
      "accept": {
        "application/vnd.grafr.graph": [".grafr", ".graf"],
        "application/vnd.alternative-graph-app.graph": ".graph"
      }
    }
  ],
  …
}
```

This is for a hypothetical application that handles comma-separated value (`.csv`) files at `/open-csv`,
scalable vector graphics (`.svg`) files at `/open-svg`, and a made-up Grafr file format with any of
`.grafr`, `.graf`, or `.graph` as the extension at `/open-graf`.

{% Aside %} For this declaration to have any effect, the application must be installed. You can
learn more in an article series on this very site on
[making your app installable](/progressive-web-apps/#installable). {% endAside %}

### The imperative part of the File Handling API

Now that the app has declared what files it can handle at which in-scope URL in theory, it needs to
imperatively do something with incoming files in practice. This is where the `launchQueue` comes
into play. To access launched files, a site needs to specify a consumer for the `window.launchQueue` object.
Launches are queued until they are handled by the specified consumer, which is invoked
exactly once for each launch. In this manner, every launch is handled, regardless of when the
consumer was specified.

```js
if ('launchQueue' in window) {
  launchQueue.setConsumer((launchParams) => {
    // Nothing to do when the queue is empty.
    if (!launchParams.files.length) {
      return;
    }
    for (const fileHandle of launchParams.files) {
      // Handle the file.
    }
  });
}
```

### DevTools support

There is no DevTools support at the time of this writing, but I have filed a
[feature request](https://bugs.chromium.org/p/chromium/issues/detail?id=1130552) for support to be
added.

## Demo

I have added file handling support to [Excalidraw][demo], a cartoon-style drawing app. When you
create a file with it and store it somewhere on your file system, you can open the file via a
double click, or a right click and then select "Excalidraw" in the context menu. You can check
out the [implementation][demo-source] in the source code.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TMh8Qev0XdwgIx7jJlP5.png", alt="The macOS finder window with an Excalidraw file.", width="800", height="422", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">
     Double click or right click a file in your operating system's file explorer.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wCNbMl6kJ11XziG3LO65.png", alt="The context menu that appears when right clicking a file with the 'Open with… Excalidraw' item highlighted.", width="488", height="266", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">
     Excalidraw is the default file handler for <code>.excalidraw</code> files.
  </figcaption>
</figure>

## Security and permissions

The Chrome team has designed and implemented the File Handling API using the core principles defined
in [Controlling Access to Powerful Web Platform Features][powerful-apis], including user control,
transparency, and ergonomics.

### File-related challenges

There is a large category of attack vectors that are opened by allowing websites access to files.
These are outlined in the
[article on the File System Access API](/file-system-access/#security-considerations). The
additional security-pertinent capability that the File Handling API provides over the File System
Access API is the ability to grant access to certain files through the operating system's built-in
UI, as opposed to through a file picker shown by a web application. Any restrictions as to the files
and folders that can be opened via the picker will also be applied to the files and folders opened
via the operating system.

There is still a risk that users may unintentionally grant a web application access to a file by
opening it. However, it is generally understood that opening a file allows the application it is
opened with to read and/or manipulate that file. Therefore, a user's explicit choice to open a file
in an installed application, such as via an "Open with…" context menu, can be read as a sufficient
signal of trust in the application.

### Default handler challenges

The exception to this is when there are no applications on the host system for a given file
type. In this case, some host operating systems may
automatically promote the newly registered handler to the default handler for that file type,
silently and without any intervention by the user. This would mean if the user double clicks a file
of that type, it would automatically open in the registered web app. On such host operating systems,
when the user agent determines that there is no existing default handler for the file type, an
explicit permission prompt might be necessary to avoid accidentally sending the contents of a file
to a web application without the user's consent.

### User control

The spec states that browsers should not register every site that can handle files as a file handler.
Instead, file handling registration should be gated behind installation
and never happen without explicit user confirmation, especially if a site is to become the default handler.
Rather than hijacking existing extensions like `.json` that the user probably already has
a default handler registered for, sites should consider crafting their own extensions.

### Transparency

All operating systems allow users to change the present file associations. This is outside the scope
of the browser.

## Feedback {: #feedback }

The Chrome team wants to hear about your experiences with the File Handling API.

### Tell us about the API design

Is there something about the API that doesn't work like you expected? Or are there missing methods
or properties that you need to implement your idea? Have a question or comment on the security
model?

- File a spec issue on the corresponding [GitHub repo][issues], or add your thoughts to an existing
  issue.

### Report a problem with the implementation

Did you find a bug with Chrome's implementation? Or is the implementation different from the spec?

- File a bug at [new.crbug.com](https://new.crbug.com). Be sure to include as much detail as you
  can, simple instructions for reproducing, and enter `UI>Browser>WebAppInstalls>FileHandling` in the
  **Components** box. [Glitch](https://glitch.com/) works great for sharing quick and easy repros.

### Show support for the API

Are you planning to use the File Handling API? Your public support helps the Chrome team to
prioritize features and shows other browser vendors how critical it is to support them.

- Share how you plan to use it on the [WICG Discourse thread][wicg-discourse].
- Send a tweet to [@ChromiumDev][cr-dev-twitter] using the hashtag
  [`#FileHandling`](https://twitter.com/search?q=%23FileHandling&src=typed_query&f=live)
  and let us know where and how you are using it.

## Helpful links {: #helpful }

- [Public explainer][explainer]
- [File Handling API demo][demo] | [File Handling API demo source][demo-source]
- [Chromium tracking bug][cr-bug]
- [ChromeStatus.com entry][cr-status]
- Blink Component: [`UI>Browser>WebAppInstalls>FileHandling`][blink-component]

### Wanna go deeper {: #deeper-links }

- [TAG Review](https://github.com/w3ctag/design-reviews/issues/371)
- [Mozilla Standards Position](https://github.com/mozilla/standards-positions/issues/158)

## Acknowledgements

The File Handling API was specified by [Eric Willigers](https://github.com/ericwilligers),
[Jay Harris](https://github.com/fallaciousreasoning), and
[Raymes Khoury](https://github.com/raymeskhoury). This article was reviewed by
[Joe Medley](https://github.com/jpmedley).

[spec]: https://wicg.github.io/file-handling/
[issues]: https://github.com/WICG/file-handling/issues
[demo]: https://excalidraw.com/
[demo-source]: https://github.com/excalidraw/excalidraw/search?q=launchqueue&type=code
[explainer]: https://github.com/WICG/file-handling/blob/master/explainer.md
[wicg-discourse]: https://discourse.wicg.io/t/proposal-ability-to-register-file-handlers/3084
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=829689
[cr-status]: https://chromestatus.com/feature/5721776357113856
[blink-component]:
  https://bugs.chromium.org/p/chromium/issues/list?q=component:UI%3EBrowser%3EWebAppInstalls%3EFileHandling
[cr-dev-twitter]: https://twitter.com/ChromiumDev
[powerful-apis]:
  https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md

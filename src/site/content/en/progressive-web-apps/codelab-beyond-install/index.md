---
layout: codelab
title: Integrate your PWA with the Operating System
authors:
  - ajara
date: 2022-10-06
description: |
  Go from a simple installable web app, to an app that takes advantages of PWA's operating systems integrations to give users a more engaging experience.
glitch: pwa-os-integrations-starter?path=script.js
related_post: customize-install
tags:
  - progressive-web-apps
---

This glitch already contains the critical components required to make a
Web App installable, including a
[very simple service worker](https://glitch.com/edit/#!/pwa-os-integrations-starter?path=service-worker.js)
and a
[web app manifest](https://glitch.com/edit/#!/pwa-os-integrations-starter?path=manifest.json).

## Add richer install ui

1. Add a description and screenshots to your `manifest.json` and Chrome will display a UI that provides more space to show off your app.
   The [richer install UI] (https://developer.chrome.com/blog/richer-pwa-installation/) is closer to a traditional app installation dialog and teaches users it is possible to install apps directly from the browser.

{% Instruction 'remix', 'ol' %}

Code:

```json
"screenshots":[
    {
      "src":"https://cdn.glitch.global/e502b7ec-f2fd-4a10-9dad-38bc95ce8db3/Screenshot_20221006-104639.png?v=1665099797069", "sizes":"1440x3120",
      "type":"image/png"
    },
    {
      "src":"https://cdn.glitch.global/e502b7ec-f2fd-4a10-9dad-38bc95ce8db3/Screenshot_20221006-104648.png?v=1665099813078", "sizes":"1440x3120",
      "type":"image/png"
    }
  ],
"description": "We all need to count things, this app is your best friend, you can *count* on it!",
```

## Add app shortcuts

Save your users time by adding shortcuts to frequently used tasks.

1. `shortcuts` is an array on your `manifest`. You specify each shortcut with `name`, `url`, `description` and `icons`. [Shortcuts](/app-shortcuts/) are supported on Android, Windows, MacOS and ChromeOS.
2. Add the code that will handle the shortcuts, in the code lab we have an event handler where we parse query string and do actions based on the parameters. We use shortcuts to start the counter at a specific number.

Shortcuts become available after the user installs the app.

Code:

```json
"shortcuts": [
    {
      "name": "Start at 10",
      "url": "index.html?start=10",
      "description": "Starts counting at 10",
      "icons": [
        {
          "src": "https://cdn.glitch.global/e502b7ec-f2fd-4a10-9dad-38bc95ce8db3/shortcut-10.png?v=1664923103066",
          "sizes": "96x96"
        }
      ]
    },
    {
      "name": "Start at 20",
      "url": "index.html?start=20",
      "description": "Starts counting at 20",
      "icons": [
        {
          "src": "https://cdn.glitch.global/e502b7ec-f2fd-4a10-9dad-38bc95ce8db3/shortcut-20.png?v=1664923104676",
          "sizes": "96x96"
        }
      ]
    }
  ],

```

```js
document.addEventListener('DOMContentLoaded', async function () {
  //gets the query string
  let qs = new URLSearchParams(document.location.search);

  // Add code to handle shortcuts here
  if (qs.has('start')) {
    let shortcutStart = qs.get('start');
    document.querySelector('#counter').innerText = shortcutStart;
  }
});
```

## Interact with other apps by sharing

Once your app is installed it can interact with other apps in the platform and be more engaging by sharing with other apps.

1. Check if the browser support `navigator.share`
2. With the `share` method you can share data like `title`, `url` and `text`
3. For sharing other types of data check the article [here](/web-share/)

Code:

Add this code to the [script](https://glitch.com/edit/#!/pwa-os-integrations-starter?path=script.js) file

```js
shareB.addEventListener('click', (e) => {
  /** Add share code here **/
  const shareData = {
    title: 'Counter',
    text: `The current count is ${parseInt(counterEl.innerText)}!`,
    url: `https://os-integrations-result.glitch.me/?start=${parseInt(
      counterEl.innerText,
    )}`,
  };

  if (navigator.share) {
    navigator
      .share(sharedData)
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
  }
});
```

## Receive data from other apps by configuring share target

If your app can process data that can be shared between apps you can use the share target API to register your app as an option.

1. Add the `share_target` member to the manifest.
2. Add the code to handle the shared data. In hour case counts the text length and sets it to the counter.
3. Make sure the code that handles the share data is cached locally at install time.

```json
"share_target": {
    "action": "/index.html",
    "method": "GET",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url"
    }
  }
```

```js

document.addEventListener('DOMContentLoaded', async function() {
    //gets the query string
    let qs = new URLSearchParams(document.location.search);

    //...

  // Add code to handle share target here.
    if(qs.has('url') || qs.has('text') || qs.has('title')) {
        let total = 0;
        total += qs.get('text') ? qs.get('text').length : 0;
        document.getElementById('counter').innerText = total;
        document.getElementById('source').innerText = 'Source: share target - ' + qs.get('url');
    }
}
```

## Register your app as a file handler

1. Register you app as handling a type of files in the manifest, in our case we are handling txt files that have the extension `.countme`
2. Add the code to handle the files registered on the manifest

```json
"file_handlers": [
    {
      "action": "/",
      "accept": {
        "text/*": [".countme"]
      }
    }
  ],
```

```js
if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
  launchQueue.setConsumer((launchParams) => {
    // Nothing to do when the queue is empty.
    if (!launchParams.files.length) {
      return;
    }
    for (const fileHandle of launchParams.files) {
      fileHandle.getFile().then((file) => {
        file.text().then((contents) => {
          if (contents && contents.length > 0) {
            document.getElementById('counter').innerText = contents.length;
          }
        });
      });

      document.getElementById('source').innerText = 'Source: file';
    }
  });
}
```

Congratulations, your app now give your users an integrated user experience

Here are some additional things that you can do:

- [Integrate with desktop UI by adding Window Controls Overlay](/url-protocol-handler/)
- [Make your app handle specific protocols](/window-controls-overlay/)

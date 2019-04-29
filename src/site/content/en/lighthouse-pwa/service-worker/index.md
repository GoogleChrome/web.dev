---
layout: post
title: Registers a service worker that controls page and start_url
description: |
  Learn about `service-worker` audit.
author: kaycebasques
web_lighthouse:
  - service-worker
---

Registering a service worker is the first step towards enabling the following
progressive web app features:

- Offline
- Push notifications
- Add to homescreen

Learn more in [Service workers and the Cache Storage API](/service-workers-cache-storage/).

## Recommendations

Registering a service worker involves only a few lines of code, but the only
reason you'd use a service worker is to implement one of the progressive
web app features outlined above. Implementing those features requires more
work.

For more help on caching files for offline use, see
[Responds with a 200 when offline](offline-start-url).

For enabling push notifications or "add to homescreen", complete the
following step-by-step tutorials and then use what you learn to implement
the features in your own app:

- [Make it installable](/codelab-make-installable/).
- Enable push notifications for your web app](https://codelabs.developers.google.com/codelabs/push-notifications).

## More information

Checks if the Chrome Debugger returns a service worker version.

[Audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/service-worker.js)
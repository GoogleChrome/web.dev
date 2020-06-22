---
title: Getting started with Chrome's origin trials
subhead: Origin trials are a way to test a new or experimental web platform feature, and give feedback to the web standards community on the feature's usability, practicality, and effectiveness, before the feature is made available to all users. 
authors: 
  - samdutton
date: 2020-06-22
updated: 2020-06-23
hero: hero.jpg
thumbnail: thumbnail.jpg
alt: Pipette with purple liquid
tags:
  - blog
  - origin-trials
---

Origin trials enable you to build functionality your users can try for the
duration of the trial. When Chrome offers an origin trial, you can register for
the trial to enable the feature for all users on your
[origin](https://web.dev/same-site-same-origin/#origin), without requiring your
users to toggle any flags or switch to an alternative build of Chrome (though
they may need to upgrade). Likewise, your developers can try out demos and
prototypes. Origin trials also help Chrome engineers understand how new features
are used, and how they may interact with other web technologies.

Origin trials are public and open to all developers, and limited in duration and
usage. Additionally, origin trials are a self-managed process with limited
documentation and support. Participants should be willing and able to work
relatively independently using the documentation available, which, at this stage,
will likely be limited to specs and explainers, though web.dev tries to provide
articles on origin trials whenver we can.

If you register for a trial, the Chrome team will periodically ask you for
specific feedback on your use of the feature. Some features may undergo multiple
origin trials, as learnings are incorporated and adjustments are made.  

## How to register for an origin trial

1. Choose an origin trial from the [list of active trials](https://developers.chrome.com/origintrials/#/trials/active).
1. [Request a token](https://developers.chrome.com/origintrials/#/trials/active).
1. [Add the token](http://googlechrome.github.io/OriginTrials/developer-guide.html)
   to your web pages, using a `<meta>` tag or an `Origin-Trial` HTTP response
   header.
   -  As a meta tag in the &lt;head&gt; of each page served:   
      `<meta http-equiv="origin-trial" content="TOKEN_GOES_HERE">`
   -  As an HTTP header:  
      `Origin-Trial: TOKEN_GOES_HERE`

1. Try out the new feature.
1. Submit feedback. Do this through the origin trial site. This feedback is 
   not public and is available only to a limited group of people on the Chrome
   team. Each trial also provides a link for spontaneous community feedback.
   This typically points to the the feature on GitHub or some other public
   channel.  

## Find out more

-  [Origin trials guide for web developers](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md)
-  [Origin trial explainer](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/explainer.md)
-  [Running an origin trial](https://www.chromium.org/blink/origin-trials/running-an-origin-trial)
-  [Process for launching new features in Chromium](https://www.chromium.org/blink/launching-features)
-  [Intent to explain: Demystifying the Blink shipping process](https://www.youtube.com/watch?time_continue=291&v=y3EZx_b-7tk)
---

Photo by [Louis Reed
](https://unsplash.com/@_louisreed) on [Unsplash](https://unsplash.com/photos/pwcKF7L4-no).

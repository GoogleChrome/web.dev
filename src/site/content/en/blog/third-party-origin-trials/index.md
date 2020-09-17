---
title: What are third-party origin trials
subhead: Origin trials are a way to test a new or experimental web platform feature. A third-party origin trial makes it possible for providers of embedded content to try out a new feature across multiple sites. 
authors: 
  - samdutton
date: 2020-09-24
updated: 2020-09-24
hero: hero.jpg
thumbnail: thumbnail.jpg
alt: 
tags:
  - blog
  - origin-trials
---

[Origin trials](http://web.dev/origin-trials) are a way to test a new or experimental web platform feature.

A third-party origin trial makes it possible for providers of embedded content (such as video or ad platforms) to try out a new feature across multiple sites.   
  
Until now, origin trials were only available on a first-party basis. You could only register to take part on your own site: an origin trial could be enabled for an [origin](https://web.dev/same-site-same-origin/#origin), but only for requests from the same origin. That meant an origin trial could not be made available for content embedded via third party scripts. In theory, a third party could individually register for multiple origins, using a different trial token for each one, but that doesn't scale.  

[diagram]  

The first third-party origin trial will be for [Conversion Measurement](http://web.dev/conversion-measurement) in Chrome 86.  
  
Supporting third-party origin trials allows for broader participation, but also increases the potential for overuse or abuse of experimental features, so a "trusted tester" approach is more appropriate. The greater reach of third-party origin trials requires additional scrutiny and additional responsibility for web developers that participate as third-party providers. All requests to enable a third-party origin trial will be reviewed in order to avoid problematic third-party scripts affecting multiple sites. The Origin Trials Developer Guide explains the [approval process](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md).

# How to register for a third-party origin trial

1.  Select a trial from the [list of active trials](https://developers.chrome.com/origintrials/#/trials/active).
1.  If a third-party origin trial is available, the trial's registration page will display an option to request a third-party token. 
1.  For third-party tokens, there are three options for usage with different restrictions: ...

[Process TBC.]  

# How to provide feedback

If you're registering for a third-party origin trial and have feedback to share on the process or ideas on how we can improve it, please [create an issue](https://github.com/GoogleChrome/OriginTrials/issues/new) on the Origin Trials GitHub code repo.  

Find out more

+   [Getting started with Chrome's origin trials](https://web.dev/origin-trials/)
+   [Origin Trials Guide for Web Developers](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md)
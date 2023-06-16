---
layout: post
title: New patterns for amazing apps
subhead:
  Dive into a fantastic collection of new patterns for amazing apps, including clipboard patterns,
  file patterns, and advanced app patterns.
authors:
  - thomassteiner
description:
  This blog post announces a new collection of patterns for amazing apps, including clipboard
  patterns, file patterns, and advanced app patterns.
date: 2022-10-10
updated: 2022-10-11
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/QdKJmzxJE8e63gdXWzeo.jpg
alt: Computer keyboard with rainbow keyboard backlighting.
tags:
  - blog
  - progressive-web-apps
  - capabilities
---

No matter what you build—be it a next generation video editing app, an addictive word game, or a
future online social networking app—you will always find yourself in need of a few basic building
blocks:

- The video editing app will probably allow the user to _save_ the edited video.
- Your game will maybe allow the user to _share_ game progress with friends.
- An online social networking app will highly likely allow the user to _paste_ images into a post.

## No universal way to realize these patterns

These were just a couple of examples of such patterns, and there are many more. But all of these
have one thing in common: there is no universal way to realize them.

### Sharing progress

For example, not all browsers implement the [Web Share API](/web-share/), so in some cases you will
have to fall back to a different approach, like
[Twitter's Web Intents](https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent),
or copying to the clipboard, which is the
[approach](https://twitter.com/powerlanguish/status/1471493886031773707) chosen in
[Wordle](https://www.nytimes.com/games/wordle/index.html) when the Web Share API isn't implemented.
Phew, barely got this one:

```text
Wordle 471 6/6

⬛⬛⬛⬛🟨
🟩⬛⬛⬛🟨
🟩🟩🟩⬛⬛
🟩🟩🟩⬛⬛
🟩🟩🟩🟩⬛
🟩🟩🟩🟩🟩
```

### Saving files

When it comes to saving, the go-to approach is to use the
[File System Access API](/file-system-access/), so you end up with a `FileSystemFileHandle`, which
allows you to implement a true [save, edit, save flow](/excalidraw-and-fugu/#saving-files). The next
best thing is to fall back to a classic `<a download>`, which likewise lets the user save data, but
has the downside of creating new files on each download, so they end up with `my-video.mp4`,
`my-video (1).mp4`, `my-video (2).mp4`, etc.

### Pasting images

To conclude the introductory examples, not all browsers support pasting images into a web app, so
you can fall back to using the Drag and Drop API or showing a file picker, which is not as elegant as
the [Async Clipboard API](/async-clipboard), but at least it works.

## The new patterns

With this out of the way, the new pattern sections are:

### Clipboard patterns

[Clipboard patterns](/patterns/clipboard/) for everything concerned with the system clipboard like
copying and pasting of all sorts of things.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/eWdb4ici0H9p8tueeUUG.svg", alt="", width="200", height="200" %}

### Files patterns

[Files patterns](/patterns/files/) for everything concerned with files and directories; be it
saving, opening, dragging and dropping, receiving or sharing.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/Smch2ZFw5PxkiQZPkl3v.svg", alt="", width="200", height="200" %}

### Web apps patterns

[Web apps patterns](/patterns/web-apps/) for everything concerned with advanced app
features like providing app shortcuts, periodically syncing data in the background, showing app
badges, and many more.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/Yyuu9Wob0ix4z2jgBY1S.svg", alt="", width="200", height="200" %}

## Feedback

I hope these patterns will help you build amazing apps, and I'm looking forward to your feedback!
You can provide feedback by tweeting at [@ChromiumDev](https://twitter.com/ChromiumDev) or
[filing an Issue](https://github.com/GoogleChrome/web.dev/issues/new/choose). In both cases, tag
`@tomayac` to make sure I see it.

## Acknowledgements

I'm grateful to [Joe Medley](https://github.com/jpmedley) for his help with reviewing and editing
the patterns. Thanks to [Pete LePage](https://github.com/petele),
[Ewa Gasperowicz](https://twitter.com/devnook), [Rachel Andrew](https://twitter.com/rachelandrew),
[Ken Pascal](https://www.linkedin.com/in/kenpascal/),
and [Matthias Rohmer](https://twitter.com/matthiasrohmer)
for all their technical and organizational support and
encouragements to land this. The entire patterns project would not have been possible without the
help of the authors of the individual patterns, namely
[Harry Theodoulou](https://www.harrytheo.com/), [Tony Conway](/authors/conwayt/),
[Palances Liao](authors/pliao/), [Cecilia Cong](/authors/chuijun/),
[François Beaufort](https://github.com/beaufortfrancois), and
[Joe Medley](https://github.com/jpmedley).

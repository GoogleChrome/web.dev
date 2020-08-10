---
layout: post
title: More on the &lt;track> element
authors:
  - samdutton
description: |
  TBD
date: 2012-02-08
updated: 2020-08-20
---

The `<track>` element provides a simple, standardized way to add serveral kinds of timed metadata to a video: subtitles, captions, screen reader descriptions, and chapters to video and audio.

The source data for a track element is a text file made up of a list of timed cues, and cues can include data in formats such as JSON or CSV. This is extremely powerful, enabling deep linking and media navigation via text search, for example, or DOM manipulation and other behaviour synchronised with media playback.

Below is a simple example of a video with a track element. Play it to see subtitles in English:

TBD --Add the video

Code for a video element with subtitles in English and German might look like this:

```html
<video src="foo.ogv">
  <track kind="subtitles" label="English subtitles" src="subtitles_en.vtt" srclang="en" default></track>
  <track kind="subtitles" label="Deutsche Untertitel" src="subtitles_de.vtt" srclang="de"></track>
</video>
```html

In this example, the `<video>` element displays a selector giving the user a choice of subtitle languages.

Note that the track element cannot be used from a `file://` URL. To see tracks in action, put files on a web server.

Each track element has an attribute for kind, which can be subtitles, captions, descriptions, chapters or metadata. The track element src attribute points to a text file that holds data for timed track cues, which can potentially be in any format a browser can parse. Chrome supports WebVTT, which looks like this:

WEBVTT FILE

railroad
00:00:10.000 --> 00:00:12.500
Left uninspired by the crust of railroad earth

manuscript
00:00:13.200 --> 00:00:16.900
that touched the lead to the pages of your manuscript.
Each item in a track file is called a cue. Each cue has a start time and end time separated by an arrow, with cue text in the line below. Cues can optionally also have IDs: 'railroad' and 'manuscript' in the examples above. Cues are separated by an empty line.
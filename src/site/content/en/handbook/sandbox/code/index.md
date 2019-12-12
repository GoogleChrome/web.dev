---
permalink: false
layout: sandbox/article
title: code
tags:
  - sandbox
---

<p>
  The value of the <code>type</code> attribute should be the MIME type
  corresponding to the image format. An image's MIME type and its file
  extension are often similar, but they aren't necessarily the same
  thing (e.g. <code>.jpg</code> vs. <code>image/jpeg</code>).
</p>

<ul>
  <li>
    The value of the <code>type</code> attribute should be the MIME type.
  </li>
  <li>
    (e.g. <code>.jpg</code> vs. <code>image/jpeg</code>)
  </li>
</ul>

**Code block**

```js
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

(async() => {
  const files = await imagemin(
      ['source_dir/*.jpg', 'another_dir/*.jpg'],
      'destination_dir',
      {plugins: [imageminMozjpeg({quality: 50})]}
  );
  console.log(files);
})();
```

**Highlight**

```js/1
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

(async() => {
  const files = await imagemin(
      ['source_dir/*.jpg', 'another_dir/*.jpg'],
      'destination_dir',
      {plugins: [imageminMozjpeg({quality: 50})]}
  );
  console.log(files);
})();
```

**Remove**

```js//1
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

(async() => {
  const files = await imagemin(
      ['source_dir/*.jpg', 'another_dir/*.jpg'],
      'destination_dir',
      {plugins: [imageminMozjpeg({quality: 50})]}
  );
  console.log(files);
})();
```

**Add/Remove**

```js/6/5
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

(async() => {
  const files = await imagemin(
      ['source_dir/*.jpg'],
      ['source_dir/*.jpg', 'another_dir/*.jpg'],
      'destination_dir',
      {plugins: [imageminMozjpeg({quality: 50})]}
  );
  console.log(files);
})();
```
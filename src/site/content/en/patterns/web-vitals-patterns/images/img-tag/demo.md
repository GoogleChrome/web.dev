---
patternId: web-vitals-patterns/images/img-tag
---

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>&lt;img&gt; tag demo</title>
    <style>
        body {
            padding: 1em;
            font-family: system-ui;
        }
        h1 {
            text-align: center;
        }
        .section {
            margin: 1em;
            padding: 1em;
            background-color: #F5F5F5;
        }
        .cover {
            object-fit: cover;
            width: 100%
        }
        .contain {
            object-fit: contain;
            width: 100%
        }
        .fill {
            object-fit: fill;
            width: 100%;
        }
        .scale-down {
            object-fit: scale-down;
            width: 100%;
        }
    </style>
</head>
<body>
    <h1>&lt;img&gt; tag</h1>
    <div class="section">
        <h2>object-fit: cover</h2>
        <p>Image fills container. If the image has a different aspect ratio than container, it will be cropped to fit.</p>
        <img class="cover" src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/DmZBhXhFnBS7tl8TW4Fn.jpg" width="800" height="533">
    </div>
    <div class="section">
        <h2>object-fit: contain</h2>
        <p>Image is displayed at its original aspect ratio. If the image has a different aspect ratio than its container, it will be displayed "letterbox" style.</p>
        <img class="contain" src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/DmZBhXhFnBS7tl8TW4Fn.jpg" width="800" height="533">
    </div>
    <div class="section">
        <h2>object-fit: fill</h2>
        <p>Image fills container. If image has a different aspect ratio than container, it will be stretched to fit.</p>
        <img class="fill" src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/DmZBhXhFnBS7tl8TW4Fn.jpg" width="800" height="533">
    </div>
    <div class="section">
        <h2>object-fit: scale-down</h2>
        <p>Image is displayed at either its original size or its "object-fit: contain" size - whichever of these is smaller.<p>
        <img class="scale-down" src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/DmZBhXhFnBS7tl8TW4Fn.jpg" width="800" height="533">
    </div>
</body>

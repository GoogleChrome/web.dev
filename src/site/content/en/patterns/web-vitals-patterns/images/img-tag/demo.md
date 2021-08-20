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
        img {
            width: 100%;
        }
        .section {
            margin: 1em;
            padding: 1em;
            background-color: #F5F5F5;
        }
    </style>
</head>
<body>
    <h1>&lt;img&gt; tag</h1>
    <div class="section">
        <h2>object-fit: cover</h2>
        <img src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/bhO3chAuvC09AxtHyx7e.jpg" width="800" height="400" style="object-fit: cover">
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Maecenas volutpat blandit aliquam etiam erat velit. Integer eget aliquet nibh praesent.
        </p>
    </div>
    <div class="section">
        <h2>object-fit: contain</h2>
        <img src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/bhO3chAuvC09AxtHyx7e.jpg" width="800" height="400" style="object-fit: contain">
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Maecenas volutpat blandit aliquam etiam erat velit. Integer eget aliquet nibh praesent.
        </p>
    </div>
    <div class="section">
        <h2>object-fit: fill</h2>
        <img src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/bhO3chAuvC09AxtHyx7e.jpg" width="800" height="400" style="object-fit: fill">
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Maecenas volutpat blandit aliquam etiam erat velit. Integer eget aliquet nibh praesent.
        </p>
    </div>
    <div class="section">
        <h2>object-fit: scale-down</h2>
        <img src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/bhO3chAuvC09AxtHyx7e.jpg" width="800" height="400" style="object-fit: scale-down">
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Maecenas volutpat blandit aliquam etiam erat velit. Integer eget aliquet nibh praesent.
        </p>
    </div>
    <div class="section">
        <h2>object-fit: none</h2>
        <img src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/bhO3chAuvC09AxtHyx7e.jpg" width="800" height="400" style="object-fit: none">
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Maecenas volutpat blandit aliquam etiam erat velit. Integer eget aliquet nibh praesent.
        </p>
    </div>
</body>
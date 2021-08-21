---
patternId: web-vitals-patterns/images/picture-tag
---

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>&lt;picture&gt; tag demo</title>
    <style>
        body {
            display: grid;
            place-content: center;
            text-align: center;
            font-family: system-ui;
            padding: 2em;
        }
    </style>
</head>
<body>
    <h1>&lt;picture&gt; tag</h1>
    <p>This image changes depending on the width of the browser window.</p>
    <picture>
        <source media="(max-width: 720px)" srcset="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/BC3ORxdjgH3wZ0Ejx8Ct.jpg"/>
        <source media="(min-width: 721px)" srcset="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/bhO3chAuvC09AxtHyx7e.jpg"/>
        <img src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/ypNcznPdo5v8Sg3RoQJ7.jpg" width="267" height="400" alt="Column of eggs">
    </picture>
    <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
        incididunt ut labore et dolore magna aliqua. Maecenas volutpat blandit aliquam etiam 
        erat velit. Integer eget aliquet nibh praesent. Sit amet mattis vulputate enim nulla. 
        Faucibus nisl tincidunt eget nullam non. Sem fringilla ut morbi tincidunt augue. 
        Sed id semper risus in hendrerit gravida rutrum quisque non. Blandit aliquam etiam 
        erat velit scelerisque in dictum non consectetur. Et ultrices neque ornare aenean 
        euismod. Dignissim sodales ut eu sem integer vitae justo. Justo eget magna fermentum 
        iaculis eu non diam phasellus.
    </p>
</body>

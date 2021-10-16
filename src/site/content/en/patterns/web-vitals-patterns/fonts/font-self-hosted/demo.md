---
patternId: web-vitals-patterns/fonts/fonts-self-hosted
---

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Self-hosted fonts demo</title>
    <style>
        @font-face {
            font-family: 'Google Sans';
            src: url("/fonts/google-sans/regular/latin.woff2") format('woff2');
            font-display: swap;
        }
        body {
            padding: 1em 3em;
            font-family: system-ui;
            font-size: 1em;
            line-height: 1.5;
        }
        h1 {
            font-family: 'Google Sans', sans-serif;
            font-size: 3em;
        }
    </style>
</head>
<body>
    <h1>Self-hosted Fonts</h1>
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

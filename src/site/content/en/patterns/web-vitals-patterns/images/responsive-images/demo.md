---
patternId: web-vitals-patterns/images/responsive-img-density
---

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Responsive images</title>
    <style>
        body {
            padding: 1em;
            margin: 0;
            font-family: system-ui;
            display: grid;
            justify-items: center;
            text-align: center;
        }
        img {
            display: block;
            margin: 0 auto;
            max-width: 100%;
            height: auto;
        }
        p {
            padding: .5em;
        }
        .container {
            margin: 1em 0;
            width: 100%;
        }
        .width-descriptor {
            max-width: 1028px;
            width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    <h1>Responsive Images</h1>
    <div class="container">
        <h3>Using density descriptors</h3>
        <img width="480" height="330" srcset="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/nPq8KhTDpmxkuTORmcAg.jpg, https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/fAKE40F3Jg7N5yE1Tb6T.jpg 2x, https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/8bA5SpW58D7kYbyPij6r.jpg 3x" src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/nPq8KhTDpmxkuTORmcAg.jpg" alt="Photo of a cat on a green background">
    </div>
    <div class="container">
        <h3>Using width descriptors</h3>
        <img class="width-descriptor" width="256" height="128" srcset="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/zYodlaB3bPU4CYslLbbh.jpg 256w, https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/KMFxcZmusA753IpnFZl4.jpg 512w, https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/6Gc1wnPIE6GbDqhBAi8V.jpg 1028w" src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/zYodlaB3bPU4CYslLbbh.jpg" alt="Photo of a dog on an orange background">
    </div>
    <div class="container">
        <h3>Picture tag</h3>
        <p>This image changes depending on the width of the browser window.</p>
        <picture>
            <source media="(max-width: 720px)" width="600" height="300" srcset="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/aaYUJUNf32kelZk6mqYY.jpg"/>
            <source media="(min-width: 721px)" width="600" height="600" srcset="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/VP7HTRswZiePrzMBFVYb.jpg 1x, https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/emPmNvJu1i3pypP7uLUw.jpg 2x, https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/ZPIGDeKINDI4mi4Pcf0m.jpg 3x"/>
            <img src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/aaYUJUNf32kelZk6mqYY.jpg" width="600" height="300" alt="Photo of the Empire State Building">
        </picture>
    </div>
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

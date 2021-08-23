---
patternId: notice-modal
---

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Modal Demo</title>
    <style>
        body {
            overscroll-behavior-y: none;
            font-family: system-ui;
            padding: 2em;
            background-color: #f4f4f4;
        }
        .modal {
            position: fixed;
            top: 50%;
            left: 50%;
            min-width: 66%;
            transform: translate(-50%, -50%);
            padding: 1em 2em 2em 2em;
            background-color: white;
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
        }
        .close-button {
            background: transparent;
            border: none;
            padding: 1em;
            font-size: 1em;
            position: absolute;
            right: 0;
            top: 0;
            cursor: pointer;
        }
    </style>
</head>

<body>
    <div id="modal" class="modal">
        <button id="close-button" class="close-button" aria-label="close" tabindex="0">✕</button>
        <div>
            <h1>Notice</h1>
            Lorem ipsum dolor sit amet.
        </div>
    </div>
    <script>
        document.getElementById("close-button").onclick = () => {
            document.getElementById("modal").style = "display: none";
        }
    </script>
    <h1>Modal</h1>
    <div class="filler">
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
    </div>
</body>

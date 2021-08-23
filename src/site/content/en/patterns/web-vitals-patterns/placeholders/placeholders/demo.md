---
patternId: web-vitals-patterns/placeholders/placeholders
---

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Placeholder demo</title>
    <style>
        :root {
            --placeholder-primary: #bfbfbf;
            --placeholder-secondary: #cccccc;
        }
        body {
            padding: 1em;
            font-family: system-ui;
            display: grid;
            justify-items: center;
        }
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1em;
            width: 100%;
            max-width: 500px;
            margin: 1em 0em;
        }
        .item {
            display: grid;
            gap: .5em;
        }
        .image-container {
            width: 100%;
            aspect-ratio: 1 / 1;
        }
        .image-container img {
            width: 100%;
        }
        .text-container {
            font-size: 1em;
            height: 1.5em;
            text-align: center;
            font-weight: bold;
        }
        @keyframes fade {
            50% {
                opacity: .2;
            }
        }
        .loading {
            animation: fade ease-in-out 2s infinite;
        }
        .loading .image-container{
            background-color: var(--placeholder-primary);
        }
        .loading .text-container {
            background-color: var(--placeholder-secondary);
        }
    </style>
</head>

<body>
    <h1>Placeholders</h1>
    <div class="grid">
        <div class="item">
            <div class="image-container">
                <img src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/LiTG3VL5E1mRXiYgjCjc.jpg">
            </div>
            <div class="text-container">Hats</div>
        </div>
        <div class="item">
            <div class="image-container">
                <img src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/GMPpoERpp9aM5Rihk5F2.jpg">
            </div>
            <div class="text-container">Watches</div>
        </div>
        <div class="item loading">
            <div class="image-container">
                <img src="">
            </div>
            <div class="text-container"></div>
        </div>
        <div class="item loading">
            <div class="image-container">
                <img src="">
            </div>
            <div class="text-container"></div>
        </div>
        <div class="item loading">
            <div class="image-container">
                <img src="">
            </div>
            <div class="text-container"></div>
        </div>
        <div class="item loading">
            <div class="image-container">
                <img src="">
            </div>
            <div class="text-container"></div>
        </div>
    </div>
</body>
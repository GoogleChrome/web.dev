---
patternId: web-vitals-patterns/carousels/carousel-autoplay
---

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Autoplay Carousel Demo</title>
    <style>
        :root {
            --carousel-image-width: 600px;
            --carousel-image-height: 400px;
            --button-color: #878787;
            --button-hover: black;
        }
        body {
            padding: 1em;
            font-family: system-ui;
            display: grid;
            justify-items: center;
        }
        .grid {
            display: grid;
            grid-template-columns: 3em minmax(0px, var(--carousel-image-width)) 3em;
        }
        .left-column, .right-column {
            padding-bottom: 4em;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #slide-container {
            display: grid;
            grid-auto-flow: column;
            gap: 1rem;
            padding-bottom: 1em;
            overflow-y: auto;
            overscroll-behavior-x: contain;
            scroll-snap-type: x mandatory;
        }
        .slide {
            scroll-snap-align: center;
        }
        .slide img {
            object-fit: contain;
        }
        .dots {
            display: flex;
            justify-content: center;
        }
        .dot {
            cursor: pointer;
            background-color: var(--button-color);
            height: 1em;
            width: 1em;
            border-radius: 50%;
            border: 1em solid white;
        }
        .dot.active,
        .dot:hover {
            background-color: var(--button-hover);
        }
        #back-button, #forward-button {
            display: flex;
            align-items: center;
            position: relative;
            width: 3em;
            height: 3em;
            cursor: pointer;
        }
        #back-button:hover .arrow, #forward-button:hover .arrow {
            border-color: var(--button-hover);
        }
        .arrow {
            position: absolute;
            width: 1em; 
            height: 1em;
        }
        .arrow-left {
            right: 5px;
            transform: rotate(45deg);
            border-left: .5em solid var(--button-color);
            border-bottom: .5em solid var(--button-color); 
        }
        .arrow-right {
            left: 5px;
            transform: rotate(45deg);
            border-top: .5em solid var(--button-color);
            border-right: .5em solid var(--button-color);
        }
    </style>
</head>
<body>
    <h1>Autoplay carousel</h1>
    <div class="carousel" id="carousel">
        <div class="grid">
            <div class="left-column">
                <div id="back-button"><i class="arrow arrow-left"></i></div>
            </div>
            <div class="middle-column">
                <div id="slide-container">
                    <a class="slide" href="#" data-index="0"><img width="600" height="400" src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/C0slLSuXSTJHyUxRDc3O.jpg"></a>
                    <a class="slide" href="#" data-index="1"><img width="600" height="400" src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/ALVztAgQoyIQUfmQknJk.jpg"></a>
                    <a class="slide" href="#" data-index="2"><img width="600" height="400" src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/ZZXVrtIcIuUG16jbqtAe.jpg"></a>
                    <a class="slide" href="#" data-index="3"><img width="600" height="400" src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/xBhWwvEjF8Dj2oMbhOQd.jpg"></a>
                    <a class="slide" href="#" data-index="4"><img width="600" height="400" src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/rvZxMyUkTJ5i35oC3rTa.jpg"></a>
                </div>
                <div class="dots">
                    <div class="dot active"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>
            <div class="right-column">
                <div id="forward-button"><i class="arrow arrow-right"></i></div>
            </div>
        </div>
    </div>
    <script>
        function autoplayCarousel(){
            const carouselEl = document.getElementById("carousel");
            const slidesEl = document.getElementById("slide-container");
            // Add click handlers
            document.querySelector("#back-button")
                .addEventListener("click", () => navigate("backward"));
            document.querySelector("#forward-button")
                .addEventListener("click", () => navigate("forward"));
            document.querySelectorAll(".dot")
                .forEach((dot, index) => {
                    dot.addEventListener("click", () => navigate(index));
                });
            // Add keyboard handlers
            document.addEventListener('keydown', (e) => {
                if (e.code === 'ArrowLeft') {
                    clearInterval(autoplay);
                    navigate("backward");
                } else if (e.code === 'ArrowRight') {
                    clearInterval(autoplay);
                    navigate("forward");
                }
            });
            // Autoplay
            const autoplay = setInterval(() => navigate("forward"), 2000);
            carouselEl.addEventListener("mouseenter", () => clearInterval(autoplay));
            // Slide transition
            const getNewScrollPosition = (arg) => {
                const imageWidth = 600;
                const gap = 16;
                const maxScrollLeft = slidesEl.scrollWidth - imageWidth;
                if (arg === "forward") {
                    const x = slidesEl.scrollLeft + imageWidth + gap;
                    return x <= maxScrollLeft ? x : 0;
                } else if (arg === "backward") {
                    const x = slidesEl.scrollLeft - imageWidth - gap;
                    return x >= 0 ? x : maxScrollLeft;
                } else if (typeof arg === "number") {
                    const x = arg * (imageWidth + gap);
                    return x;
                }
            }
            const navigate = (arg) => {
                slidesEl.scrollLeft = getNewScrollPosition(arg);
            }
            // Slide indicators ("dots")
            const slideObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0) {
                        const slideIndex = entry.target.dataset.index;
                        carouselEl.querySelector('.dot.active').classList.remove('active');
                        carouselEl.querySelectorAll('.dot')[slideIndex].classList.add('active');
                    }
                });
            }, { root: slidesEl });
            document.querySelectorAll('.slide').forEach((slide) => {
                slideObserver.observe(slide);
            });
        }
        autoplayCarousel();
    </script>
</body>
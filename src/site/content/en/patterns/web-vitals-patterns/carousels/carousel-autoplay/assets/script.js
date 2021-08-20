function autoplayCarousel() {
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

    // Update nav dots as slides transition
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
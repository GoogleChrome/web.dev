function autoplayCarousel() {
    const carouselEl = document.getElementById("carousel");
    const slidesEl = document.getElementById("slide-container");
    let slideWidth = document.getElementsByClassName("slide")[0].offsetWidth;
    // Add click handlers
    document.querySelectorAll(".slide-indicator")
        .forEach((dot, index) => {
            dot.addEventListener("click", () => navigate(index));
            dot.addEventListener("mouseenter", () => clearInterval(autoplay));
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
    const autoplay = setInterval(() => navigate("forward"), 3000);
    slidesEl.addEventListener("mouseenter", () => clearInterval(autoplay));
    // Slide transition
    const getNewScrollPosition = (arg) => {
        let slideWidth = document.getElementsByClassName("slide")[0].offsetWidth
        const gap = 10;
        const maxScrollLeft = slidesEl.scrollWidth - slideWidth;
        if (arg === "forward") {
            const x = slidesEl.scrollLeft + slideWidth + gap;
            return x <= maxScrollLeft ? x : 0;
        } else if (arg === "backward") {
            const x = slidesEl.scrollLeft - slideWidth - gap;
            return x >= 0 ? x : maxScrollLeft;
        } else if (typeof arg === "number") {
            const x = arg * (slideWidth + gap);
            return x;
        }
    }
    window.addEventListener('resize', () => {
        slideWidth = document.getElementsByClassName("slide")[0].offsetWidth;
    });
    const navigate = (arg) => {
        slidesEl.scrollLeft = getNewScrollPosition(arg);
    }
    // Slide indicators
    const slideObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const slideIndex = entry.target.dataset.slideindex;
                carouselEl.querySelector('.slide-indicator.active').classList.remove('active');
                carouselEl.querySelectorAll('.slide-indicator')[slideIndex].classList.add('active');
            }
        });
    }, { root: slidesEl, threshold: .1 });
    document.querySelectorAll('.slide').forEach((slide) => {
        slideObserver.observe(slide);
    });
}
autoplayCarousel();
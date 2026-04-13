(function () {
    const carousel = document.querySelector('.certificates-carousel');

    if (!carousel) {
        return;
    }

    const track = carousel.querySelector('.certificates-track');
    const slides = Array.from(carousel.querySelectorAll('[data-certificate-slide]'));
    const prevButton = carousel.querySelector('[data-carousel-prev]');
    const nextButton = carousel.querySelector('[data-carousel-next]');
    const dots = Array.from(carousel.querySelectorAll('[data-carousel-dot]'));

    if (!track || slides.length === 0) {
        return;
    }

    let currentIndex = 0;
    const autoplayDelay = 5000;
    let autoplayTimer = null;

    function updateDots() {
        dots.forEach((dot, index) => {
            const isActive = index === currentIndex;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-selected', String(isActive));
        });
    }

    function renderSlide(index) {
        track.style.transform = `translateX(-${index * 100}%)`;
        updateDots();
    }

    function goTo(index) {
        const lastIndex = slides.length - 1;

        if (index < 0) {
            currentIndex = lastIndex;
        } else if (index > lastIndex) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        renderSlide(currentIndex);
    }

    function nextSlide() {
        goTo(currentIndex + 1);
    }

    function prevSlide() {
        goTo(currentIndex - 1);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            window.clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = window.setInterval(nextSlide, autoplayDelay);
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            nextSlide();
            startAutoplay();
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            prevSlide();
            startAutoplay();
        });
    }

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const targetIndex = Number(dot.getAttribute('data-carousel-dot'));
            if (!Number.isNaN(targetIndex)) {
                goTo(targetIndex);
                startAutoplay();
            }
        });
    });

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', (event) => {
        if (!carousel.contains(event.relatedTarget)) {
            startAutoplay();
        }
    });

    renderSlide(currentIndex);
    startAutoplay();
})();

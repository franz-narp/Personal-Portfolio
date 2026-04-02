(function () {
    const navLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
    const heroSection = document.getElementById('home');
    const heroTitle = document.querySelector('.hero-title');

    if (navLinks.length === 0) {
        return;
    }

    const linkById = new Map();

    navLinks.forEach((link) => {
        const targetId = link.getAttribute('href').slice(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            linkById.set(targetId, link);
        }

        link.addEventListener('click', () => {
            setActiveLink(targetId);
        });
    });

    const sections = Array.from(document.querySelectorAll('main section[id]'));

    function replayHeroTitle() {
        if (!heroTitle) {
            return;
        }

        heroTitle.classList.remove('is-animated');
        void heroTitle.offsetWidth;
        heroTitle.classList.add('is-animated');
    }

    if (heroSection && heroTitle && 'IntersectionObserver' in window) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    replayHeroTitle();
                } else {
                    heroTitle.classList.remove('is-animated');
                }
            });
        }, {
            threshold: 0.45,
        });

        heroObserver.observe(heroSection);
    } else if (heroTitle) {
        replayHeroTitle();
    }

    function setActiveLink(sectionId) {
        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
    }

    function updateActiveByScroll() {
        const markerY = window.scrollY + window.innerHeight * 0.33;
        let currentSectionId = sections[0] ? sections[0].id : null;

        for (const section of sections) {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;

            if (markerY >= top && markerY < bottom) {
                currentSectionId = section.id;
                break;
            }
        }

        if (currentSectionId && linkById.has(currentSectionId)) {
            setActiveLink(currentSectionId);
        }
    }

    let ticking = false;

    function onScroll() {
        if (ticking) {
            return;
        }

        ticking = true;
        window.requestAnimationFrame(() => {
            updateActiveByScroll();
            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateActiveByScroll);

    const initialHash = window.location.hash ? window.location.hash.slice(1) : '';
    if (initialHash && linkById.has(initialHash)) {
        setActiveLink(initialHash);
    } else {
        updateActiveByScroll();
    }
})();

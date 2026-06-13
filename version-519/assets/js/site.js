(function () {
    const header = document.querySelector('[data-header]');
    const nav = document.querySelector('[data-nav]');
    const menuButton = document.querySelector('[data-menu-button]');
    const backTop = document.querySelector('[data-back-top]');

    const syncHeader = function () {
        if (header) {
            header.classList.toggle('is-scrolled', window.scrollY > 12);
        }
        if (backTop) {
            backTop.classList.toggle('is-visible', window.scrollY > 520);
        }
    };

    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });

    if (menuButton && nav) {
        menuButton.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    if (backTop) {
        backTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const hero = document.querySelector('[data-hero]');
    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        const prev = hero.querySelector('[data-hero-prev]');
        const next = hero.querySelector('[data-hero-next]');
        let current = 0;
        let timer = null;

        const show = function (index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        };

        const start = function () {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        };

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                start();
            });
        }

        show(0);
        start();
    }

    const normalize = function (value) {
        return (value || '').toString().trim().toLowerCase();
    };

    const scopes = Array.from(document.querySelectorAll('[data-list-scope]'));
    const inputs = Array.from(document.querySelectorAll('[data-search-input]'));
    const chips = Array.from(document.querySelectorAll('[data-filter]'));
    const clears = Array.from(document.querySelectorAll('[data-clear-search]'));
    let activeFilter = 'all';

    const applyFilters = function () {
        const keyword = normalize(inputs.map(function (input) {
            return input.value;
        }).join(' '));

        scopes.forEach(function (scope) {
            const cards = Array.from(scope.querySelectorAll('.movie-card'));
            cards.forEach(function (card) {
                const haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-genre')
                ].join(' '));
                const matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                const matchesFilter = activeFilter === 'all' || haystack.indexOf(normalize(activeFilter)) !== -1;
                card.classList.toggle('is-hidden', !(matchesKeyword && matchesFilter));
            });
        });
    };

    inputs.forEach(function (input) {
        input.addEventListener('input', applyFilters);
    });

    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            activeFilter = chip.getAttribute('data-filter') || 'all';
            chips.forEach(function (item) {
                item.classList.toggle('is-active', item === chip);
            });
            applyFilters();
        });
    });

    clears.forEach(function (button) {
        button.addEventListener('click', function () {
            inputs.forEach(function (input) {
                input.value = '';
            });
            applyFilters();
        });
    });
})();

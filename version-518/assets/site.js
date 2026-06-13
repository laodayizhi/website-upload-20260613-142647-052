(() => {
    const menuButton = document.querySelector('[data-menu-toggle]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', () => {
            mobileNav.classList.toggle('is-open');
        });
    }

    const hero = document.querySelector('[data-hero]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        const prev = hero.querySelector('[data-hero-prev]');
        const next = hero.querySelector('[data-hero-next]');
        let active = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
        let timer = null;

        const show = (index) => {
            if (!slides.length) {
                return;
            }
            active = (index + slides.length) % slides.length;
            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle('is-active', slideIndex === active);
            });
            dots.forEach((dot, dotIndex) => {
                dot.classList.toggle('is-active', dotIndex === active);
            });
        };

        const restart = () => {
            window.clearInterval(timer);
            timer = window.setInterval(() => show(active + 1), 6200);
        };

        prev?.addEventListener('click', () => {
            show(active - 1);
            restart();
        });

        next?.addEventListener('click', () => {
            show(active + 1);
            restart();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                show(index);
                restart();
            });
        });

        show(active);
        restart();
    }

    const heroSearchForm = document.getElementById('heroSearchForm');

    if (heroSearchForm) {
        heroSearchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const input = heroSearchForm.querySelector('input[type="search"]');
            const keyword = encodeURIComponent((input?.value || '').trim());
            window.location.href = keyword ? `./search.html?q=${keyword}` : './search.html';
        });
    }

    const filterPanel = document.querySelector('[data-filter-panel]');
    const filterList = document.querySelector('[data-filter-list]');

    if (filterPanel && filterList) {
        const searchInput = filterPanel.querySelector('[data-filter-search]');
        const categorySelect = filterPanel.querySelector('[data-filter-category]');
        const typeSelect = filterPanel.querySelector('[data-filter-type]');
        const yearSelect = filterPanel.querySelector('[data-filter-year]');
        const emptyResult = filterPanel.querySelector('[data-empty-result]');
        const cards = Array.from(filterList.querySelectorAll('.movie-card'));
        const params = new URLSearchParams(window.location.search);
        const initialKeyword = params.get('q') || '';

        if (searchInput && initialKeyword) {
            searchInput.value = initialKeyword;
        }

        const normalize = (value) => String(value || '').toLowerCase().trim();

        const applyFilters = () => {
            const keyword = normalize(searchInput?.value);
            const category = normalize(categorySelect?.value);
            const type = normalize(typeSelect?.value);
            const year = normalize(yearSelect?.value);
            let visible = 0;

            cards.forEach((card) => {
                const haystack = normalize([
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.year,
                    card.dataset.category,
                    card.dataset.genre,
                    card.textContent,
                ].join(' '));
                const matchesKeyword = !keyword || haystack.includes(keyword);
                const matchesCategory = !category || normalize(card.dataset.category).includes(category);
                const matchesType = !type || normalize(card.dataset.type).includes(type) || normalize(card.dataset.genre).includes(type);
                const matchesYear = !year || normalize(card.dataset.year).includes(year);
                const matched = matchesKeyword && matchesCategory && matchesType && matchesYear;
                card.hidden = !matched;
                if (matched) {
                    visible += 1;
                }
            });

            if (emptyResult) {
                emptyResult.hidden = visible !== 0;
            }
        };

        [searchInput, categorySelect, typeSelect, yearSelect].forEach((element) => {
            element?.addEventListener('input', applyFilters);
            element?.addEventListener('change', applyFilters);
        });

        applyFilters();
    }

    const playerBox = document.querySelector('[data-player]');

    if (playerBox) {
        const video = playerBox.querySelector('video');
        const playButton = playerBox.querySelector('[data-play]');
        const stream = playerBox.getAttribute('data-stream');
        let loaded = false;
        let hlsInstance = null;

        const attachStream = () => {
            if (!video || !stream || loaded) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
            } else {
                video.src = stream;
            }

            loaded = true;
        };

        const play = () => {
            if (!video) {
                return;
            }
            attachStream();
            playerBox.classList.add('is-playing');
            const promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(() => {});
            }
        };

        playButton?.addEventListener('click', play);
        video?.addEventListener('click', () => {
            if (video.paused) {
                play();
            }
        });
        video?.addEventListener('play', () => {
            playerBox.classList.add('is-playing');
        });
        video?.addEventListener('ended', () => {
            playerBox.classList.remove('is-playing');
        });
        window.addEventListener('pagehide', () => {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }
})();

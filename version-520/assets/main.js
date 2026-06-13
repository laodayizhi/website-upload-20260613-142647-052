(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-menu]');

    if (menuButton && menu) {
        menuButton.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var slideIndex = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        slideIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, current) {
            slide.classList.toggle('is-active', current === slideIndex);
        });
        dots.forEach(function (dot, current) {
            dot.classList.toggle('is-active', current === slideIndex);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(slideIndex + 1);
        }, 5200);
    }

    var searchPage = document.querySelector('[data-search-page]');

    if (searchPage) {
        var keywordInput = document.querySelector('[data-filter-keyword]');
        var yearSelect = document.querySelector('[data-filter-year]');
        var regionSelect = document.querySelector('[data-filter-region]');
        var typeSelect = document.querySelector('[data-filter-type]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
        var empty = document.querySelector('[data-no-results]');

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function filterCards() {
            var keyword = normalize(keywordInput && keywordInput.value);
            var year = normalize(yearSelect && yearSelect.value);
            var region = normalize(regionSelect && regionSelect.value);
            var type = normalize(typeSelect && typeSelect.value);
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-summary'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-category')
                ].join(' '));
                var ok = true;

                if (keyword && haystack.indexOf(keyword) === -1) {
                    ok = false;
                }
                if (year && normalize(card.getAttribute('data-year')) !== year) {
                    ok = false;
                }
                if (region && normalize(card.getAttribute('data-region')) !== region) {
                    ok = false;
                }
                if (type && normalize(card.getAttribute('data-type')) !== type) {
                    ok = false;
                }

                card.style.display = ok ? '' : 'none';
                if (ok) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        [keywordInput, yearSelect, regionSelect, typeSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', filterCards);
                control.addEventListener('change', filterCards);
            }
        });
    }

    var hlsLoader;

    function loadHls() {
        if (window.Hls) {
            return Promise.resolve(window.Hls);
        }

        if (hlsLoader) {
            return hlsLoader;
        }

        hlsLoader = new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
            script.async = true;
            script.onload = function () {
                resolve(window.Hls);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });

        return hlsLoader;
    }

    function startVideo(shell) {
        var video = shell.querySelector('video');
        var cover = shell.querySelector('[data-play-trigger]');
        var source = video && video.querySelector('source');
        var src = source && source.getAttribute('src');

        if (!video || !src) {
            return;
        }

        if (cover) {
            cover.classList.add('is-hidden');
        }

        var play = function () {
            var result = video.play();
            if (result && result.catch) {
                result.catch(function () {});
            }
        };

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            if (!video.getAttribute('src')) {
                video.src = src;
            }
            play();
            return;
        }

        loadHls().then(function (Hls) {
            if (Hls && Hls.isSupported()) {
                var hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(src);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, play);
            } else {
                video.src = src;
                play();
            }
        }).catch(function () {
            video.src = src;
            play();
        });
    }

    Array.prototype.slice.call(document.querySelectorAll('.video-shell')).forEach(function (shell) {
        var cover = shell.querySelector('[data-play-trigger]');
        if (cover) {
            cover.addEventListener('click', function () {
                startVideo(shell);
            });
        }
    });
})();

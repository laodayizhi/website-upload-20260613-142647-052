(function () {
    const video = document.querySelector('.movie-player-video');
    const overlay = document.querySelector('.player-overlay');
    const button = document.querySelector('.player-play-button');

    if (!video || typeof currentVideoUrl !== 'string') {
        return;
    }

    let player = null;
    let ready = false;
    let requested = false;

    const tryPlay = function () {
        const action = video.play();
        if (action && typeof action.catch === 'function') {
            action.catch(function () {
                if (overlay) {
                    overlay.classList.remove('is-hidden');
                }
            });
        }
    };

    const load = function () {
        if (ready) {
            return;
        }
        ready = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = currentVideoUrl;
            video.addEventListener('loadedmetadata', function () {
                if (requested) {
                    tryPlay();
                }
            }, { once: true });
            return;
        }

        if (typeof Hls !== 'undefined' && Hls.isSupported()) {
            player = new Hls({ enableWorker: true, lowLatencyMode: true });
            player.loadSource(currentVideoUrl);
            player.attachMedia(video);
            player.on(Hls.Events.MANIFEST_PARSED, function () {
                if (requested) {
                    tryPlay();
                }
            });
            return;
        }

        video.src = currentVideoUrl;
    };

    const start = function (event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        requested = true;
        load();
        video.setAttribute('controls', 'controls');
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
        tryPlay();
    };

    if (button) {
        button.addEventListener('click', start);
    }

    if (overlay) {
        overlay.addEventListener('click', start);
    }

    video.addEventListener('play', function () {
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
    });

    window.addEventListener('pagehide', function () {
        if (player) {
            player.destroy();
            player = null;
        }
    });
})();

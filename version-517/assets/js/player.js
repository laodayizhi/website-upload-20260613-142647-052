function initMoviePlayer(source) {
  var video = document.getElementById("movie-video");
  var trigger = document.getElementById("play-trigger");
  var hlsInstance = null;

  if (!video || !source) {
    return;
  }

  function loadVideo() {
    if (video.dataset.ready === "1") {
      return;
    }

    video.dataset.ready = "1";

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = source;
  }

  function startVideo() {
    loadVideo();
    if (trigger) {
      trigger.classList.add("is-hidden");
    }
    var attempt = video.play();
    if (attempt && attempt.catch) {
      attempt.catch(function () {});
    }
  }

  if (trigger) {
    trigger.addEventListener("click", startVideo);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      startVideo();
    }
  });

  video.addEventListener("play", function () {
    if (trigger) {
      trigger.classList.add("is-hidden");
    }
  });

  video.addEventListener("ended", function () {
    if (trigger) {
      trigger.classList.remove("is-hidden");
    }
  });

  window.addEventListener("pagehide", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}

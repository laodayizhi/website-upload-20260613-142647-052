(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return (value || "").toString().toLowerCase().trim();
  }

  ready(function () {
    var header = document.querySelector(".site-header");
    var menuButton = document.querySelector(".menu-toggle");
    var menu = document.querySelector(".nav-menu");

    function refreshHeader() {
      if (!header) {
        return;
      }
      if (window.scrollY > 8) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }

    refreshHeader();
    window.addEventListener("scroll", refreshHeader, { passive: true });

    if (menuButton && menu) {
      menuButton.addEventListener("click", function () {
        var open = menu.classList.toggle("is-open");
        menuButton.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var thumbs = Array.prototype.slice.call(document.querySelectorAll(".hero-thumb"));
    var heroIndex = 0;
    var heroTimer = null;

    function showHero(index) {
      if (!slides.length) {
        return;
      }
      heroIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle("is-active", itemIndex === heroIndex);
      });
      thumbs.forEach(function (thumb, itemIndex) {
        thumb.classList.toggle("is-active", itemIndex === heroIndex);
      });
    }

    function scheduleHero() {
      if (heroTimer) {
        window.clearInterval(heroTimer);
      }
      if (slides.length > 1) {
        heroTimer = window.setInterval(function () {
          showHero(heroIndex + 1);
        }, 5200);
      }
    }

    thumbs.forEach(function (thumb, index) {
      thumb.addEventListener("click", function () {
        showHero(index);
        scheduleHero();
      });
    });

    showHero(0);
    scheduleHero();

    var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
    scopes.forEach(function (scope) {
      var input = scope.querySelector(".filter-input");
      var selects = Array.prototype.slice.call(scope.querySelectorAll(".filter-select"));
      var grid = scope.nextElementSibling;
      while (grid && !grid.classList.contains("movie-grid")) {
        grid = grid.nextElementSibling;
      }
      if (!grid) {
        grid = document.querySelector(scope.getAttribute("data-target") || "");
      }
      if (!grid) {
        return;
      }
      var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));

      function matches(card) {
        var text = normalize([
          card.dataset.title,
          card.dataset.region,
          card.dataset.year,
          card.dataset.type,
          card.dataset.genre,
          card.dataset.tags
        ].join(" "));
        var query = normalize(input ? input.value : "");
        if (query && text.indexOf(query) === -1) {
          return false;
        }
        for (var i = 0; i < selects.length; i += 1) {
          var select = selects[i];
          var key = select.getAttribute("data-filter");
          var value = normalize(select.value);
          if (value && normalize(card.dataset[key]).indexOf(value) === -1) {
            return false;
          }
        }
        return true;
      }

      function update() {
        cards.forEach(function (card) {
          card.classList.toggle("hidden-by-filter", !matches(card));
        });
      }

      if (input) {
        input.addEventListener("input", update);
      }
      selects.forEach(function (select) {
        select.addEventListener("change", update);
      });
    });
  });
})();

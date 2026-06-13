document.addEventListener("DOMContentLoaded", function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobileMenu = document.querySelector("[data-mobile-menu]");

    if (menuButton && mobileMenu) {
        menuButton.addEventListener("click", function () {
            mobileMenu.classList.toggle("open");
        });
    }

    document.querySelectorAll("[data-search-scope]").forEach(function (scope) {
        var input = scope.querySelector("[data-card-search]");
        var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .compact-card"));
        var filters = Array.prototype.slice.call(scope.querySelectorAll("[data-filter]"));
        var empty = scope.querySelector("[data-empty-state]");
        var activeFilter = "all";

        function applyFilters() {
            var query = input ? input.value.trim().toLowerCase() : "";
            var visible = 0;

            cards.forEach(function (card) {
                var text = (card.getAttribute("data-search") || "").toLowerCase();
                var category = card.getAttribute("data-category") || "";
                var matchedText = !query || text.indexOf(query) !== -1;
                var matchedCategory = activeFilter === "all" || category === activeFilter;
                var show = matchedText && matchedCategory;
                card.style.display = show ? "" : "none";
                if (show) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("show", visible === 0);
            }
        }

        if (input) {
            input.addEventListener("input", applyFilters);
        }

        filters.forEach(function (button) {
            button.addEventListener("click", function () {
                activeFilter = button.getAttribute("data-filter") || "all";
                filters.forEach(function (item) {
                    item.classList.toggle("active", item === button);
                });
                applyFilters();
            });
        });
    });
});

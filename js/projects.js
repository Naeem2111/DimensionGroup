(function () {
  "use strict";

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderProjectCard(p) {
    var tags = (p.categories || [])
      .map(function (c) {
        return '<span class="tag">' + escapeHtml(c) + "</span>";
      })
      .join("");
    return (
      '<article class="project-card">' +
      '<div class="project-card-image"><img src="' +
      escapeHtml(p.image) +
      '" alt="' +
      escapeHtml(p.name) +
      '" loading="lazy" width="600" height="450"></div>' +
      '<div class="project-card-body">' +
      '<div class="project-meta">' +
      tags +
      "</div>" +
      "<h3>" +
      escapeHtml(p.name) +
      "</h3>" +
      '<p style="font-size:0.875rem;color:var(--muted);margin:0 0 0.5rem">' +
      escapeHtml(p.location) +
      " · " +
      escapeHtml(p.service) +
      "</p>" +
      '<p style="margin:0;font-size:0.9375rem;">' +
      escapeHtml(p.description) +
      "</p>" +
      "</div></article>"
    );
  }

  function loadFeatured(container) {
    if (!container) return;
    fetch("data/projects.json")
      .then(function (r) {
        return r.json();
      })
      .then(function (list) {
        var featured = list.filter(function (p) {
          return p.featured;
        });
        container.innerHTML = featured.map(renderProjectCard).join("");
      })
      .catch(function () {
        container.innerHTML =
          "<p>Projects could not be loaded. Open the site through a local web server so <code>data/projects.json</code> can be fetched.</p>";
      });
  }

  function loadAll(container, filterEl) {
    if (!container) return;

    function applyFilter(list) {
      var cat = filterEl && filterEl.value ? filterEl.value : "";
      var filtered = cat
        ? list.filter(function (p) {
            var cats = p.categories || [];
            var svc = p.service || "";
            return (
              cats.indexOf(cat) !== -1 ||
              svc === cat ||
              (cat === "BIM" && svc.indexOf("BIM") !== -1)
            );
          })
        : list;
      container.innerHTML = filtered.map(renderProjectCard).join("");
    }

    fetch("data/projects.json")
      .then(function (r) {
        return r.json();
      })
      .then(function (list) {
        applyFilter(list);
        if (filterEl) {
          filterEl.addEventListener("change", function () {
            applyFilter(list);
          });
        }
      })
      .catch(function () {
        container.innerHTML =
          "<p>Could not load projects. Use a local server and check <code>data/projects.json</code>.</p>";
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadFeatured(document.getElementById("featured-projects"));
    loadAll(
      document.getElementById("all-projects"),
      document.getElementById("project-filter")
    );
  });
})();

(function () {
  "use strict";

  var modalEl = null;
  var lastFocused = null;

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function ensureModal() {
    if (modalEl) return modalEl;

    modalEl = document.createElement("div");
    modalEl.id = "project-modal";
    modalEl.className = "project-modal";
    modalEl.hidden = true;
    modalEl.setAttribute("role", "dialog");
    modalEl.setAttribute("aria-modal", "true");
    modalEl.setAttribute("aria-labelledby", "project-modal-title");
    modalEl.innerHTML =
      '<div class="project-modal-backdrop" data-modal-close tabindex="-1"></div>' +
      '<div class="project-modal-panel">' +
      '<button type="button" class="project-modal-close" data-modal-close aria-label="Close project view">' +
      '<span aria-hidden="true">&times;</span>' +
      "</button>" +
      '<p id="project-modal-title" class="project-modal-title"></p>' +
      '<img class="project-modal-image" src="" alt="" />' +
      "</div>";
    document.body.appendChild(modalEl);

    modalEl.querySelectorAll("[data-modal-close]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modalEl && !modalEl.hidden) {
        closeModal();
      }
    });

    return modalEl;
  }

  function openModal(name, detailImage) {
    var modal = ensureModal();
    var title = modal.querySelector("#project-modal-title");
    var img = modal.querySelector(".project-modal-image");

    lastFocused = document.activeElement;
    title.textContent = name;
    img.src = detailImage;
    img.alt = name + " — project sheet";
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector(".project-modal-close").focus();
  }

  function closeModal() {
    if (!modalEl || modalEl.hidden) return;
    modalEl.hidden = true;
    document.body.classList.remove("modal-open");
    modalEl.querySelector(".project-modal-image").removeAttribute("src");
    if (lastFocused && lastFocused.focus) {
      lastFocused.focus();
    }
  }

  function activateCard(card) {
    var detailImage = card.getAttribute("data-detail-image");
    var name = card.getAttribute("data-project-name");
    if (detailImage && name) {
      openModal(name, detailImage);
    }
  }

  function bindProjectInteractions() {
    document.addEventListener("click", function (e) {
      var card = e.target.closest(".project-card--interactive");
      if (!card) return;
      e.preventDefault();
      activateCard(card);
    });

    document.addEventListener("keydown", function (e) {
      var card = e.target.closest(".project-card--interactive");
      if (!card) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateCard(card);
      }
    });
  }

  function renderProjectCard(p) {
    var tags = (p.categories || [])
      .map(function (c) {
        return '<span class="tag">' + escapeHtml(c) + "</span>";
      })
      .join("");

    var hasDetail = Boolean(p.detailImage);
    var cardClass = "project-card" + (hasDetail ? " project-card--interactive" : "");
    var cardAttrs = hasDetail
      ? ' tabindex="0" role="button" data-detail-image="' +
        escapeHtml(p.detailImage) +
        '" data-project-name="' +
        escapeHtml(p.name) +
        '" aria-label="View ' +
        escapeHtml(p.name) +
        ' project sheet"'
      : "";

    return (
      '<article class="' +
      cardClass +
      '"' +
      cardAttrs +
      ">" +
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
      (hasDetail
        ? '<p class="project-card-hint">Click to view project sheet</p>'
        : "") +
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
    bindProjectInteractions();
    loadFeatured(document.getElementById("featured-projects"));
    loadAll(
      document.getElementById("all-projects"),
      document.getElementById("project-filter")
    );
  });
})();

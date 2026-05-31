(function () {
  "use strict";

  /* --- Site configuration (update before launch) --- */
  var WHATSAPP_NUMBER = "27123456789";
  var EMAIL = "hello@dimensiongroup.example";
  /* WhatsApp: country code + number, no + or spaces. Replace placeholder email across HTML or use find/replace. */

  function openMenu(open) {
    var btn = document.querySelector(".btn-nav-toggle");
    var panel = document.querySelector(".nav-mobile");
    if (!btn || !panel) return;
    panel.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("menu-open", open);
  }

  var toggleBtn = document.querySelector(".btn-nav-toggle");
  var mobileNav = document.querySelector(".nav-mobile");
  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener("click", function () {
      openMenu(!mobileNav.classList.contains("is-open"));
    });
  }

  document.querySelectorAll(".nav-mobile a").forEach(function (a) {
    a.addEventListener("click", function () {
      openMenu(false);
    });
  });

  window.DimensionSite = window.DimensionSite || {};
  window.DimensionSite.WHATSAPP_NUMBER = WHATSAPP_NUMBER;
  window.DimensionSite.EMAIL = EMAIL;

  window.DimensionSite.whatsappHref = function (prefill) {
    var base = "https://wa.me/" + WHATSAPP_NUMBER;
    if (prefill) {
      return base + "?text=" + encodeURIComponent(prefill);
    }
    return base;
  };

  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    var pre = el.getAttribute("data-whatsapp-prefill") || "";
    el.setAttribute("href", window.DimensionSite.whatsappHref(pre));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });
})();

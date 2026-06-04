(function () {
  "use strict";

  var viewer = document.getElementById("hero-model");
  var fallback = document.querySelector(".hero-3d-fallback");
  if (!viewer || !fallback) return;

  viewer.addEventListener("load", function () {
    fallback.hidden = true;
    viewer.classList.add("is-ready");
  });

  viewer.addEventListener("error", function () {
    viewer.hidden = true;
    fallback.hidden = false;
  });
})();

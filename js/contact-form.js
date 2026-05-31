(function () {
  "use strict";

  var steps = [];
  var current = 0;
  var selectedService = null;

  function showStep(n) {
    steps.forEach(function (el, i) {
      el.classList.toggle("is-active", i === n);
    });
    current = n;
  }

  function collectQuestionnaire() {
    var fields = document.querySelectorAll("#lead-wizard [data-service-field]:not([disabled])");
    var lines = [];
    fields.forEach(function (el) {
      var label =
        el.getAttribute("data-label") ||
        (el.labels && el.labels[0] ? el.labels[0].textContent : el.name);
      var val = "";
      if (el.type === "checkbox") {
        val = el.checked ? "Yes" : "No";
      } else {
        val = el.value;
      }
      if (val) {
        lines.push(label.trim() + ": " + val);
      }
    });
    return lines.join("\n");
  }

  function syncServiceFields(service) {
    document.querySelectorAll("[data-service-field]").forEach(function (el) {
      var svc = el.getAttribute("data-service");
      var show = svc === service;
      el.disabled = !show;
      el.closest(".form-row").style.display = show ? "" : "none";
    });
  }

  function buildEmailBody() {
    var name = document.getElementById("contact-name").value.trim();
    var email = document.getElementById("contact-email").value.trim();
    var phone = document.getElementById("contact-phone").value.trim();
    var region = document.getElementById("contact-region").value;
    var message = document.getElementById("contact-message").value.trim();
    var q = collectQuestionnaire();
    return (
      "New enquiry — Dimension Group\n\n" +
      "Service interest: " +
      selectedService +
      "\n" +
      "Region: " +
      region +
      "\n" +
      "Name: " +
      name +
      "\n" +
      "Email: " +
      email +
      "\n" +
      "Phone: " +
      phone +
      "\n\n" +
      "--- Project details ---\n" +
      q +
      "\n\n--- Message ---\n" +
      message
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    var wizard = document.getElementById("lead-wizard");
    if (!wizard) return;

    steps = Array.prototype.slice.call(wizard.querySelectorAll(".form-step"));
    if (!steps.length) return;

    document.querySelectorAll("[data-select-service]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        selectedService = btn.getAttribute("data-select-service");
        syncServiceFields(selectedService);
        showStep(1);
      });
    });

    var next1 = document.getElementById("wizard-next-1");
    if (next1) {
      next1.addEventListener("click", function () {
        showStep(2);
      });
    }

    var back1 = document.getElementById("wizard-back-1");
    if (back1) {
      back1.addEventListener("click", function () {
        showStep(0);
      });
    }

    var back2 = document.getElementById("wizard-back-2");
    if (back2) {
      back2.addEventListener("click", function () {
        showStep(1);
      });
    }

    wizard.addEventListener("submit", function (e) {
      e.preventDefault();
      var emailTo =
        (window.DimensionSite && window.DimensionSite.EMAIL) || "hello@dimensiongroup.example";
      var subject = encodeURIComponent(
        "Enquiry: " + (selectedService || "General") + " — Dimension Group"
      );
      var body = encodeURIComponent(buildEmailBody());
      window.location.href = "mailto:" + emailTo + "?subject=" + subject + "&body=" + body;
    });

    var simpleForm = document.getElementById("simple-contact-form");
    if (simpleForm) {
      simpleForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var emailTo =
          (window.DimensionSite && window.DimensionSite.EMAIL) || "hello@dimensiongroup.example";
        var name = document.getElementById("simple-name").value.trim();
        var email = document.getElementById("simple-email").value.trim();
        var msg = document.getElementById("simple-message").value.trim();
        var subject = encodeURIComponent("Website contact — Dimension Group");
        var body = encodeURIComponent(
          "Name: " + name + "\nEmail: " + email + "\n\n" + msg
        );
        window.location.href = "mailto:" + emailTo + "?subject=" + subject + "&body=" + body;
      });
    }

    showStep(0);
  });
})();

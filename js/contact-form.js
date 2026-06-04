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

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function buildEmailBody() {
    return (
      "New enquiry — Dimension Group\n\n" +
      "Service: " +
      selectedService +
      "\n" +
      "Company: " +
      val("lead-company") +
      "\n" +
      "Project location: " +
      val("lead-location") +
      "\n" +
      "Project type: " +
      val("lead-project-type") +
      "\n" +
      "Budget range: " +
      val("lead-budget") +
      "\n\n" +
      "Region: " +
      val("contact-region") +
      "\n" +
      "Name: " +
      val("contact-name") +
      "\n" +
      "Email: " +
      val("contact-email") +
      "\n" +
      "Phone: " +
      val("contact-phone") +
      "\n\n" +
      "--- Message ---\n" +
      val("lead-message")
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
        document.querySelectorAll("[data-select-service]").forEach(function (b) {
          b.classList.toggle("is-selected", b === btn);
        });
        showStep(1);
      });
    });

    var next1 = document.getElementById("wizard-next-1");
    if (next1) {
      next1.addEventListener("click", function () {
        var company = val("lead-company");
        var location = val("lead-location");
        var projectType = val("lead-project-type");
        var budget = val("lead-budget");
        var message = val("lead-message");
        if (!company || !location || !projectType || !budget || !message) {
          alert("Please complete all project fields before continuing.");
          return;
        }
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
      if (!selectedService) {
        alert("Please select a service first.");
        showStep(0);
        return;
      }
      var emailTo =
        (window.DimensionSite && window.DimensionSite.EMAIL) || "hello@dimensiongroup.example";
      var subject = encodeURIComponent(
        "Enquiry: " + selectedService + " — Dimension Group"
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
        var body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + msg);
        window.location.href = "mailto:" + emailTo + "?subject=" + subject + "&body=" + body;
      });
    }

    showStep(0);
  });
})();

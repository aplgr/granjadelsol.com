/**
* Template Name: Mamba
* Template URL: https://bootstrapmade.com/mamba-one-page-bootstrap-template-free/
* Adapted for Granja del Sol with Bootstrap v5.3.8
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function () {
  "use strict";

  const header = document.querySelector("#header");
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");
  const backToTop = document.querySelector(".back-to-top");

  function toggleHeaderScrolled() {
    if (!header) return;
    header.classList.toggle("header-scrolled", window.scrollY > 100);
  }

  function toggleBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle("active", window.scrollY > 100);
  }

  function mobileNavToggle() {
    if (!mobileNavToggleBtn) return;
    document.body.classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }

  function samePage(url) {
    const current = new URL(window.location.href);
    return url.hostname === current.hostname &&
      url.pathname.replace(/\/index\.html$/, "/") === current.pathname.replace(/\/index\.html$/, "/");
  }

  function scrollToTarget(target) {
    const headerOffset = header ? header.offsetHeight : 0;
    const top = target === header ? 0 : target.getBoundingClientRect().top + window.pageYOffset - headerOffset + 2;
    window.scrollTo({ top, behavior: "smooth" });
  }

  document.addEventListener("scroll", () => {
    toggleHeaderScrolled();
    toggleBackToTop();
  });

  window.addEventListener("load", () => {
    toggleHeaderScrolled();
    toggleBackToTop();
  });

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", mobileNavToggle);
  }

  document.querySelectorAll(".navmenu .dropdown > a").forEach((dropdownLink) => {
    dropdownLink.addEventListener("click", function (event) {
      if (this.getAttribute("href") !== "#") return;

      event.preventDefault();

      if (window.innerWidth >= 992) return;

      this.parentElement.classList.toggle("active");
      const dropdown = this.nextElementSibling;
      if (dropdown) dropdown.classList.toggle("dropdown-active");
    });
  });

  document.querySelectorAll(".navmenu a").forEach((navLink) => {
    navLink.addEventListener("click", function () {
      if (this.getAttribute("href") === "#" && this.parentElement.classList.contains("dropdown")) return;
      if (document.body.classList.contains("mobile-nav-active")) {
        mobileNavToggle();
      }
    });
  });

  document.querySelectorAll('a[href*="#"]:not([href="#"])').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      const href = this.getAttribute("href");
      if (!href) return;

      const url = new URL(href, window.location.href);
      if (!url.hash) return;

      const target = document.querySelector(url.hash);
      if (!target || !samePage(url)) return;

      event.preventDefault();
      if (document.body.classList.contains("mobile-nav-active")) {
        mobileNavToggle();
      }

      scrollToTarget(target);
      history.pushState(null, "", url.hash);
    });
  });

  if (backToTop) {
    backToTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  window.addEventListener("load", () => {
    if (!window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => scrollToTarget(target), 100);
    }
  });

  document.querySelectorAll(".carousel-indicators").forEach((carouselIndicator) => {
    const carousel = carouselIndicator.closest(".carousel");
    if (!carousel || !carousel.id) return;

    const items = carousel.querySelectorAll(".carousel-item");
    carouselIndicator.innerHTML = "";

    if (items.length <= 1) {
      carouselIndicator.classList.add("d-none");
      return;
    }

    items.forEach((_item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("data-bs-target", `#${carousel.id}`);
      button.setAttribute("data-bs-slide-to", String(index));
      button.setAttribute("aria-label", `Slide ${index + 1}`);

      if (index === 0) {
        button.classList.add("active");
        button.setAttribute("aria-current", "true");
      }

      carouselIndicator.appendChild(button);
    });
  });

  document.querySelectorAll(".carousel").forEach((carousel) => {
    carousel.addEventListener("slid.bs.carousel", function () {
      this.querySelectorAll("h2").forEach((item) => item.classList.add("animated", "fadeInDown"));
      this.querySelectorAll("p, .btn-get-started").forEach((item) => item.classList.add("animated", "fadeInUp"));
    });
  });

  window.addEventListener("load", () => {
    if (window.AOS) {
      AOS.init({
        duration: 1000,
        easing: "ease-in-out-back"
      });
    }

    if (!window.jQuery) return;

    const $ = window.jQuery;

    if ($.fn.venobox) {
      $(".venobox").venobox();
    }

    if ($.fn.isotope && $(".portfolio-container").length) {
      const portfolioIsotope = $(".portfolio-container").isotope({
        itemSelector: ".portfolio-item",
        layoutMode: "fitRows"
      });

      $("#portfolio-flters li").on("click", function () {
        $("#portfolio-flters li").removeClass("filter-active");
        $(this).addClass("filter-active");

        portfolioIsotope.isotope({
          filter: $(this).data("filter")
        });
      });
    }
  });
})();

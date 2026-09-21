(() => {
  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileCta = document.getElementById("mobile-cta");
  const navLinks = document.querySelectorAll("[data-nav]");
  const sections = [...document.querySelectorAll("section[id], footer[id]")];

  const closeMenu = () => {
    burger.classList.remove("is-open");
    mobileMenu.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  };

  burger.addEventListener("click", () => {
    const open = burger.classList.toggle("is-open");
    mobileMenu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 16);
    mobileCta.classList.toggle("is-visible", y > 420);

    let current = "hero";
    sections.forEach((section) => {
      if (y >= section.offsetTop - 140) current = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`);
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();

(() => {
  const form = document.querySelector("#order-form form");
  const phone = document.querySelector("#order-form input[name='phone']");
  if (!form || !phone) return;

  phone.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9+\-() ]/g, "");
  });

  form.addEventListener("submit", function (event) {
    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
    }
  });
})();

(() => {
  const popup = document.getElementById("cookie-popup");
  const ok = document.getElementById("cookie-popup-ok");
  if (!popup || !ok) return;

  if (window.localStorage.getItem("cookie_form_accepted") === "true") {
    popup.style.display = "none";
    return;
  }

  ok.addEventListener("click", function () {
    window.localStorage.setItem("cookie_form_accepted", "true");
    popup.style.opacity = "0";
    window.setTimeout(function () {
      popup.style.display = "none";
    }, 350);
  });
})();


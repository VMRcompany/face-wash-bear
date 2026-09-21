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

  const formatRuPhone = (raw) => {
    let digits = String(raw).replace(/\D/g, "");
    if (digits.startsWith("8")) digits = "7" + digits.slice(1);
    if (digits && digits.charAt(0) !== "7") digits = "7" + digits;
    digits = digits.slice(0, 11);

    let out = "+7";
    if (digits.length > 1) out += " (" + digits.slice(1, 4);
    if (digits.length >= 4) out += ")";
    if (digits.length > 4) out += " " + digits.slice(4, 7);
    if (digits.length > 7) out += "-" + digits.slice(7, 9);
    if (digits.length > 9) out += "-" + digits.slice(9, 11);
    return out;
  };

  phone.addEventListener("input", () => {
    phone.value = formatRuPhone(phone.value);
  });

  form.addEventListener("submit", (event) => {
    const nameInput = form.querySelector("input[name='name']");
    const phoneOk = phone.checkValidity();
    const nameOk = nameInput.checkValidity();
    if (!nameOk || !phoneOk) {
      event.preventDefault();
      if (!nameOk) nameInput.reportValidity();
      else phone.reportValidity();
      return;
    }
    event.preventDefault();
  });
})();


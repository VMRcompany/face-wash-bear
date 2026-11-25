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
  const thanks = document.getElementById("order-form-thanks");
  const thanksClose = document.getElementById("order-form-thanks-close");
  if (!form || !phone) return;

  phone.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9+\-() ]/g, "");
  });

  const showThanks = function () {
    if (!thanks) return;
    thanks.removeAttribute("hidden");
  };

  const hideThanks = function () {
    if (!thanks) return;
    thanks.setAttribute("hidden", "");
  };

  if (thanksClose) thanksClose.addEventListener("click", hideThanks);
  if (thanks) {
    thanks.addEventListener("click", function (event) {
      if (event.target === thanks) hideThanks();
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const nameInput = form.querySelector('input[name="name"]');
    const button = form.querySelector('button[type="submit"]');
    const name = nameInput ? nameInput.value : "";
    const phoneValue = phone.value;
    if (button) button.disabled = true;

    let settled = false;

    function finishThanks() {
      if (settled) return;
      settled = true;
      form.reset();
      showThanks();
      if (button) button.disabled = false;
    }

    // Сервер часто отвечает десятки секунд, хотя заявку уже принял.
    // Благодарность показываем сразу, отправка продолжается сама.
    const thanksTimer = window.setTimeout(finishThanks, 700);

    fetch(form.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name: name,
        phone: phoneValue,
        _subject: "Заявка с сайта FACE WASH BEAR"
      })
    })
      .then(function (response) {
        if (!response.ok) throw new Error("status");
        return response.json();
      })
      .then(function (data) {
        const queued = data && /activat/i.test(String(data.message || ""));
        if (!data || (String(data.success) !== "true" && !queued)) throw new Error("send");
        window.clearTimeout(thanksTimer);
        finishThanks();
      })
      .catch(function () {
        if (settled) return;
        window.clearTimeout(thanksTimer);
        if (button) button.disabled = false;
      });
  });
})();

(() => {
  const widget = document.getElementById("cookies-widget");
  const accept = document.getElementById("cookies-accept");
  if (!widget || !accept) return;

  if (window.localStorage.getItem("cookies_accepted") === "true") {
    widget.setAttribute("hidden", "");
    return;
  }

  widget.removeAttribute("hidden");

  accept.addEventListener("click", function () {
    window.localStorage.setItem("cookies_accepted", "true");
    widget.classList.add("is-hiding");
    window.setTimeout(function () {
      widget.setAttribute("hidden", "");
    }, 300);
  });
})();


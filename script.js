/* ==========================================================================
   Jashandeep Kaur — Portfolio
   Small, focused interactions: nothing here is decorative for its own sake.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  initProgressBar();
  initNavScrollState();
  initMobileNav();
  initActiveSectionLinks();
  initScrollReveal();
  initSmoothNav();
  initEmailCopy();
  initBackToTop();
});

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* --------------------------------------------------------------------
   Footer year
   -------------------------------------------------------------------- */
function setYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* --------------------------------------------------------------------
   Top progress bar — fills as the page scrolls
   -------------------------------------------------------------------- */
function initProgressBar() {
  const bar = document.getElementById("progressBar");
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

/* --------------------------------------------------------------------
   Nav background switches on once the page has scrolled a little
   -------------------------------------------------------------------- */
function initNavScrollState() {
  const nav = document.getElementById("siteNav");
  if (!nav) return;

  const update = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* --------------------------------------------------------------------
   Mobile nav toggle
   -------------------------------------------------------------------- */
function initMobileNav() {
  const nav = document.getElementById("siteNav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!nav || !toggle || !links) return;

  const close = () => {
    nav.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* --------------------------------------------------------------------
   Highlight the nav link for whichever section is in view
   -------------------------------------------------------------------- */
function initActiveSectionLinks() {
  const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
  if (!navLinks.length) return;

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  const linkFor = (id) =>
    navLinks.find((link) => link.getAttribute("href") === `#${id}`);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkFor(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* --------------------------------------------------------------------
   Scroll reveal — fades content in once it enters the viewport
   -------------------------------------------------------------------- */
function initScrollReveal() {
  const items = Array.from(document.querySelectorAll(".reveal"));
  if (!items.length) return;

  if (prefersReducedMotion) {
    items.forEach((item) => item.classList.add("in-view"));
    return;
  }

  // Light stagger within each natural group (siblings revealed close together)
  let lastTop = null;
  let stagger = 0;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const top = Math.round(entry.boundingClientRect.top / 40);
        stagger = top === lastTop ? stagger + 1 : 0;
        lastTop = top;

        const delay = Math.min(stagger * 70, 280);
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add("in-view");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((item) => observer.observe(item));
}

/* --------------------------------------------------------------------
   Clicking a nav link scrolls to the section AND replays its entrance
   animation, so content visibly animates in on arrival — not just on
   the first organic scroll past it.
   -------------------------------------------------------------------- */
function initSmoothNav() {
  const navLinks = document.querySelectorAll(".nav-links a, .nav-logo");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href.charAt(0) !== "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      splashSection(target);
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
      history.pushState(null, "", href);
    });
  });
}

function splashSection(section) {
  if (prefersReducedMotion) return;

  const items = section.querySelectorAll(".reveal");
  if (!items.length) return;

  // Snap instantly to the "hidden" state with transitions switched off...
  items.forEach((item) => {
    item.style.transition = "none";
    item.classList.remove("in-view");
  });

  void section.offsetHeight; // force a reflow so the snap actually takes

  // ...then re-enable transitions and reveal on the next frame, so the
  // browser animates from hidden to visible instead of skipping straight
  // to the end state.
  requestAnimationFrame(() => {
    items.forEach((item, i) => {
      item.style.transition = "";
      item.style.transitionDelay = `${Math.min(i * 60, 260)}ms`;
    });
    requestAnimationFrame(() => {
      items.forEach((item) => item.classList.add("in-view"));
    });
  });
}

/* --------------------------------------------------------------------
   Click-to-copy email address
   -------------------------------------------------------------------- */
function initEmailCopy() {
  const button = document.getElementById("copyEmail");
  const toast = document.getElementById("toast");
  if (!button) return;

  const hint = button.querySelector(".copy-hint");
  const defaultHint = hint ? hint.textContent : "";

  button.addEventListener("click", async () => {
    const email = button.dataset.email;
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
    } catch (err) {
      // Clipboard API unavailable — fall back to a manual selection prompt
      window.prompt("Copy this email address:", email);
    }

    if (hint) {
      hint.textContent = "Copied to clipboard";
      window.setTimeout(() => {
        hint.textContent = defaultHint;
      }, 2200);
    }

    showToast(toast, "Email copied to clipboard");
  });
}

function showToast(toast, message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

/* --------------------------------------------------------------------
   Back to top
   -------------------------------------------------------------------- */
function initBackToTop() {
  const button = document.getElementById("backToTop");
  if (!button) return;

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });
}
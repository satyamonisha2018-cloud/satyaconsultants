const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const contactForm = document.querySelector("#contactForm");
const candidateForm = document.querySelector("#candidateForm");
const siteHeader = document.querySelector(".site-header");
const revealTargets = document.querySelectorAll(".reveal-section, .reveal-group");
const statNumbers = document.querySelectorAll(".stat-number");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const updateHeader = () => {
  siteHeader.classList.toggle("scrolled", window.scrollY > 24);
};

const setRevealOrder = () => {
  document.querySelectorAll(".reveal-group").forEach((group) => {
    group.querySelectorAll(".reveal-item").forEach((item, index) => {
      item.style.setProperty("--reveal-order", index);
    });
  });
};

const animateNumber = (numberElement) => {
  if (numberElement.dataset.animated === "true") {
    return;
  }

  numberElement.dataset.animated = "true";
  const target = Number(numberElement.dataset.target);
  const duration = 1400;
  const startedAt = performance.now();

  const tick = (currentTime) => {
    const elapsed = currentTime - startedAt;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    numberElement.textContent = Math.round(target * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      entry.target.querySelectorAll(".stat-number").forEach(animateNumber);
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18 }
);

setRevealOrder();
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (prefersReducedMotion) {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
  statNumbers.forEach((numberElement) => {
    numberElement.textContent = numberElement.dataset.target;
  });
} else {
  revealTargets.forEach((target) => revealObserver.observe(target));
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const recipient = "your-email@example.com";
  const visitorType = document.querySelector("#visitorType").value;
  const name = document.querySelector("#name").value.trim();
  const contactInfo = document.querySelector("#contactInfo").value.trim();
  const message = document.querySelector("#message").value.trim();

  const subject = encodeURIComponent(`Satya Consultants enquiry - ${visitorType}`);
  const body = encodeURIComponent(
    `Name: ${name}\nI am a: ${visitorType}\nPhone or email: ${contactInfo}\n\nRequirement:\n${message}`
  );

  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});

candidateForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const recipient = "your-email@example.com";
  const candidateName = document.querySelector("#candidateName").value.trim();
  const candidatePhone = document.querySelector("#candidatePhone").value.trim();
  const candidateEmail = document.querySelector("#candidateEmail").value.trim();
  const qualification = document.querySelector("#qualification").value.trim();
  const preferredRole = document.querySelector("#preferredRole").value.trim();
  const preferredLocation = document.querySelector("#preferredLocation").value.trim();
  const candidateMessage = document.querySelector("#candidateMessage").value.trim();

  const subject = encodeURIComponent(`Candidate registration - ${candidateName}`);
  const body = encodeURIComponent(
    `Candidate name: ${candidateName}\nPhone: ${candidatePhone}\nEmail: ${candidateEmail}\nQualification: ${qualification}\nPreferred role: ${preferredRole}\nPreferred location: ${preferredLocation}\n\nSkills or experience:\n${candidateMessage}\n\nResume: Please attach resume before sending.`
  );

  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});

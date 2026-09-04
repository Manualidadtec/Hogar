const commandTrigger = document.getElementById("commandTrigger");
const commandPalette = document.getElementById("commandPalette");
const paletteBackdrop = document.getElementById("paletteBackdrop");
const closePaletteButton = document.getElementById("closePalette");
const paletteSearch = document.getElementById("paletteSearch");
const paletteLinks = [...document.querySelectorAll(".palette-link")];

function openPalette() {
  paletteBackdrop.hidden = false;
  commandPalette.setAttribute("aria-hidden", "false");
  commandTrigger.setAttribute("aria-expanded", "true");
  commandPalette.classList.add("is-open");
  document.body.classList.add("menu-open");

  window.setTimeout(() => {
    paletteSearch.focus();
  }, 120);
}

function closePalette() {
  commandPalette.classList.remove("is-open");
  commandPalette.setAttribute("aria-hidden", "true");
  commandTrigger.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");

  window.setTimeout(() => {
    paletteBackdrop.hidden = true;
  }, 220);

  commandTrigger.focus();
}

function navigateToSection(targetId) {
  const target = document.getElementById(targetId);

  if (!target) return;

  paletteLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.target === targetId);
  });

  closePalette();

  window.setTimeout(() => {
    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 120);
}

commandTrigger.addEventListener("click", () => {
  const isOpen = commandTrigger.getAttribute("aria-expanded") === "true";

  if (isOpen) {
    closePalette();
  } else {
    openPalette();
  }
});

closePaletteButton.addEventListener("click", closePalette);
paletteBackdrop.addEventListener("click", closePalette);

paletteLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const targetId = link.dataset.target;

    if (targetId === "portfolio") {
      navigateToSection("portfolio");
      return;
    }

    navigateToSection(targetId);
  });
});

document.addEventListener("keydown", (event) => {
  const commandPressed = event.metaKey || event.ctrlKey;

  if (commandPressed && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openPalette();
  }

  if (event.key === "Escape") {
    const isOpen = commandTrigger.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closePalette();
    }
  }
});

paletteSearch.addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase().trim();

  paletteLinks.forEach((link) => {
    const searchableText = link.textContent.toLowerCase();
    const matches = searchableText.includes(searchTerm);

    link.hidden = !matches;
  });
});

const sections = document.querySelectorAll("main section[id]");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const activeId = entry.target.id;

      paletteLinks.forEach((link) => {
        const targetId = link.dataset.target;
        const isActive =
          targetId === activeId ||
          (activeId === "portfolio-detail" && targetId === "portfolio");

        link.classList.toggle("active", isActive);
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  }
);

sections.forEach((section) => sectionObserver.observe(section));

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

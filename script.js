const commandTrigger = document.getElementById("commandTrigger");
const commandPalette = document.getElementById("commandPalette");
const paletteBackdrop = document.getElementById("paletteBackdrop");
const closePaletteButton = document.getElementById("closePalette");
const paletteSearch = document.getElementById("paletteSearch");
const paletteLinks = [...document.querySelectorAll(".palette-link")];

// Live Preview DOM Elements (Instance 1: Creation)
const previewContainer = document.getElementById("previewContainer");
const livePreviewIframe = document.getElementById("livePreviewIframe");
const previewSiteTitle = document.getElementById("previewSiteTitle");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const openNewTabBtn = document.getElementById("openNewTabBtn");

// Live Preview DOM Elements (Instance 2: Ejemplo)
const previewContainerEjemplo = document.getElementById("previewContainerEjemplo");
const livePreviewIframeEjemplo = document.getElementById("livePreviewIframeEjemplo");
const previewSiteTitleEjemplo = document.getElementById("previewSiteTitleEjemplo");
const fullscreenBtnEjemplo = document.getElementById("fullscreenBtnEjemplo");
const openNewTabBtnEjemplo = document.getElementById("openNewTabBtnEjemplo");

const templateCards = document.querySelectorAll(".template-card[data-url]");

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

/* ==========================================================================
   Interactive Live Preview / Sandbox Functionality
   ========================================================================== */

/**
 * Generic helper to initialize an interactive live-preview sandbox window
 */
function initLivePreviewWindow({ container, iframe, fullscreenButton, openTabButton, defaultUrl }) {
  if (!container || !iframe) return;

  // 1. Toggle Native Fullscreen
  if (fullscreenButton) {
    fullscreenButton.addEventListener("click", () => {
      const isFullscreen = document.fullscreenElement === container || document.webkitFullscreenElement === container;

      if (!isFullscreen) {
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    });

    const handleFullscreenChange = () => {
      const isCurrentFullscreen = document.fullscreenElement === container || document.webkitFullscreenElement === container;
      fullscreenButton.innerHTML = isCurrentFullscreen
        ? `Exit Full Screen <span class="btn-icon" aria-hidden="true">✕</span>`
        : `Full Screen <span class="btn-icon" aria-hidden="true">⛶</span>`;
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  }

  // 2. Open Current Preview URL in a New Tab
  if (openTabButton) {
    openTabButton.addEventListener("click", () => {
      const targetUrl = iframe.getAttribute("src") || defaultUrl;
      if (targetUrl) {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      }
    });
  }
}

// Initialize Instance 1 (creation.terrible-360.workers.dev)
initLivePreviewWindow({
  container: previewContainer,
  iframe: livePreviewIframe,
  fullscreenButton: fullscreenBtn,
  openTabButton: openNewTabBtn,
  defaultUrl: "https://creation.terrible-360.workers.dev"
});

// Initialize Instance 2 (ejemplo.terrible-360.workers.dev)
initLivePreviewWindow({
  container: previewContainerEjemplo,
  iframe: livePreviewIframeEjemplo,
  fullscreenButton: fullscreenBtnEjemplo,
  openTabButton: openNewTabBtnEjemplo,
  defaultUrl: "https://ejemplo.terrible-360.workers.dev/"
});

// 3. Connect Template Cards to Load Dynamically inside the Primary Preview Window
templateCards.forEach((card) => {
  card.addEventListener("click", () => {
    const targetUrl = card.dataset.url;
    const templateTitle = card.dataset.title;

    if (targetUrl.includes("ejemplo") && livePreviewIframeEjemplo) {
      livePreviewIframeEjemplo.src = targetUrl;
      if (previewSiteTitleEjemplo) previewSiteTitleEjemplo.textContent = templateTitle;

      const previewSectionEjemplo = document.getElementById("preview-ejemplo");
      if (previewSectionEjemplo) {
        previewSectionEjemplo.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    if (targetUrl && livePreviewIframe) {
      livePreviewIframe.src = targetUrl;
    }

    if (templateTitle && previewSiteTitle) {
      previewSiteTitle.textContent = templateTitle;
    }

    const previewSection = document.getElementById("preview");
    if (previewSection) {
      previewSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

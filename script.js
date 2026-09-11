const commandTrigger = document.getElementById('commandTrigger');
const commandPalette = document.getElementById('commandPalette');
const paletteBackdrop = document.getElementById('paletteBackdrop');
const closePaletteButton = document.getElementById('closePalette');
const paletteSearch = document.getElementById('paletteSearch');
const paletteLinks = [...document.querySelectorAll('.palette-link')];

// Live Preview DOM Elements
const previewContainer = document.getElementById('previewContainer');
const livePreviewIframe = document.getElementById('livePreviewIframe');
const previewSiteTitle = document.getElementById('previewSiteTitle');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const openNewTabBtn = document.getElementById('openNewTabBtn');

const previewContainerEjemplo = document.getElementById('previewContainerEjemplo');
const livePreviewIframeEjemplo = document.getElementById('livePreviewIframeEjemplo');
const fullscreenBtnEjemplo = document.getElementById('fullscreenBtnEjemplo');
const openNewTabBtnEjemplo = document.getElementById('openNewTabBtnEjemplo');

const templateCards = document.querySelectorAll('.template-card[data-url]');

// Google Apps Script Production Web App Endpoint (Resolves Execution & Storage Issues)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxDRqliYnK6oXW9R_VxfhJ1Ju3oG0srbE-NJl75zSFhSNyxPGV0A_EVd33_UdDTv5cdTA/exec';
const surveyForm = document.getElementById('surveyForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

function openPalette() {
  paletteBackdrop.hidden = false;
  commandPalette.setAttribute('aria-hidden', 'false');
  commandTrigger.setAttribute('aria-expanded', 'true');
  commandPalette.classList.add('is-open');
  document.body.classList.add('menu-open');
  window.setTimeout(() => paletteSearch.focus(), 120);
}

function closePalette() {
  commandPalette.classList.remove('is-open');
  commandPalette.setAttribute('aria-hidden', 'true');
  commandTrigger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  window.setTimeout(() => {
    paletteBackdrop.hidden = true;
  }, 220);
  commandTrigger.focus();
}

function navigateToSection(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  paletteLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.target === targetId);
  });

  closePalette();
  window.setTimeout(() => {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 120);
}

commandTrigger?.addEventListener('click', () => {
  const isOpen = commandTrigger.getAttribute('aria-expanded') === 'true';
  if (isOpen) {
    closePalette();
  } else {
    openPalette();
  }
});

closePaletteButton?.addEventListener('click', closePalette);
paletteBackdrop?.addEventListener('click', closePalette);

paletteLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const targetId = link.dataset.target;
    if (targetId === 'portfolio') {
      navigateToSection('portfolio');
      return;
    }
    navigateToSection(targetId);
  });
});

document.addEventListener('keydown', (event) => {
  const commandPressed = event.metaKey || event.ctrlKey;
  if (commandPressed && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    openPalette();
  }

  if (event.key === 'Escape') {
    const isOpen = commandTrigger.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closePalette();
    }
  }
});

paletteSearch?.addEventListener('input', (event) => {
  const searchTerm = event.target.value.toLowerCase().trim();
  paletteLinks.forEach((link) => {
    const searchableText = link.textContent.toLowerCase();
    const matches = searchableText.includes(searchTerm);
    link.hidden = !matches;
  });
});

const sections = document.querySelectorAll('main section[id]');
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const activeId = entry.target.id;
      paletteLinks.forEach((link) => {
        const targetId = link.dataset.target;
        const isActive =
          targetId === activeId ||
          (activeId === 'portfolio-detail' && targetId === 'portfolio');
        link.classList.toggle('active', isActive);
      });
    });
  },
  { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Fullscreen API Helper
function setupFullscreen(btn, container) {
  if (!btn || !container) return;
  btn.addEventListener('click', () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
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
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
    btn.innerHTML = isFullscreen
      ? 'Exit Full Screen <span class="btn-icon" aria-hidden="true">⛶</span>'
      : 'Full Screen <span class="btn-icon" aria-hidden="true">⛶</span>';
  };

  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
}

setupFullscreen(fullscreenBtn, previewContainer);
setupFullscreen(fullscreenBtnEjemplo, previewContainerEjemplo);

// Open in New Tab
function setupOpenTab(btn, iframe) {
  if (!btn || !iframe) return;
  btn.addEventListener('click', () => {
    const targetUrl = iframe.getAttribute('src');
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  });
}

setupOpenTab(openNewTabBtn, livePreviewIframe);
setupOpenTab(openNewTabBtnEjemplo, livePreviewIframeEjemplo);

// Template Cards Dynamic Loading
templateCards.forEach((card) => {
  card.addEventListener('click', () => {
    const targetUrl = card.dataset.url;
    const templateTitle = card.dataset.title;

    if (targetUrl && livePreviewIframe) {
      livePreviewIframe.src = targetUrl;
    }
    if (templateTitle && previewSiteTitle) {
      previewSiteTitle.textContent = templateTitle;
    }

    const previewSection = document.getElementById('preview');
    if (previewSection) {
      previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Survey form → Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxDRqliYnK6oXW9R_VxfhJ1Ju3oG0srbE-NJl75zSFhSNyxPGV0A_EVd33_UdDTv5cdTA/exec';

const surveyForm = document.getElementById('surveyForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

surveyForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!surveyForm.checkValidity()) {
    surveyForm.reportValidity();
    return;
  }

  const formData = new FormData(surveyForm);

  const payload = {
    name: String(formData.get('name') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    source: window.location.href
  };

  const originalButtonText = submitBtn?.textContent || 'Submit Survey';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';
  }

  if (successMessage) {
    successMessage.hidden = true;
    successMessage.classList.remove('error-alert');
  }

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    surveyForm.reset();

    if (successMessage) {
      successMessage.textContent =
        'Thank you! Your response has been submitted.';
      successMessage.hidden = false;
    }
  } catch (error) {
    console.error('Survey submission error:', error);

    if (successMessage) {
      successMessage.classList.add('error-alert');
      successMessage.textContent =
        'We could not submit your response. Please try again.';
      successMessage.hidden = false;
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalButtonText;
    }
  }
});

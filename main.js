/**
 * infrabuildcon2015 - Modern Interactive Script
 * Customized with Official Specifications for PUF & Rockwool Panels
 * Contact: +91 98230 14067 | infrabuildcon2015@gmail.com
 * Factory: Waluj MIDC, Maharashtra 431136
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initProductFilter();
  initPanelCalculator();
  initFaqAccordion();
  initQuoteForm();
  initSmoothScroll();
});

/* ==========================================================================
   1. Header & Mobile Navigation
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking outside or on a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   2. Product Category Filter Tabs
   ========================================================================== */
function initProductFilter() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (!tabButtons.length || !productCards.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active tab style
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory || card.classList.contains(`cat-${filterCategory}`)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   3. Interactive PUF & Rockwool Panel Requirement Calculator
   ========================================================================== */
function initPanelCalculator() {
  const panelTypeSelect = document.getElementById('calcPanelType');
  const appSelect = document.getElementById('calcApplication');
  const lengthInput = document.getElementById('calcLength');
  const widthInput = document.getElementById('calcWidth');
  const heightInput = document.getElementById('calcHeight');
  const unitSelect = document.getElementById('calcUnit');

  const resultThickness = document.getElementById('resThickness');
  const resultArea = document.getElementById('resArea');
  const resultPanels = document.getElementById('resPanels');
  const resultDetails = document.getElementById('resDetails');
  const calcQuoteBtn = document.getElementById('calcQuoteBtn');

  if (!panelTypeSelect || !appSelect || !lengthInput || !resultThickness) return;

  function calculateRequirements() {
    const panelType = panelTypeSelect.value; // 'puf' or 'rockwool'
    const app = appSelect.value;             // 'wall' or 'roof' or 'cold_room'
    let length = parseFloat(lengthInput.value) || 0;
    let width = parseFloat(widthInput.value) || 0;
    let height = parseFloat(heightInput.value) || 0;
    const isFeet = unitSelect.value === 'ft';

    // Convert feet to meters if selected
    if (isFeet) {
      length *= 0.3048;
      width *= 0.3048;
      height *= 0.3048;
    }

    let recThickness = '50 mm';
    let detailNote = '';
    let standardWidthM = 1.2; // default 1200mm for wall

    if (panelType === 'puf') {
      // PUF Panel logic: thicknesses 40, 50, 60, 80, 100 mm. Density 40 kg/m³
      if (app === 'roof') {
        recThickness = '50 mm';
        standardWidthM = 1.0; // 1000mm standard roof width
        detailNote = 'PUF Core | Density: 40 kg/m³ | Width: 1000mm | Melting: >150°C';
      } else if (app === 'cold_room') {
        recThickness = '80 mm / 100 mm';
        standardWidthM = 1.2;
        detailNote = 'PUF Core | Cam-lock / Interlock | Density: 40 kg/m³ | Fire Retardant';
      } else {
        // Wall partition
        recThickness = '50 mm / 60 mm';
        standardWidthM = 1.2; // 1200mm standard wall width
        detailNote = 'PUF Core | Density: 40 kg/m³ | Width: 1200mm | Fire Retardant';
      }
    } else {
      // Rockwool Panel logic: thicknesses 50, 60, 80, 100, 120 mm. Density 90-120 kg/m³
      if (app === 'roof') {
        recThickness = '60 mm / 80 mm';
        standardWidthM = 1.0; // 1000mm standard roof width
        detailNote = 'Rockwool Core | Density: 90-120 kg/m³ | Melting: >1000°C | Sound: 28-30 dB';
      } else {
        recThickness = '50 mm / 80 mm';
        standardWidthM = 1.2; // 1200mm standard wall width
        detailNote = 'Rockwool Core | Melting: >1000°C | Sound: 28-30 dB | Fire Resistant';
      }
    }

    // Surface area estimation:
    let totalSurfaceArea = 0;
    if (app === 'roof') {
      totalSurfaceArea = Math.round(length * width);
    } else if (app === 'cold_room') {
      const perimeter = 2 * (length + width);
      const wallArea = perimeter * height;
      const roofArea = length * width;
      totalSurfaceArea = Math.round(wallArea + roofArea);
    } else {
      // Wall envelope or partition
      const perimeter = 2 * (length + width);
      totalSurfaceArea = Math.round(perimeter * height);
    }

    // Number of panels estimated by standard width coverage
    let approxPanels = 0;
    if (totalSurfaceArea > 0 && standardWidthM > 0) {
      // Assumes standard span average of 3m height/length
      approxPanels = Math.ceil(totalSurfaceArea / (standardWidthM * (height > 0 ? height : 3)));
    }

    // Update UI
    resultThickness.textContent = recThickness;
    resultArea.textContent = totalSurfaceArea > 0 ? `${totalSurfaceArea} m²` : '0 m²';
    resultPanels.textContent = approxPanels > 0 ? `~${approxPanels} Panels` : '--';
    if (resultDetails) {
      resultDetails.textContent = detailNote;
    }

    // Store state for Quote pre-population
    if (calcQuoteBtn) {
      const typeText = panelType === 'rockwool' ? 'Rockwool Panel' : 'PUF Panel';
      const appText = appSelect.options[appSelect.selectedIndex].text;
      calcQuoteBtn.setAttribute('data-type', typeText);
      calcQuoteBtn.setAttribute('data-thickness', recThickness);
      calcQuoteBtn.setAttribute('data-area', totalSurfaceArea > 0 ? `${totalSurfaceArea} m²` : '');
      calcQuoteBtn.setAttribute('data-app', appText);
    }
  }

  // Attach event listeners
  [panelTypeSelect, appSelect, lengthInput, widthInput, heightInput, unitSelect].forEach(element => {
    if (element) {
      element.addEventListener('input', calculateRequirements);
      element.addEventListener('change', calculateRequirements);
    }
  });

  // Handle "Apply to Instant Quote Form" button click
  if (calcQuoteBtn) {
    calcQuoteBtn.addEventListener('click', () => {
      const type = calcQuoteBtn.getAttribute('data-type') || 'PUF Panel';
      const thickness = calcQuoteBtn.getAttribute('data-thickness') || '50 mm';
      const area = calcQuoteBtn.getAttribute('data-area') || '';
      const app = calcQuoteBtn.getAttribute('data-app') || '';

      const formPanelType = document.getElementById('formPanelType');
      const formThickness = document.getElementById('formThickness');
      const formArea = document.getElementById('formArea');
      const formMessage = document.getElementById('formMessage');

      if (formPanelType) {
        formPanelType.value = type.includes('Rockwool') ? 'Rockwool Panel' : 'PUF Panel';
      }
      if (formThickness) {
        // Pick first number
        const m = thickness.match(/\d+/);
        if (m) {
          formThickness.value = `${m[0]}mm`;
        }
      }
      if (formArea && area) formArea.value = area;
      if (formMessage) {
        formMessage.value = `Inquiry for Infra Buildcon ${type} for ${app} with estimated thickness ${thickness} and area ${area}. Please send formal technical offer.`;
      }

      // Smooth scroll to form
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        showToast(`Applied ${type} (${thickness}) to Quote Form!`);
      }
    });
  }

  // Initial calculation run
  calculateRequirements();
}

/* ==========================================================================
   4. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      } else {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* ==========================================================================
   5. Quote & Inquiry Form Validation with Direct WhatsApp / Email Action
   ========================================================================== */
function initQuoteForm() {
  const form = document.getElementById('quoteForm');
  const feedback = document.getElementById('formFeedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const panelType = form.querySelector('[name="panel_type"]').value;
    const thickness = form.querySelector('[name="thickness"]').value;
    const fascia = form.querySelector('[name="fascia"]').value;
    const area = form.querySelector('[name="area"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !phone) {
      showFormFeedback('Please provide your name and contact phone number.', 'error');
      return;
    }

    if (phone.replace(/[^0-9]/g, '').length < 10) {
      showFormFeedback('Please provide a valid 10-digit phone number.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Processing Inquiry...</span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      showFormFeedback('Thank you for reaching out! infrabuildcon2015 team (Plot 22, Waluj MIDC) has logged your request and will contact you via phone or email within 2 business hours.', 'success');
      showToast('Inquiry Received by infrabuildcon2015!');

      // Offer direct WhatsApp dispatch
      const waText = encodeURIComponent(
        `Hello infrabuildcon2015! My name is ${name}. I am interested in ${panelType} (${thickness}, Fascia: ${fascia})${area ? ', Quantity: ' + area : ''}. Message: ${message}`
      );
      const waUrl = `https://wa.me/919823014067?text=${waText}`;

      // Open WhatsApp after a brief delay if user confirms
      const waAction = document.getElementById('waActionBanner');
      if (waAction) {
        waAction.style.display = 'block';
        waAction.querySelector('a').href = waUrl;
      }

      form.reset();
    }, 800);
  });

  function showFormFeedback(msg, type) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className = `form-feedback ${type}`;
    feedback.style.display = 'block';
  }
}

/* ==========================================================================
   6. Quick Quote Buttons on Product Cards
   ========================================================================== */
window.selectProductSpec = function(productName, defaultThickness, panelType, defaultFascia) {
  const formMessage = document.getElementById('formMessage');
  const formThickness = document.getElementById('formThickness');
  const formPanelType = document.getElementById('formPanelType');
  const formFascia = document.getElementById('formFascia');
  const contactSection = document.getElementById('contact');

  if (formPanelType && panelType) {
    formPanelType.value = panelType;
  }
  if (formThickness && defaultThickness) {
    formThickness.value = defaultThickness;
  }
  if (formFascia && defaultFascia) {
    formFascia.value = defaultFascia;
  }
  if (formMessage) {
    formMessage.value = `I am interested in Infra Buildcon's ${productName} (${defaultThickness}, Fascia: ${defaultFascia || 'PPGL'}). Please share the datasheet and commercial price quote for Waluj factory dispatch.`;
  }

  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
    showToast(`Selected "${productName}" for your inquiry.`);
  }
};

/* ==========================================================================
   7. Toast Notification Utility
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #22c55e;"><path d="M20 6L9 17l-5-5"/></svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ==========================================================================
   8. Smooth Anchor Scrolling
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

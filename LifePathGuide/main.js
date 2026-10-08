/* ==========================================================================
   LIFE PATH GUIDE - Interactive Scripting Engine
   Domain: lifepathguide.info | Practicioner: Simon Corcoran
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initLifePathCalculator();
  initModalHandlers();
});

/* --------------------------------------------------------------------------
   1. Interactive Life Path Calculator
   -------------------------------------------------------------------------- */
const lifePathDatabase = {
  1: {
    title: "The Innovator & Leader",
    trait: "Independence, Pioneering Drive & Originality",
    desc: "As a Life Path 1, your journey is defined by self-reliance, leadership, and breaking new ground. You are engineered to forge your own path rather than follow the crowd, overcoming self-doubt to step into full personal sovereignty."
  },
  2: {
    title: "The Mediator & Harmonizer",
    trait: "Intuition, Diplomacy & Deep Sensitivity",
    desc: "Life Path 2 souls bring balance, empathy, and intuitive connection to a noisy world. You possess a rare capacity to sense hidden emotional currents and foster trust, learning to set strong personal boundaries along the way."
  },
  3: {
    title: "The Creative Communicator",
    trait: "Self-Expression, Optimism & Artistic Flair",
    desc: "Driven by joy, communication, and creative vision, Life Path 3 inspires others through words, ideas, and authentic expression. Your lesson is focusing your vibrant energy to turn creative sparks into lasting reality."
  },
  4: {
    title: "The Master Architect",
    trait: "Structure, Discipline & Practical Foundation",
    desc: "Life Path 4 is built upon stability, dedication, and systematic growth. You possess an impressive talent for turning complex ideas into solid, workable structures through patience, integrity, and focus."
  },
  5: {
    title: "The Freedom Seeker",
    trait: "Adaptability, Exploration & Dynamic Change",
    desc: "Embracing adventure and versatile transformation, Life Path 5 thrives on experience and personal freedom. You inspire others to break free from rigid constraints and navigate life's unexpected turns with grace."
  },
  6: {
    title: "The Compassionate Guardian",
    trait: "Nurturing, Harmony & Responsible Leadership",
    desc: "Centered on service, home, and community, Life Path 6 holds a strong protective heart. You excel at healing fractured environments and bringing beauty and balance to those around you."
  },
  7: {
    title: "The Intuitive Seeker & Analyst",
    trait: "Wisdom, Esoteric Depth & Truth Seeking",
    desc: "Life Path 7 bridges analytical intellect with deep mystical intuition. You are drawn to uncover life's deeper spiritual mechanics, discovering profound truth through introspection and contemplation."
  },
  8: {
    title: "The Power & Mastery Strategist",
    trait: "Abundance, Authority & Executive Execution",
    desc: "Carrying the energy of material and spiritual balance, Life Path 8 is born to master ambition, organization, and influence. You learn to align your power with higher purpose to generate lasting abundance."
  },
  9: {
    title: "The Humanitarian & Sage",
    trait: "Universal Love, Completion & Higher Wisdom",
    desc: "Life Path 9 embodies compassionate wisdom, culmination, and non-attachment. You hold a global vision to uplift humanity, releasing past cycles to pave the way for real transformation."
  },
  11: {
    title: "The Intuitive Illuminator (Master Number)",
    trait: "High Spiritual Intuition, Vision & Inspiration",
    desc: "As Master Number 11, you possess heightened intuitive sensitivity and electric visionary capacity. You act as a psychic catalyst and beacon of light, translating spiritual insight into practical real-world inspiration."
  },
  22: {
    title: "The Master Builder (Master Number)",
    trait: "Manifestation, Grand Vision & Practical Genius",
    desc: "Master Number 22 blends the spiritual vision of the 11 with the grounded structure of the 4. You possess the formidable ability to bring large-scale, transformative projects into physical form."
  },
  33: {
    title: "The Master Teacher (Master Number)",
    trait: "Universal Healing, Devotion & Unerring Compassion",
    desc: "Master Number 33 is the rare frequency of selfless service and emotional mastery. Your path calls you to uplift humanity through deep spiritual guidance, empathy, and practical healing work."
  }
};

function reduceNumber(num, preserveMaster = true) {
  if (preserveMaster && (num === 11 || num === 22 || num === 33)) return num;
  let sum = 0;
  while (num > 0 || sum > 9) {
    if (num === 0) {
      if (preserveMaster && (sum === 11 || sum === 22 || sum === 33)) return sum;
      num = sum;
      sum = 0;
    }
    sum += num % 10;
    num = Math.floor(num / 10);
  }
  return sum;
}

function initLifePathCalculator() {
  const calcBtn = document.getElementById('calcBtn');
  if (!calcBtn) return;

  calcBtn.addEventListener('click', () => {
    const dayVal = parseInt(document.getElementById('calcDay')?.value);
    const monthVal = parseInt(document.getElementById('calcMonth')?.value);
    const yearVal = parseInt(document.getElementById('calcYear')?.value);

    if (!dayVal || !monthVal || !yearVal) {
      alert("Please enter a complete day, month, and year of birth.");
      return;
    }

    // Standard Pythagorean Reduction
    const rDay = reduceNumber(dayVal, true);
    const rMonth = reduceNumber(monthVal, true);
    
    // Reduce year digits
    let yearSum = yearVal.toString().split('').reduce((acc, d) => acc + parseInt(d), 0);
    const rYear = reduceNumber(yearSum, true);

    let totalSum = rDay + rMonth + rYear;
    let finalLifePath = reduceNumber(totalSum, true);

    const info = lifePathDatabase[finalLifePath] || lifePathDatabase[reduceNumber(finalLifePath, false)];

    const displayBox = document.getElementById('calcResultDisplay');
    const badgeEl = document.getElementById('resNumberBadge');
    const titleEl = document.getElementById('resTitle');
    const traitEl = document.getElementById('resTrait');
    const descEl = document.getElementById('resDesc');

    if (displayBox && badgeEl && titleEl && traitEl && descEl) {
      badgeEl.textContent = finalLifePath;
      titleEl.textContent = `Life Path ${finalLifePath}: ${info.title}`;
      traitEl.textContent = info.trait;
      descEl.textContent = info.desc;

      displayBox.style.display = 'block';
      displayBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

/* --------------------------------------------------------------------------
   2. Modal Dialog Management & Booking Handlers
   -------------------------------------------------------------------------- */
function initModalHandlers() {
  // Booking Modal
  const bookingModal = document.getElementById('bookingModal');
  const closeBookingBtn = document.getElementById('closeBookingModal');
  const bookingForm = document.getElementById('bookingForm');

  // Trigger buttons with data-service attributes
  document.querySelectorAll('[data-open-booking]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service') || 'General Session';
      const serviceSelect = document.getElementById('bookingServiceSelect');
      if (serviceSelect) {
        serviceSelect.value = serviceName;
      }
      if (bookingModal) {
        bookingModal.classList.add('active');
      }
    });
  });

  if (closeBookingBtn && bookingModal) {
    closeBookingBtn.addEventListener('click', () => {
      bookingModal.classList.remove('active');
    });

    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        bookingModal.classList.remove('active');
      }
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('bookName')?.value;
      const email = document.getElementById('bookEmail')?.value;
      const service = document.getElementById('bookingServiceSelect')?.value;

      alert(`Thank you, ${name}! Your inquiry for "${service}" has been received. Simon will contact you at ${email} within 24 hours to confirm your Zoom call.`);
      bookingModal.classList.remove('active');
      bookingForm.reset();
    });
  }

  // Free Guide Download Modal
  const guideModal = document.getElementById('guideModal');
  const closeGuideBtn = document.getElementById('closeGuideModal');
  const guideForm = document.getElementById('guideForm');

  document.querySelectorAll('[data-open-guide]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const guideName = btn.getAttribute('data-guide') || 'Life Path Quickstart Guide';
      const guideTitleEl = document.getElementById('modalGuideTitle');
      if (guideTitleEl) {
        guideTitleEl.textContent = `Download: ${guideName}`;
      }
      if (guideModal) {
        guideModal.classList.add('active');
      }
    });
  });

  if (closeGuideBtn && guideModal) {
    closeGuideBtn.addEventListener('click', () => {
      guideModal.classList.remove('active');
    });

    guideModal.addEventListener('click', (e) => {
      if (e.target === guideModal) {
        guideModal.classList.remove('active');
      }
    });
  }

  if (guideForm) {
    guideForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('guideName')?.value;
      const email = document.getElementById('guideEmail')?.value;

      alert(`Success! The free PDF guide has been sent to ${email}. Check your inbox shortly, ${name}!`);
      guideModal.classList.remove('active');
      guideForm.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '80px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = '#0B0F19';
        navLinks.style.padding = '1.5rem';
        navLinks.style.borderBottom = '1px solid rgba(212, 175, 55, 0.2)';
      }
    });
  }
}

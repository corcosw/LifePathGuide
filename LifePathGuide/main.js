/* ==========================================================================
   LIFE PATH GUIDE - Interactive Scripting Engine
   Domain: lifepathguide.info | Practitioner: Simon Corcoran
   Updated per Richard Knight Website Review Recommendations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initLifePathCalculator();
  initModalHandlers();
  initContactAndReportForms();
});

/* --------------------------------------------------------------------------
   1. Interactive Life Path Calculator with Robust Date Validation
   -------------------------------------------------------------------------- */
const lifePathDatabase = {
  1: {
    title: "The Independent Pioneer",
    trait: "Independence, Initiative & Originality",
    desc: "As a Life Path 1, your path is defined by self-reliance, leadership, and exploring fresh territory. You are driven to cultivate self-trust, take the initiative when others hesitate, and build confidence in your individual vision."
  },
  2: {
    title: "The Intuitive Peacemaker",
    trait: "Diplomacy, Sensitivity & Relational Balance",
    desc: "Life Path 2 focuses on collaboration, emotional perception, and fostering harmony. You bring a natural ability to sense unspoken feelings and bridge differences, while learning to maintain clear personal boundaries."
  },
  3: {
    title: "The Creative Communicator",
    trait: "Self-Expression, Optimism & Meaningful Connection",
    desc: "Guided by expression and creativity, Life Path 3 thrives through words, art, and inspiring others. Your developmental lesson is focusing your diverse talents into sustained, grounded projects."
  },
  4: {
    title: "The Master Architect",
    trait: "Structure, Dedication & Practical Foundations",
    desc: "Life Path 4 is anchored in stability, method, and long-term security. You possess a talent for taking complex, sprawling ideas and building reliable, step-by-step frameworks that endure."
  },
  5: {
    title: "The Versatile Explorer",
    trait: "Adaptability, Freedom & Navigating Change",
    desc: "Thriving on varied experience, Life Path 5 learns through exploration, resilience, and curiosity. You inspire others to welcome life's inevitable transitions with flexibility rather than fear."
  },
  6: {
    title: "The Compassionate Guardian",
    trait: "Nurturing, Integrity & Responsible Service",
    desc: "Centered on family, community, and support, Life Path 6 holds a protective, caring heart. You excel at bringing balance and care to those around you, learning along the way not to overburden yourself."
  },
  7: {
    title: "The Intuitive Seeker & Analyst",
    trait: "Discernment, Contemplation & Truth Seeking",
    desc: "Life Path 7 bridges analytical depth with introspective intuition. You are drawn to study life's deeper questions, finding purpose through quiet reflection, research, and authentic self-knowledge."
  },
  8: {
    title: "The Practical Strategist",
    trait: "Organization, Responsibility & Tangible Achievement",
    desc: "Balancing material resourcefulness with personal integrity, Life Path 8 is geared toward enterprise and constructive influence. You learn to direct your drive toward work that creates lasting, ethical value."
  },
  9: {
    title: "The Sage & Humanitarian",
    trait: "Compassion, Broad Perspective & Completion",
    desc: "Life Path 9 embodies closure, universal empathy, and philosophical wisdom. You hold a broad view of human potential, learning when to release outdated situations to welcome fresh beginnings."
  },
  11: {
    title: "The Intuitive Illuminator (Master Number)",
    trait: "Heightened Perception, Insight & Inspiration",
    desc: "Master Number 11 carries acute sensitivity and quick intuitive perception. You are called to channel your insights into grounded, uplifting guidance for others without absorbing external stress."
  },
  22: {
    title: "The Master Builder (Master Number)",
    trait: "Visionary Pragmatism & Large-Scale Construction",
    desc: "Master Number 22 combines high visionary ideals with the disciplined execution of the 4. You have the ability to manifest meaningful, beneficial projects that serve a wider community."
  },
  33: {
    title: "The Master Teacher (Master Number)",
    trait: "Selfless Service, Empathy & Guiding Others",
    desc: "Master Number 33 represents dedicated guidance and heart-centered counsel. Your work emphasizes uplifting others through patience, compassionate understanding, and quiet example."
  }
};

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getDaysInMonth(month, year) {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  if ([4, 6, 9, 11].includes(month)) {
    return 30;
  }
  return 31;
}

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
    const daySelect = document.getElementById('calcDay');
    const monthSelect = document.getElementById('calcMonth');
    const yearInput = document.getElementById('calcYear');
    const validationMsg = document.getElementById('calcValidationMsg');

    const dayVal = parseInt(daySelect?.value, 10);
    const monthVal = parseInt(monthSelect?.value, 10);
    const yearVal = parseInt(yearInput?.value, 10);

    const showValidation = (msg) => {
      if (validationMsg) {
        validationMsg.textContent = msg;
        validationMsg.style.display = 'block';
      }
    };

    const clearValidation = () => {
      if (validationMsg) {
        validationMsg.textContent = '';
        validationMsg.style.display = 'none';
      }
    };

    if (!dayVal || !monthVal || !yearVal) {
      showValidation("Please enter a complete day, month, and year of birth.");
      return;
    }

    if (isNaN(yearVal) || yearVal < 1920 || yearVal > 2026) {
      showValidation("Please enter a valid birth year between 1920 and 2026.");
      return;
    }

    const maxDays = getDaysInMonth(monthVal, yearVal);
    if (dayVal > maxDays) {
      const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      showValidation(`${monthNames[monthVal]} ${yearVal} has ${maxDays} days. Please select a valid day.`);
      return;
    }

    clearValidation();

    // Standard Pythagorean Reduction
    const rDay = reduceNumber(dayVal, true);
    const rMonth = reduceNumber(monthVal, true);
    
    // Reduce year digits
    const yearDigitsSum = yearVal.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
    const rYear = reduceNumber(yearDigitsSum, true);

    const totalSum = rDay + rMonth + rYear;
    const finalLifePath = reduceNumber(totalSum, true);

    const info = lifePathDatabase[finalLifePath] || lifePathDatabase[reduceNumber(finalLifePath, false)] || {
      title: "Individual Journey",
      trait: "Unique numerical path",
      desc: "Your birth date reveals a distinctive combination of cycles."
    };

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
   2. Modal Dialog Management & Robust Form Handlers
   -------------------------------------------------------------------------- */
function initModalHandlers() {
  const bookingModal = document.getElementById('bookingModal');
  const closeBookingBtn = document.getElementById('closeBookingModal');
  const bookingForm = document.getElementById('bookingForm');
  const bookingFormWrapper = document.getElementById('bookingFormWrapper');
  const bookingSuccessDisplay = document.getElementById('bookingSuccessDisplay');
  const closeConfirmBtn = document.getElementById('closeConfirmBtn');

  // Trigger buttons with data-service attributes
  document.querySelectorAll('[data-open-booking]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service') || 'Numerology & Tarot Consultation (60 Mins)';
      const serviceSelect = document.getElementById('bookingServiceSelect');
      if (serviceSelect) {
        serviceSelect.value = serviceName;
      }

      // Reset modal view to form
      if (bookingFormWrapper) bookingFormWrapper.style.display = 'block';
      if (bookingSuccessDisplay) bookingSuccessDisplay.style.display = 'none';

      if (bookingModal) {
        bookingModal.classList.add('active');
      }
    });
  });

  const closeBooking = () => {
    if (bookingModal) bookingModal.classList.remove('active');
  };

  if (closeBookingBtn) closeBookingBtn.addEventListener('click', closeBooking);
  if (closeConfirmBtn) closeConfirmBtn.addEventListener('click', closeBooking);

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeBooking();
    });
  }

  // Booking Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('bookName')?.value.trim() || 'Client';
      const email = document.getElementById('bookEmail')?.value.trim() || '';
      const service = document.getElementById('bookingServiceSelect')?.value || 'Consultation';
      const datePref = document.getElementById('bookDate')?.value.trim() || 'Flexible / As soon as possible';
      const notes = document.getElementById('bookNotes')?.value.trim() || 'None provided';

      // Persist enquiry locally
      const enquiry = {
        id: 'ENQ-' + Date.now(),
        dateSubmitted: new Date().toISOString(),
        name,
        email,
        service,
        datePref,
        notes
      };

      try {
        const stored = JSON.parse(localStorage.getItem('lpg_enquiries') || '[]');
        stored.push(enquiry);
        localStorage.setItem('lpg_enquiries', JSON.stringify(stored));
      } catch (err) {
        console.warn('Local storage not available:', err);
      }

      // Configure direct email mailto fallback link
      const emailSubject = encodeURIComponent(`Consultation Enquiry: ${service} - ${name}`);
      const emailBody = encodeURIComponent(
        `Hello Simon,\n\nI would like to enquire about a session:\n` +
        `• Name: ${name}\n` +
        `• Email: ${email}\n` +
        `• Service: ${service}\n` +
        `• Preferred Day/Time: ${datePref}\n` +
        `• Specific Questions/Focus: ${notes}\n\n` +
        `Thank you,\n${name}`
      );
      const fallbackLink = document.getElementById('emailClientFallbackLink');
      if (fallbackLink) {
        fallbackLink.href = `mailto:simon@lifepathguide.info?subject=${emailSubject}&body=${emailBody}`;
      }

      // Update in-modal confirmation screen
      const confirmName = document.getElementById('confirmName');
      const confirmEmail = document.getElementById('confirmEmail');
      const confirmService = document.getElementById('confirmService');
      const confirmTime = document.getElementById('confirmTime');

      if (confirmName) confirmName.textContent = name;
      if (confirmEmail) confirmEmail.textContent = email;
      if (confirmService) confirmService.textContent = service;
      if (confirmTime) confirmTime.textContent = datePref;

      // Switch to rich confirmation state
      if (bookingFormWrapper) bookingFormWrapper.style.display = 'none';
      if (bookingSuccessDisplay) bookingSuccessDisplay.style.display = 'block';

      bookingForm.reset();
    });
  }

  // Free Guide Download Modal
  const guideModal = document.getElementById('guideModal');
  const closeGuideBtn = document.getElementById('closeGuideModal');
  const guideForm = document.getElementById('guideForm');
  const guideFormWrapper = document.getElementById('guideFormWrapper');
  const guideSuccessDisplay = document.getElementById('guideSuccessDisplay');
  const closeGuideConfirmBtn = document.getElementById('closeGuideConfirmBtn');

  document.querySelectorAll('[data-open-guide]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const guideName = btn.getAttribute('data-guide') || 'The Life Path Quickstart Guide';
      const guideTitleEl = document.getElementById('modalGuideTitle');
      if (guideTitleEl) {
        guideTitleEl.textContent = `Get Access: ${guideName}`;
      }

      if (guideFormWrapper) guideFormWrapper.style.display = 'block';
      if (guideSuccessDisplay) guideSuccessDisplay.style.display = 'none';

      if (guideModal) {
        guideModal.classList.add('active');
      }
    });
  });

  const closeGuide = () => {
    if (guideModal) guideModal.classList.remove('active');
  };

  if (closeGuideBtn) closeGuideBtn.addEventListener('click', closeGuide);
  if (closeGuideConfirmBtn) closeGuideConfirmBtn.addEventListener('click', closeGuide);

  if (guideModal) {
    guideModal.addEventListener('click', (e) => {
      if (e.target === guideModal) closeGuide();
    });
  }

  if (guideForm) {
    guideForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('guideName')?.value.trim() || 'Reader';
      const email = document.getElementById('guideEmail')?.value.trim() || '';

      // Persist guide request
      try {
        const guides = JSON.parse(localStorage.getItem('lpg_guide_requests') || '[]');
        guides.push({ name, email, date: new Date().toISOString() });
        localStorage.setItem('lpg_guide_requests', JSON.stringify(guides));
      } catch (err) {
        console.warn('Storage unavailable:', err);
      }

      const guideConfirmName = document.getElementById('guideConfirmName');
      if (guideConfirmName) guideConfirmName.textContent = name;

      if (guideFormWrapper) guideFormWrapper.style.display = 'none';
      if (guideSuccessDisplay) guideSuccessDisplay.style.display = 'block';

      guideForm.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   3. In-Page Contact & Report Forms
   -------------------------------------------------------------------------- */
function initContactAndReportForms() {
  // Contact page form
  const contactForm = document.getElementById('contactPageForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cName')?.value.trim() || 'Visitor';
      const email = document.getElementById('cEmail')?.value.trim() || '';
      const service = document.getElementById('cService')?.value || 'General';
      const msg = document.getElementById('cMessage')?.value.trim() || '';

      const emailSubject = encodeURIComponent(`Message from ${name} via LifePathGuide.info`);
      const emailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\n\nMessage:\n${msg}`);

      contactForm.innerHTML = `
        <div class="modal-confirmation-state" style="padding: 2rem 1rem;">
          <div class="confirmation-check-icon">✓</div>
          <h3 style="color: var(--text-main); font-size: 1.4rem; margin-bottom: 0.5rem;">Message Recorded</h3>
          <p class="confirmation-next-steps">
            Thank you, <strong>${name}</strong>! Your message has been recorded. Simon responds to all genuine enquiries within 24 hours at <strong>${email}</strong>.
          </p>
          <div style="margin-top: 1.5rem;">
            <a href="mailto:simon@lifepathguide.info?subject=${emailSubject}&body=${emailBody}" class="btn-secondary" style="font-size: 0.85rem;">
              Send via Email App (Optional Fallback)
            </a>
          </div>
        </div>
      `;
    });
  }

  // Written report order form
  const reportForm = document.getElementById('reportOrderForm');
  if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('repName')?.value.trim() || 'Client';
      const email = document.getElementById('repEmail')?.value.trim() || '';
      const dob = document.getElementById('repDOB')?.value.trim() || '';
      const repType = document.getElementById('repType')?.value || 'Report';
      const focus = document.getElementById('repFocus')?.value.trim() || 'None';

      const emailSubject = encodeURIComponent(`Written Report Request: ${repType} - ${name}`);
      const emailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nDate of Birth: ${dob}\nReport: ${repType}\nFocus: ${focus}`);

      reportForm.innerHTML = `
        <div class="modal-confirmation-state" style="padding: 2.5rem 1rem;">
          <div class="confirmation-check-icon">✓</div>
          <h3 style="color: var(--text-main); font-size: 1.4rem; margin-bottom: 0.5rem;">Report Order Request Received</h3>
          <p class="confirmation-next-steps">
            Thank you, <strong>${name}</strong>! Simon will review your date of birth (${dob}) and email invoice and confirmation to <strong>${email}</strong>. Your personalised report will be prepared and delivered within 24 to 48 hours.
          </p>
          <div style="margin-top: 1.5rem;">
            <a href="mailto:simon@lifepathguide.info?subject=${emailSubject}&body=${emailBody}" class="btn-secondary" style="font-size: 0.85rem;">
              Confirm Details via Email App
            </a>
          </div>
        </div>
      `;
    });
  }
}

/* --------------------------------------------------------------------------
   4. Mobile Navigation Toggle
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
        navLinks.style.top = '72px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = '#0B0F19';
        navLinks.style.padding = '1.5rem';
        navLinks.style.borderBottom = '1px solid rgba(212, 175, 55, 0.2)';
        navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.8)';
        navLinks.style.zIndex = '1000';
      }
    });
  }
}

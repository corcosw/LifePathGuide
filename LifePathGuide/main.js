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

  // Free Guide & Free Numerology Report Modal
  const WIX_SHOP_URL = 'https://www.thecelestialnavigator.com/category/all-products';
  const guideModal = document.getElementById('guideModal');
  const closeGuideBtn = document.getElementById('closeGuideModal');
  const guideForm = document.getElementById('guideForm');
  const guideFormWrapper = document.getElementById('guideFormWrapper');
  const guideSuccessDisplay = document.getElementById('guideSuccessDisplay');
  const closeGuideConfirmBtn = document.getElementById('closeGuideConfirmBtn');
  let activeGuideName = 'The Digital Detox Action Sheet';

  const pythagoreanMap = {
    A: 1, J: 1, S: 1,
    B: 2, K: 2, T: 2,
    C: 3, L: 3, U: 3,
    D: 4, M: 4, V: 4,
    E: 5, N: 5, W: 5,
    F: 6, O: 6, X: 6,
    G: 7, P: 7, Y: 7,
    H: 8, Q: 8, Z: 8,
    I: 9, R: 9
  };

  const numberArchetypes = {
    1: {
      title: 'The Independent Pioneer',
      expression: 'You naturally express original ideas, self-starting initiative, and decisive leadership when working on projects you own.',
      soulUrge: 'At heart, you crave autonomy, personal mastery, and the freedom to forge your own direction without unnecessary interference.',
      personality: 'Others first notice your self-assurance, directness, and readiness to take the lead when a group hesitates.',
      birthday: 'Your birth day brings inventive focus and quiet determination to solve problems independently.',
      personalYear: 'A year of fresh starts, planting new seeds, and stepping boldly into an independent next chapter.'
    },
    2: {
      title: 'The Intuitive Peacemaker',
      expression: 'Your talents shine through diplomacy, attentive listening, mediation, and building thoughtful partnerships.',
      soulUrge: 'Deep down, you seek emotional harmony, genuine mutual respect, and supportive one-to-one connections.',
      personality: 'People experience you as approachable, tactful, calm, and perceptive to unspoken room dynamics.',
      birthday: 'Your birth day highlights sensitivity, cooperation, and an eye for subtle detail and balance.',
      personalYear: 'A year of patience, meaningful collaborations, and letting foundations develop quietly behind the scenes.'
    },
    3: {
      title: 'The Creative Communicator',
      expression: 'You are gifted in self-expression—whether speaking, writing, teaching, or bringing warmth and imagination to everyday work.',
      soulUrge: 'Your inner driver is joyful creativity, authentic expression, and sharing uplifting ideas with others.',
      personality: 'You come across as expressive, articulate, warm, and naturally uplifting in social or collaborative settings.',
      birthday: 'Your birth day gives you a lively spark of wit, communication flair, and creative versatility.',
      personalYear: 'A year of creative momentum, open communication, social connection, and giving voice to your ideas.'
    },
    4: {
      title: 'The Master Architect',
      expression: 'You excel at turning abstract concepts into structured systems, reliable routines, and durable results.',
      soulUrge: 'Inside, you value stability, clarity, honesty, and knowing that your effort builds something trustworthy and lasting.',
      personality: 'Others see you as dependable, grounded, practical, and someone who keeps their word under pressure.',
      birthday: 'Your birth day reinforces methodical focus, practical craftsmanship, and steady endurance.',
      personalYear: 'A year for organising your habits, strengthening practical foundations, and steady step-by-step progress.'
    },
    5: {
      title: 'The Versatile Explorer',
      expression: 'Your strengths flourish in dynamic environments—adapting quickly, connecting ideas, and guiding others through change.',
      soulUrge: 'Your deepest desire is room to grow, curiosity, fresh experiences, and freedom from stale routines.',
      personality: 'People perceive you as energetic, adaptable, open-minded, and comfortable exploring unfamiliar ground.',
      birthday: 'Your birth day adds quick mental agility, curiosity, and resilience during life transitions.',
      personalYear: 'A pivotal year of movement, fresh perspective, breaking out of ruts, and welcoming constructive change.'
    },
    6: {
      title: 'The Compassionate Guardian',
      expression: 'You naturally bring care, counsel, aesthetic balance, and steady responsibility to your family, community, or clients.',
      soulUrge: 'At your core, you want to feel useful, nurture those you care about, and create a peaceful, supportive environment.',
      personality: 'Others view you as warm, trustworthy, protective, and someone people instinctively confide in.',
      birthday: 'Your birth day emphasises empathy, stewardship, and a knack for restoring harmony where tension exists.',
      personalYear: 'A year focused on home, relationships, personal responsibility, and caring cleanly for your priorities.'
    },
    7: {
      title: 'The Intuitive Seeker & Analyst',
      expression: 'Your mind naturally probes beneath surface appearances—excelling in research, reflection, strategy, and insightful analysis.',
      soulUrge: 'Quietly, you long for truth, unhurried solitude to think clearly, and spiritual or philosophical understanding.',
      personality: 'You project thoughtful composure, depth, and quiet discernment that invites trust without loud self-promotion.',
      birthday: 'Your birth day lends keen observation, intuitive pattern-recognition, and an appreciation for privacy.',
      personalYear: 'A year of inner reflection, deepening your skills, slowing down the noise, and trusting your discernment.'
    },
    8: {
      title: 'The Practical Strategist',
      expression: 'You have strong executive capability—able to organise resources, manage larger visions, and translate goals into tangible outcomes.',
      soulUrge: 'Beneath the surface, you want competence, financial and personal sovereignty, and measurable impact from your efforts.',
      personality: 'People recognise quiet authority, resilience, and purposeful ambition in the way you carry yourself.',
      birthday: 'Your birth day brings sound judgement, organisational stamina, and calm composure around big decisions.',
      personalYear: 'A year of tangible results, stepping into personal authority, and making grounded practical decisions.'
    },
    9: {
      title: 'The Sage & Humanitarian',
      expression: 'You express broad-minded wisdom, empathy across backgrounds, and a gift for helping people see the bigger picture.',
      soulUrge: 'Your heart seeks meaning that serves beyond yourself—compassion, closure, and contributing something genuinely worthwhile.',
      personality: 'Others sense generosity, maturity, worldly perspective, and a welcoming openness in your presence.',
      birthday: 'Your birth day imparts idealism, emotional breadth, and an ability to release what has run its course.',
      personalYear: 'A year of completion, clearing out outdated commitments or clutter, and preparing cleanly for a new cycle.'
    },
    11: {
      title: 'The Intuitive Illuminator (Master 11)',
      expression: 'You carry heightened intuitive perception and can inspire others when translating subtle insights into practical words.',
      soulUrge: 'Your inner self craves authentic purpose, inspiration, and channels where your sensitivity becomes a source of clarity.',
      personality: 'Others often sense an unusual perceptiveness, calm intensity, or uplifting presence about you.',
      birthday: 'Birth day Master 11 sharpens your intuition and reminds you to stay grounded in steady daily routines.',
      personalYear: 'A heightened year of insight—pairing quiet self-care with trusting your sharpest intuitive nudges.'
    },
    22: {
      title: 'The Master Builder (Master 22)',
      expression: 'You unite big-picture vision with disciplined execution, capable of building enduring systems that benefit many people.',
      soulUrge: 'At heart, you feel called to turn meaningful ideals into practical, real-world structures that stand the test of time.',
      personality: 'Others recognise grounded capability paired with unusually broad foresight and quiet steadiness.',
      birthday: 'Birth day Master 22 supports ambitious yet structured problem-solving.',
      personalYear: 'A year to anchor your biggest long-term ideas into realistic, steady action steps.'
    },
    33: {
      title: 'The Master Teacher (Master 33)',
      expression: 'Your talents centre on compassionate guidance, uplifting communication, and holding steady space for others to grow.',
      soulUrge: 'Deep down, you are fulfilled by genuine service, healing encouragement, and leading through patient example.',
      personality: 'People experience warmth, deep empathy, and reassuring steadiness in your company.',
      birthday: 'Birth day Master 33 highlights heartfelt empathy and balanced wisdom.',
      personalYear: 'A year centred on compassionate service—remembering to keep healthy boundaries for your own energy.'
    }
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function isVowelInWord(word, idx) {
    const ch = word[idx];
    if ('AEIOU'.includes(ch)) return true;
    if (ch !== 'Y') return false;
    const prevIsVowel = idx > 0 && 'AEIOU'.includes(word[idx - 1]);
    const nextIsVowel = idx < word.length - 1 && 'AEIOU'.includes(word[idx + 1]);
    return !prevIsVowel && !nextIsVowel;
  }

  function computeFullNumerologyReport(fullName, dayVal, monthVal, yearVal) {
    const cleanWords = fullName.toUpperCase().replace(/[^A-Z\s]/g, ' ').trim().split(/\s+/).filter(Boolean);

    let expressionSum = 0;
    let soulUrgeSum = 0;
    let personalitySum = 0;

    cleanWords.forEach(word => {
      for (let i = 0; i < word.length; i++) {
        const val = pythagoreanMap[word[i]] || 0;
        expressionSum += val;
        if (isVowelInWord(word, i)) {
          soulUrgeSum += val;
        } else {
          personalitySum += val;
        }
      }
    });

    // Fallbacks in case a rare short name lacks vowels or consonants
    if (soulUrgeSum === 0) soulUrgeSum = expressionSum;
    if (personalitySum === 0) personalitySum = expressionSum;

    const rDay = reduceNumber(dayVal, true);
    const rMonth = reduceNumber(monthVal, true);
    const yearDigitsSum = yearVal.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
    const rYear = reduceNumber(yearDigitsSum, true);

    const lifePath = reduceNumber(rDay + rMonth + rYear, true);
    const expression = reduceNumber(expressionSum, true);
    const soulUrge = reduceNumber(soulUrgeSum, true);
    const personality = reduceNumber(personalitySum, true);
    const birthday = reduceNumber(dayVal, true);

    const currentYear = 2026;
    const currentYearSum = currentYear.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
    const personalYear = reduceNumber(reduceNumber(dayVal, false) + reduceNumber(monthVal, false) + reduceNumber(currentYearSum, false), false);

    const getArch = (num) => numberArchetypes[num] || numberArchetypes[reduceNumber(num, false)] || numberArchetypes[1];
    const lpInfo = lifePathDatabase[lifePath] || lifePathDatabase[reduceNumber(lifePath, false)] || lifePathDatabase[1];

    return {
      lifePath: {
        number: lifePath,
        label: 'Life Path Number',
        subtitle: lpInfo.title,
        meaning: `<strong>What it means for you:</strong> ${lpInfo.desc}`
      },
      expression: {
        number: expression,
        label: 'Expression (Destiny) Number',
        subtitle: getArch(expression).title,
        meaning: `<strong>What it means for you:</strong> ${getArch(expression).expression}`
      },
      soulUrge: {
        number: soulUrge,
        label: "Soul Urge (Heart's Desire) Number",
        subtitle: getArch(soulUrge).title,
        meaning: `<strong>What it means for you:</strong> ${getArch(soulUrge).soulUrge}`
      },
      personality: {
        number: personality,
        label: 'Personality Number',
        subtitle: getArch(personality).title,
        meaning: `<strong>What it means for you:</strong> ${getArch(personality).personality}`
      },
      birthday: {
        number: birthday,
        label: `Birthday Number (Born on Day ${dayVal})`,
        subtitle: getArch(birthday).title,
        meaning: `<strong>What it means for you:</strong> ${getArch(birthday).birthday}`
      },
      personalYear: {
        number: personalYear,
        label: `Personal Year Number (${currentYear})`,
        subtitle: getArch(personalYear).title,
        meaning: `<strong>What it means for you:</strong> ${getArch(personalYear).personalYear}`
      }
    };
  }

  const guideContents = {
    'The Life Path Quickstart Guide': [
      {
        title: '1. The Life Path Calculation Method',
        body: 'Reduce each unit of your birth date (Day, Month, Year) separately to a single digit by adding its numbers together. Preserve Master Numbers 11, 22, and 33 without reducing. Then sum all three reduced values together, reducing once more if necessary.'
      },
      {
        title: '2. Core Archetypes Overview',
        body: '<strong>1:</strong> The Independent Pioneer &middot; <strong>2:</strong> The Intuitive Peacemaker &middot; <strong>3:</strong> Creative Communicator &middot; <strong>4:</strong> Master Architect &middot; <strong>5:</strong> Versatile Freedom Seeker &middot; <strong>6:</strong> Compassionate Guardian &middot; <strong>7:</strong> Intuitive Seeker &amp; Analyst &middot; <strong>8:</strong> Practical Strategist &middot; <strong>9:</strong> Sage &amp; Humanitarian.'
      },
      {
        title: '3. Reflection Questions for Your Current Crossroads',
        body: '&bull; Which natural strength from your number has felt most underutilised lately?<br>&bull; What is one recurring situation where you tend to ignore your initial intuition?<br>&bull; What choice would you make if you focused on your long-term cycle rather than immediate pressure?'
      }
    ],
    'The Digital Detox Action Sheet': [
      {
        title: '1. Spotting Automatic Scroll Loops',
        body: 'Notice the three moments you reach for your phone without deciding to (waking up, transitions between tasks, late evening fatigue). Turning off non-human notifications removes 70% of daily friction.'
      },
      {
        title: '2. The 3-Step Evening Disconnect Protocol',
        body: '<strong>60 mins before bed:</strong> Charge your phone outside the bedroom &middot; <strong>30 mins before bed:</strong> Switch screens off and use a physical book or notepad &middot; <strong>Next morning:</strong> Wait 20 minutes before checking messages so you set your own focus first.'
      },
      {
        title: '3. Daytime Attention Reset Prompts',
        body: '&bull; Before unlocking my phone, what specific thing am I opening it to do?<br>&bull; What calm offline activity can replace my default evening scroll window?<br>&bull; How does my mental clarity feel after a single screen-free hour?'
      }
    ]
  };

  let currentDownloadUrl = null;

  document.querySelectorAll('[data-open-guide]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      activeGuideName = btn.getAttribute('data-guide') || 'The Digital Detox Action Sheet';
      const isBundle = activeGuideName === 'The Digital Detox Action Sheet';

      const guideTitleEl = document.getElementById('modalGuideTitle');
      const guideSubtitleEl = document.getElementById('modalGuideSubtitle');
      const guideSubmitBtn = document.getElementById('guideSubmitBtn');
      const dobGroup = document.getElementById('guideDobFields');
      const dobDay = document.getElementById('guideDobDay');
      const dobMonth = document.getElementById('guideDobMonth');
      const dobYear = document.getElementById('guideDobYear');
      const guideValidationMsg = document.getElementById('guideValidationMsg');

      if (guideValidationMsg) {
        guideValidationMsg.textContent = '';
        guideValidationMsg.style.display = 'none';
      }

      if (guideTitleEl) {
        guideTitleEl.textContent = isBundle
          ? 'Free Digital Detox Guide & Personal Numerology Report'
          : `Get Access: ${activeGuideName}`;
      }
      if (guideSubtitleEl) {
        guideSubtitleEl.textContent = isBundle
          ? 'Enter your full name, email, and birth date below to receive the Digital Detox Action Sheet plus a Free Numerology Report detailing all of your numbers.'
          : 'Enter your name and email below for instant access—or include your birth date to preview all of your personal numbers too.';
      }
      if (guideSubmitBtn) {
        guideSubmitBtn.textContent = isBundle
          ? 'Unlock Free Guide & Personal Numerology Report'
          : 'Get Instant Free Access';
      }
      if (dobGroup) {
        dobGroup.style.display = 'block';
      }
      [dobDay, dobMonth, dobYear].forEach(el => {
        if (el) el.required = isBundle;
      });

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
      const name = document.getElementById('guideName')?.value.trim() || '';
      const email = document.getElementById('guideEmail')?.value.trim() || '';
      const dayRaw = document.getElementById('guideDobDay')?.value || '';
      const monthRaw = document.getElementById('guideDobMonth')?.value || '';
      const yearRaw = document.getElementById('guideDobYear')?.value || '';
      const validationMsg = document.getElementById('guideValidationMsg');

      const showGuideError = (msg) => {
        if (validationMsg) {
          validationMsg.textContent = msg;
          validationMsg.style.display = 'block';
        }
      };

      const isBundle = activeGuideName === 'The Digital Detox Action Sheet';
      const hasAnyDob = Boolean(dayRaw || monthRaw || yearRaw);

      if (!/[a-zA-Z]/.test(name)) {
        showGuideError('Please enter your name using alphabetical characters so we can calculate your numbers.');
        return;
      }

      let numerologyReport = null;
      let dobSummary = '';

      if (isBundle || hasAnyDob) {
        const dayVal = parseInt(dayRaw, 10);
        const monthVal = parseInt(monthRaw, 10);
        const yearVal = parseInt(yearRaw, 10);

        if (!dayVal || !monthVal || !yearVal) {
          showGuideError('Please complete your day, month, and year of birth to generate your personal numerology report.');
          return;
        }
        if (isNaN(yearVal) || yearVal < 1920 || yearVal > 2026) {
          showGuideError('Please enter a valid birth year between 1920 and 2026.');
          return;
        }
        const maxDays = getDaysInMonth(monthVal, yearVal);
        if (dayVal > maxDays) {
          const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          showGuideError(`${monthNames[monthVal]} ${yearVal} has ${maxDays} days. Please select a valid day.`);
          return;
        }

        dobSummary = `${String(dayVal).padStart(2, '0')}/${String(monthVal).padStart(2, '0')}/${yearVal}`;
        numerologyReport = computeFullNumerologyReport(name, dayVal, monthVal, yearVal);
      }

      if (validationMsg) {
        validationMsg.textContent = '';
        validationMsg.style.display = 'none';
      }

      // Persist guide & report request locally
      try {
        const guides = JSON.parse(localStorage.getItem('lpg_guide_requests') || '[]');
        guides.push({
          guide: activeGuideName,
          name,
          email,
          dob: dobSummary || null,
          includesFreeNumerologyReport: Boolean(numerologyReport),
          date: new Date().toISOString()
        });
        localStorage.setItem('lpg_guide_requests', JSON.stringify(guides));
      } catch (err) {
        console.warn('Storage unavailable:', err);
      }

      const guideConfirmName = document.getElementById('guideConfirmName');
      if (guideConfirmName) guideConfirmName.textContent = name;

      const readerHeading = document.getElementById('guideReadyHeading');
      if (readerHeading) {
        readerHeading.textContent = isBundle
          ? 'Your Digital Detox Guide & Free Numerology Report Are Ready!'
          : `${activeGuideName} is Ready!`;
      }

      const readerContainer = document.querySelector('#guideSuccessDisplay .quickstart-reader-container');
      const sections = guideContents[activeGuideName] || guideContents['The Digital Detox Action Sheet'];

      let reportHtml = '';
      if (numerologyReport) {
        const orderedKeys = ['lifePath', 'expression', 'soulUrge', 'personality', 'birthday', 'personalYear'];
        const cardsHtml = orderedKeys.map(key => {
          const item = numerologyReport[key];
          return `
            <div class="numerology-number-card">
              <div class="numerology-mini-badge">${item.number}</div>
              <div>
                <div class="numerology-number-meta">${escapeHtml(item.label)}</div>
                <h5>Number ${item.number}: ${escapeHtml(item.subtitle)}</h5>
                <p>${item.meaning}</p>
              </div>
            </div>
          `;
        }).join('');

        reportHtml = `
          <div class="report-bundle-banner">
            <h4>Your Free Personal Numerology Report — ${escapeHtml(name)}</h4>
            <p>Calculated using your full name and birth date (${escapeHtml(dobSummary)}). Below is your complete set of core numbers with a brief guide to what each number means for you.</p>
          </div>
          <div class="numerology-report-grid">
            ${cardsHtml}
          </div>
          <div class="report-bundle-banner" style="margin-top: 0.5rem; margin-bottom: 1.25rem; border-color: rgba(6, 182, 212, 0.35);">
            <h4>Included Bonus: ${escapeHtml(activeGuideName)}</h4>
            <p>Your practical reset framework is included immediately below.</p>
          </div>
        `;
      }

      const sectionsHtml = sections.map(sec => `
        <div class="quickstart-section-box">
          <h4>${sec.title}</h4>
          <p>${sec.body}</p>
        </div>
      `).join('');

      const shopFollowupHtml = `
        <div class="quickstart-section-box" style="border-color: var(--border-glow); text-align: center;">
          <h4>Explore Full Written Reports &amp; 1:1 Sessions</h4>
          <p style="margin-bottom: 0.9rem;">Ready for a deeper Annual Personal Year Blueprint, Biorhythm Report, live Numerology &amp; Tarot consultation, or Digital Detox eBook?</p>
          <a href="${WIX_SHOP_URL}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="font-size: 0.85rem; padding: 0.65rem 1.35rem;">
            Visit the Celestial Navigator Shop →
          </a>
        </div>
      `;

      if (readerContainer) {
        readerContainer.innerHTML = reportHtml + sectionsHtml + shopFollowupHtml;
        readerContainer.scrollTop = 0;
      }

      // Wire client-side downloadable .txt copy
      const downloadBtn = document.getElementById('downloadGuideTextBtn');
      if (downloadBtn) {
        if (currentDownloadUrl) {
          URL.revokeObjectURL(currentDownloadUrl);
          currentDownloadUrl = null;
        }
        const plainSections = sections.map(s => `${s.title}\n${s.body.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&middot;/g, '·').replace(/&bull;/g, '•').replace(/&amp;/g, '&')}`).join('\n\n');
        const plainReport = numerologyReport
          ? `PERSONAL NUMEROLOGY REPORT FOR ${name.toUpperCase()} (DOB: ${dobSummary})\n` +
            `=================================================================\n\n` +
            ['lifePath', 'expression', 'soulUrge', 'personality', 'birthday', 'personalYear'].map(k => {
              const item = numerologyReport[k];
              return `${item.label}: ${item.number} (${item.subtitle})\n${item.meaning.replace(/<[^>]+>/g, '')}`;
            }).join('\n\n') +
            `\n\n-----------------------------------------------------------------\n\n`
          : '';
        const textPayload =
          `LIFE PATH GUIDE — SIMON CORCORAN\n` +
          `Shop & Bookings: ${WIX_SHOP_URL}\n\n` +
          plainReport +
          `${activeGuideName.toUpperCase()}\n` +
          `=================================================================\n\n` +
          plainSections + '\n';

        const blob = new Blob([textPayload], { type: 'text/plain;charset=utf-8' });
        currentDownloadUrl = URL.createObjectURL(blob);
        downloadBtn.href = currentDownloadUrl;
        downloadBtn.download = numerologyReport
          ? 'Digital-Detox-and-Personal-Numerology-Report.txt'
          : 'Life-Path-Quickstart-Guide.txt';
        downloadBtn.style.display = 'inline-flex';
      }

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

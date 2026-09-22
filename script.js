/**
 * Aether AI Landing Page Interactive Script
 * Clean, modular, and dependency-free JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollSpy();
  initScrollReveal();
  initCardTilt();
  initContactForm();
  initHeroChartAnimation();
});

/* --------------------------------------------------------------------------
   1. Navbar Scroll State & Styling
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/* --------------------------------------------------------------------------
   2. Mobile Drawer Navigation
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link, .nav-actions-mobile .btn');

  if (!hamburgerBtn || !navMenu || !navOverlay) return;

  const toggleMenu = (open) => {
    const shouldOpen = open !== undefined ? open : !navMenu.classList.contains('open');
    hamburgerBtn.classList.toggle('open', shouldOpen);
    navMenu.classList.toggle('open', shouldOpen);
    navOverlay.classList.toggle('active', shouldOpen);
    hamburgerBtn.setAttribute('aria-expanded', shouldOpen.toString());
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  };

  hamburgerBtn.addEventListener('click', () => toggleMenu());
  navOverlay.addEventListener('click', () => toggleMenu(false));

  // Close when clicking any nav link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* --------------------------------------------------------------------------
   3. Scroll Spy (Active Section Highlighting)
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/* --------------------------------------------------------------------------
   4. Scroll Reveal Animations (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    },
    {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}

/* --------------------------------------------------------------------------
   5. Interactive 3D Tilt & Mouse Spotlight for Feature Cards
   -------------------------------------------------------------------------- */
function initCardTilt() {
  const tiltCards = document.querySelectorAll('[data-tilt]');
  if (!tiltCards.length) return;

  // Only apply tilt on non-touch devices
  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice()) return;

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update CSS variables for radial flashlight spotlight
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Calculate 3D tilt angles (-8deg to +8deg)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* --------------------------------------------------------------------------
   6. Contact Form Validation & Simulated Submission
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fullNameInput = document.getElementById('fullName');
  const workEmailInput = document.getElementById('workEmail');
  const userMessageInput = document.getElementById('userMessage');
  const submitBtn = document.getElementById('submitFormBtn');
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Real-time input clearing
  fullNameInput.addEventListener('input', () => {
    if (fullNameInput.value.trim().length >= 2) {
      fullNameInput.classList.remove('invalid');
      nameError.classList.remove('visible');
    }
  });

  workEmailInput.addEventListener('input', () => {
    if (emailRegex.test(workEmailInput.value.trim())) {
      workEmailInput.classList.remove('invalid');
      emailError.classList.remove('visible');
    }
  });

  userMessageInput.addEventListener('input', () => {
    if (userMessageInput.value.trim().length >= 10) {
      userMessageInput.classList.remove('invalid');
      messageError.classList.remove('visible');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (fullNameInput.value.trim().length < 2) {
      fullNameInput.classList.add('invalid');
      nameError.classList.add('visible');
      isValid = false;
    } else {
      fullNameInput.classList.remove('invalid');
      nameError.classList.remove('visible');
    }

    // Validate Email
    if (!emailRegex.test(workEmailInput.value.trim())) {
      workEmailInput.classList.add('invalid');
      emailError.classList.add('visible');
      isValid = false;
    } else {
      workEmailInput.classList.remove('invalid');
      emailError.classList.remove('visible');
    }

    // Validate Message
    if (userMessageInput.value.trim().length < 10) {
      userMessageInput.classList.add('invalid');
      messageError.textContent = 'Please provide at least 10 characters describing your request.';
      messageError.classList.add('visible');
      isValid = false;
    } else {
      userMessageInput.classList.remove('invalid');
      messageError.classList.remove('visible');
    }

    if (!isValid) return;

    // Submission UI Loading State
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="animate-spin" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      <span>Transmitting...</span>
    `;

    // Inject temporary keyframes if not present
    if (!document.getElementById('spinStyle')) {
      const style = document.createElement('style');
      style.id = 'spinStyle';
      style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
      document.head.appendChild(style);
    }

    // Simulate async network request
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;

      // Show Toast Notification
      if (toast) {
        if (toastMessage) {
          toastMessage.textContent = `Thank you, ${fullNameInput.value.trim().split(' ')[0]}! Our team will reach out shortly.`;
        }
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 4500);
      }

      form.reset();
    }, 1200);
  });
}

/* --------------------------------------------------------------------------
   7. Real-Time Dynamic Hero Chart Bar Animation
   -------------------------------------------------------------------------- */
function initHeroChartAnimation() {
  const bars = document.querySelectorAll('.mockup-chart-visual .chart-bar');
  if (!bars.length) return;

  // Periodically fluctuate bars slightly to create a live telemetry feel
  setInterval(() => {
    bars.forEach((bar) => {
      const randomFluctuation = Math.floor(Math.random() * 25) - 12; // -12% to +12%
      const currentHeight = parseInt(bar.style.height || '60', 10);
      let newHeight = currentHeight + randomFluctuation;
      if (newHeight < 25) newHeight = 25;
      if (newHeight > 100) newHeight = 100;
      bar.style.height = `${newHeight}%`;
    });
  }, 2200);
}

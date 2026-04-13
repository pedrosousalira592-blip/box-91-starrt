/* ============================================================
   MULTIRASTRO BOX 91 - JavaScript Principal
   ============================================================ */

'use strict';

/* ---- Navbar com efeito de scroll ---- */
const header = document.getElementById('header');

function handleScroll() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Back to top button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll(); // run on load

/* ---- Hamburger / Menu Mobile ---- */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('open');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

// Fechar menu ao clicar em um link
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Fechar menu ao clicar fora
document.addEventListener('click', (e) => {
  if (!header.contains(e.target) && navMenu.classList.contains('open')) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ---- Active nav link on scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveNavLink() {
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', setActiveNavLink, { passive: true });

/* ---- Smooth scroll para links internos ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerHeight = 72;
      const targetPosition = target.offsetTop - headerHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

/* ---- Back to Top ---- */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- Carousel de Avaliações ---- */
(function initCarousel() {
  const track = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');

  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.review-card');
  const totalCards = cards.length;

  // Calcula quantos cards cabem por vez
  function getCardsPerView() {
    const width = window.innerWidth;
    if (width < 600) return 1;
    if (width < 900) return 2;
    return 3;
  }

  let currentIndex = 0;
  let cardsPerView = getCardsPerView();
  let maxIndex = Math.max(0, totalCards - cardsPerView);

  // Criar dots
  function createDots() {
    dotsContainer.innerHTML = '';
    const dotsCount = maxIndex + 1;
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Avaliação ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function getCardWidth() {
    if (cards.length === 0) return 360;
    const style = window.getComputedStyle(cards[0]);
    return cards[0].offsetWidth + parseInt(style.marginRight || '0') + 20; // gap
  }

  function updateTrack() {
    const cardW = getCardWidth();
    const offset = currentIndex * cardW;
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();

    prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
    nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
  }

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    updateTrack();
  }

  prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

  // Touch/swipe support
  let startX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
  }, { passive: true });

  // Mouse drag
  let mouseStartX = 0;
  let isMouseDragging = false;

  track.addEventListener('mousedown', (e) => {
    mouseStartX = e.clientX;
    isMouseDragging = true;
    track.style.cursor = 'grabbing';
  });

  document.addEventListener('mouseup', (e) => {
    if (!isMouseDragging) return;
    isMouseDragging = false;
    track.style.cursor = '';
    const diff = mouseStartX - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
  });

  // Auto play
  let autoplayInterval = setInterval(() => {
    if (currentIndex >= maxIndex) {
      goToSlide(0);
    } else {
      goToSlide(currentIndex + 1);
    }
  }, 4500);

  // Pause autoplay on hover/touch
  track.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  track.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(() => {
      if (currentIndex >= maxIndex) {
        goToSlide(0);
      } else {
        goToSlide(currentIndex + 1);
      }
    }, 4500);
  });

  // Responsive recalc
  window.addEventListener('resize', () => {
    cardsPerView = getCardsPerView();
    maxIndex = Math.max(0, totalCards - cardsPerView);
    currentIndex = Math.min(currentIndex, maxIndex);
    createDots();
    updateTrack();
  });

  // Init
  createDots();
  updateTrack();
})();

/* ---- Fade-in on scroll (Intersection Observer) ---- */
(function initFadeIn() {
  const targets = document.querySelectorAll(
    '.benefit-card, .service-card, .review-card, .contact-card, .prod-cat, .section-header'
  );

  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Staggered delay
        const delay = (Array.from(targets).indexOf(entry.target) % 6) * 80;
        setTimeout(() => {
          entry.target.classList.add('fade-in-up', 'visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  targets.forEach(target => {
    target.classList.add('fade-in-up');
    observer.observe(target);
  });
})();

/* ---- Partículas no Hero (visual) ---- */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const colors = ['rgba(232,160,32,0.6)', 'rgba(245,192,80,0.4)', 'rgba(232,160,32,0.3)'];

  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${Math.random() * 4 + 1}px;
      height: ${Math.random() * 4 + 1}px;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: float-particle ${Math.random() * 10 + 8}s ease-in-out infinite;
      animation-delay: -${Math.random() * 10}s;
      opacity: 0;
    `;
    container.appendChild(p);
  }

  // Add keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-particle {
      0% { transform: translateY(0) scale(0); opacity: 0; }
      10% { opacity: 1; transform: scale(1); }
      90% { opacity: 0.6; }
      100% { transform: translateY(-${window.innerHeight * 0.7}px) scale(0.3); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

/* ---- Rating bars animation on scroll ---- */
(function initRatingBars() {
  const bars = document.querySelectorAll('.bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetWidth = entry.target.style.width;
        entry.target.style.width = '0%';
        setTimeout(() => {
          entry.target.style.width = targetWidth;
        }, 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => {
    const originalWidth = bar.style.width;
    bar.dataset.width = originalWidth;
    bar.style.width = '0%';
    observer.observe(bar);
  });
})();

/* ---- Contador de estatísticas no Hero ---- */
(function initCounters() {
  const statNums = document.querySelectorAll('.stat-num');
  if (!statNums.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();

        // Só anima se for numérico
        const numMatch = text.match(/(\d+)/);
        if (!numMatch) return;

        const target = parseInt(numMatch[1]);
        const suffix = text.replace(/[\d.]/g, '');
        const decimal = text.includes(',') ? text.split(',')[1]?.replace(/\D/g, '') : null;
        const duration = 1200;
        const steps = 40;
        const stepTime = duration / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
          step++;
          current = Math.round((target * step) / steps);
          if (decimal !== null) {
            el.textContent = current + ',' + decimal + suffix;
          } else {
            el.textContent = current + suffix;
          }
          if (step >= steps) {
            clearInterval(timer);
            el.textContent = text; // restore original
          }
        }, stepTime);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.8 });

  statNums.forEach(el => observer.observe(el));
})();

/* ---- Tooltip no botão flutuante do WhatsApp ---- */
(function initWhatsAppFloat() {
  const floatBtn = document.querySelector('.float-whatsapp');
  if (!floatBtn) return;

  // Mostrar tooltip automaticamente após 3 segundos
  setTimeout(() => {
    const tooltip = floatBtn.querySelector('.float-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateX(-110%) scale(1) translateY(-50%)';
      setTimeout(() => {
        tooltip.style.opacity = '';
        tooltip.style.transform = '';
      }, 3000);
    }
  }, 3000);
})();

/* ---- Highlight link ativo na navbar ---- */
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active {
      color: var(--primary) !important;
    }
    .nav-link.active::after {
      width: calc(100% - 28px) !important;
    }
  `;
  document.head.appendChild(style);
});

/* ---- Preload de imagens críticas ---- */
(function preloadImages() {
  const criticalImages = [
    document.querySelector('.hero-bg'),
  ];

  // Já estão no CSS como background, carregadas pelo browser
})();

/* ---- Console log de boas vindas ---- */
console.log('%c🚗 MULTIRASTRO BOX 91 — Estética Automotiva', 'color:#E8A020;font-size:16px;font-weight:bold;');
console.log('%cTucumã-PA | WhatsApp: (94) 99103-4966', 'color:#AAAAAA;font-size:12px;');

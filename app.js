/* ===== PARTICLES ===== */
(function () {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], connections = [];
  const COUNT = 90;
  const MAX_DIST = 130;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = document.body.scrollHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x:  rand(0, W),
      y:  rand(0, H),
      vx: rand(-0.3, 0.3),
      vy: rand(-0.2, 0.2),
      r:  rand(1, 2.2),
      alpha: rand(0.3, 0.8),
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const viewTop    = window.scrollY;
    const viewBottom = viewTop + window.innerHeight;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      if (p.y < viewTop - 60 || p.y > viewBottom + 60) continue;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 170, 255, ${p.alpha})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        if (q.y < viewTop - 60 || q.y > viewBottom + 60) continue;
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0, 170, 255, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => {
      if (p.x > W) p.x = rand(0, W);
      if (p.y > H) p.y = rand(0, H);
    });
  });

  init();
  draw();
})();

/* ===== HEADER SCROLL EFFECT ===== */
(function () {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.style.background = 'rgba(2,11,24,0.97)';
    } else {
      header.style.background = 'rgba(2,11,24,0.88)';
    }
  });
})();

/* ===== MOBILE MENU ===== */
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    btn.querySelector('i').className = menu.classList.contains('open')
      ? 'fa-solid fa-xmark'
      : 'fa-solid fa-bars';
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.querySelector('i').className = 'fa-solid fa-bars';
    });
  });
})();

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ===== ACTIVE NAV LINK ===== */
(function () {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobLinks = document.querySelectorAll('.mob-nav-item');

  function onScroll() {
    const scroll = window.scrollY + 100;
    sections.forEach(sec => {
      if (sec.offsetTop <= scroll && sec.offsetTop + sec.offsetHeight > scroll) {
        const id = sec.id;
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
        mobLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ===== CAROUSEL ===== */
(function () {
  const track   = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  if (!track) return;

  let current = 0;
  let visibleCount = getVisibleCount();
  const cards = track.querySelectorAll('.project-card');
  const total = cards.length;

  function getVisibleCount() {
    if (window.innerWidth >= 1100) return 5;
    if (window.innerWidth >= 900)  return 3;
    if (window.innerWidth >= 600)  return 2;
    return 1;
  }

  function getCardWidth() {
    if (!cards[0]) return 0;
    const style = window.getComputedStyle(cards[0]);
    return cards[0].offsetWidth + parseFloat(style.marginRight || 0) + 16;
  }

  function update() {
    visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, total - visibleCount);
    if (current > maxIndex) current = maxIndex;
    const offset = current * getCardWidth();
    track.style.transform = `translateX(-${offset}px)`;
    prevBtn.style.opacity = current === 0 ? '0.35' : '1';
    nextBtn.style.opacity = current >= maxIndex ? '0.35' : '1';
  }

  prevBtn.addEventListener('click', () => {
    if (current > 0) { current--; update(); }
  });

  nextBtn.addEventListener('click', () => {
    visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, total - visibleCount);
    if (current < maxIndex) { current++; update(); }
  });

  window.addEventListener('resize', update);
  update();

  // Touch/swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      visibleCount = getVisibleCount();
      const maxIndex = Math.max(0, total - visibleCount);
      if (diff > 0 && current < maxIndex) { current++; update(); }
      if (diff < 0 && current > 0)        { current--; update(); }
    }
  }, { passive: true });
})();

/* ===== TESTIMONIALS AUTO-SCROLL DOTS ===== */
(function () {
  const dots = document.querySelectorAll('#testimonial-dots .dot');
  let active = 0;
  setInterval(() => {
    dots[active].classList.remove('active');
    active = (active + 1) % dots.length;
    dots[active].classList.add('active');
  }, 2800);
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      dots[active].classList.remove('active');
      active = i;
      dot.classList.add('active');
    });
  });
})();

/* ===== AOS (Animate on Scroll) ===== */
(function () {
  const els = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach(el => observer.observe(el));
})();

/* ===== COUNTER ANIMATION ===== */
(function () {
  const stats = [
    { selector: '.project-stat', pattern: /\+(\d+)%/ }
  ];

  function animateCount(el, target, prefix, suffix) {
    let start = 0;
    const dur  = 1400;
    const step = timestamp => {
      if (!start) start = timestamp;
      const prog = Math.min((timestamp - start) / dur, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      el.childNodes[0].textContent = prefix + Math.round(ease * target) + suffix;
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.childNodes[0] ? el.childNodes[0].textContent : '';
      const match = text.match(/\+?(\d+)(%?)/);
      if (match) {
        const num = parseInt(match[1]);
        const suf = match[2] || '';
        animateCount(el, num, '+', suf);
      }
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.project-stat').forEach(el => observer.observe(el));
})();

/* ===== STEP ENTER ANIMATION ===== */
(function () {
  document.querySelectorAll('.step').forEach((step, i) => {
    step.style.opacity = '0';
    step.style.transform = 'translateX(-20px)';
    step.style.transition = `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        step.style.opacity = '1';
        step.style.transform = 'translateX(0)';
        obs.unobserve(step);
      }
    }, { threshold: 0.2 });
    obs.observe(step);
  });
})();

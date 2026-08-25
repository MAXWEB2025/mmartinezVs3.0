/* ============================================
   MMARTINEZ Solution IT - Interactivity
   ============================================ */

   document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Mobile menu ---------- */
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
  
    if (menuToggle && nav) {
      menuToggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        menuToggle.classList.toggle('open', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen);
      });
  
      // Close menu when clicking a link
      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          nav.classList.remove('open');
          menuToggle.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', false);
        });
      });
    }
  
    /* ---------- Header scroll effect ---------- */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  
    /* ---------- Active nav on scroll ---------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
  
    sections.forEach(sec => observer.observe(sec));
  
    /* ---------- Benefits accordion (mobile) ---------- */
    const benefitCards = document.querySelectorAll('[data-benefit]');
    benefitCards.forEach(card => {
      card.addEventListener('click', () => {
        // Only act as accordion on mobile widths
        if (window.innerWidth <= 768) {
          card.classList.toggle('active');
        }
      });
    });
  
    
  /******fdfgdgvbsdiufb */
  /* ---------- Slider de Trabajos ---------- */
  const track = document.querySelector(".slider-track");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  
  if (track && prevBtn && nextBtn) {
    // Manejador del botón "Siguiente"
    nextBtn.addEventListener("click", () => {
      const card = track.querySelector(".slider-card");
      if (card) {
        // Calcula cuánto mide una tarjeta más su espacio en ese instante
        const cardWidth = card.clientWidth + 20; 
        track.scrollBy({
          left: cardWidth,
          behavior: "smooth"
        });
      }
    });
      
    // Manejador del botón "Anterior"
    prevBtn.addEventListener("click", () => {
      const card = track.querySelector(".slider-card");
      if (card) {
        const cardWidth = card.clientWidth + 20;
        track.scrollBy({
          left: -cardWidth,
          behavior: "smooth"
        });
      }
    });
  }
    
        
      
  
    /* ---------- Reveal on scroll ---------- */
    const revealTargets = document.querySelectorAll(
      '.benefit-card, .step-card, .work-card, .stat, .section-head'
    );
    revealTargets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
    });
  
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 60);
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  
    revealTargets.forEach(el => revealObs.observe(el));
  
    /* ---------- Smooth scroll offset for sticky header ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerH = document.getElementById('header').offsetHeight;
          const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 10;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  
  });
  
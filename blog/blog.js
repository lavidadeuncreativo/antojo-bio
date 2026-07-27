(() => {
  'use strict';

  const MOOD_KEY = 'antojo-mood-v3';
  const MOODS = [
    ['editorial', 'Blanco editorial', '#ffffff'],
    ['rojo', 'Rojo ANTOJO.', '#d93622'],
    ['mariposa', 'Mariposa', '#cbbcf2'],
    ['crema', 'Crema', '#f5ead5'],
    ['tinta', 'Tinta', '#111111'],
    ['mantequilla', 'Mantequilla', '#f4d35e'],
    ['pulse', 'Pulse', '#f0cad7']
  ].map(([id, label, color]) => ({ id, label, color }));

  const $ = (selector, root = document) => root?.querySelector(selector) || null;
  const $$ = (selector, root = document) => root ? [...root.querySelectorAll(selector)] : [];

  function getStoredMood() {
    try {
      const stored = localStorage.getItem(MOOD_KEY);
      if (MOODS.some(mood => mood.id === stored)) return stored;
    } catch {}
    return 'editorial';
  }

  function applyMood(id, persist = true) {
    const mood = MOODS.find(item => item.id === id) || MOODS[0];
    document.documentElement.dataset.mood = mood.id;
    if (persist) {
      try { localStorage.setItem(MOOD_KEY, mood.id); } catch {}
    }
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = mood.color;
    $$('.blog-mood-grid [data-mood]').forEach(button => {
      const active = button.dataset.mood === mood.id;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-checked', String(active));
    });
  }

  function closeMoodMenu(restoreFocus = false) {
    const menu = $('.blog-mood-menu');
    const toggle = $('[data-theme-toggle]');
    if (!menu || !toggle) return;
    menu.classList.remove('is-open');
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (restoreFocus) toggle.focus();
  }

  function injectMoodMenu() {
    const toggle = $('[data-theme-toggle]');
    if (!toggle) return;
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-expanded', 'false');

    const menu = document.createElement('div');
    menu.className = 'blog-mood-menu';
    menu.hidden = true;
    menu.setAttribute('role', 'radiogroup');
    menu.setAttribute('aria-label', 'Atmósfera visual');
    menu.innerHTML = `<strong>Elige cómo se siente ANTOJO.</strong><div class="blog-mood-grid">${MOODS.map(mood => `<button type="button" role="radio" aria-checked="false" data-mood="${mood.id}"><i style="background:${mood.id === 'pulse' ? 'linear-gradient(135deg,#f4dec8,#f0cad7,#d9d0f3,#f2dc82)' : mood.color}" aria-hidden="true"></i><span>${mood.label}</span></button>`).join('')}</div>`;
    document.body.appendChild(menu);

    toggle.addEventListener('click', event => {
      event.stopPropagation();
      if (menu.hidden) {
        menu.hidden = false;
        requestAnimationFrame(() => menu.classList.add('is-open'));
        toggle.setAttribute('aria-expanded', 'true');
      } else {
        closeMoodMenu();
      }
    });

    menu.addEventListener('click', event => {
      const option = event.target.closest('[data-mood]');
      if (!option) return;
      applyMood(option.dataset.mood);
      closeMoodMenu(true);
    });

    document.addEventListener('click', event => {
      if (!event.target.closest('.blog-mood-menu,[data-theme-toggle]')) closeMoodMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !menu.hidden) closeMoodMenu(true);
    });
  }

  function prepareWordReveals() {
    $$('[data-reveal-words]').forEach(node => {
      if (node.dataset.prepared === 'true') return;
      const words = node.textContent.trim().split(/\s+/);
      node.textContent = '';
      words.forEach((word, index) => {
        const span = document.createElement('span');
        span.className = 'reveal-word';
        span.style.setProperty('--word-index', String(index));
        span.textContent = word;
        node.appendChild(span);
      });
      node.dataset.prepared = 'true';
    });
  }

  function bindRevealObserver() {
    const targets = $$('[data-reveal-words]');
    if (!targets.length) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach(target => target.classList.add('is-revealed'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-revealed');
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(target => observer.observe(target));
  }

  function updateProgress() {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? Math.min(100, Math.max(0, (window.scrollY / height) * 100)) : 0;
    document.documentElement.style.setProperty('--reading-progress', `${progress}%`);
  }

  function start() {
    injectMoodMenu();
    applyMood(getStoredMood(), false);
    prepareWordReveals();
    bindRevealObserver();
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();

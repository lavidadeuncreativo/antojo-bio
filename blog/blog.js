(() => {
  'use strict';

  const THEME_KEY = 'antojo-blog-theme-v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function applyTheme(theme) {
    const next = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    const button = $('[data-theme-toggle]');
    if (button) {
      button.textContent = next === 'dark' ? 'Modo claro' : 'Modo oscuro';
      button.setAttribute('aria-label', next === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }
    try { localStorage.setItem(THEME_KEY, next); } catch {}
  }

  function initialTheme() {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored) return stored;
    } catch {}
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-revealed');
      });
    }, { threshold: 0.35, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(target => observer.observe(target));
  }

  function updateProgress() {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? Math.min(100, Math.max(0, (window.scrollY / height) * 100)) : 0;
    document.documentElement.style.setProperty('--reading-progress', `${progress}%`);
  }

  function start() {
    applyTheme(initialTheme());
    $('[data-theme-toggle]')?.addEventListener('click', () => {
      applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    });
    prepareWordReveals();
    bindRevealObserver();
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();

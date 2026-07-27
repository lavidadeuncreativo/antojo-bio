(() => {
  'use strict';

  const INSTAGRAM_URL = 'https://www.instagram.com/antojo.bebidas/';
  const MOOD_KEY = 'antojo-mood-v3';
  const DEFAULT_MOOD = 'editorial';
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

  function storageGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }

  function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch {}
  }

  function replaceText(root, replacements) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      let next = node.nodeValue;
      replacements.forEach(([pattern, value]) => { next = next.replace(pattern, value); });
      if (next !== node.nodeValue) node.nodeValue = next;
    });
  }

  function normalizeBrand() {
    replaceText(document.body, [
      [/¡Ya somos 15K en Instagram!/g, '¡Ya somos +16K en Instagram!'],
      [/15K\+/g, '+16K'],
      [/@antojo\.beb(?!idas)/g, '@antojo.bebidas']
    ]);
    $$('a[href*="instagram.com/antojo.beb"]').forEach(link => {
      link.href = INSTAGRAM_URL;
      link.rel = 'noopener';
    });
  }

  function renderAnnouncementBar() {
    const windowNode = $('.announcement-window');
    const live = $('#announcementLive');
    if (!windowNode) return;
    const items = [
      ['Edición Día de la Novia · 1 AGO · $219', true],
      ['¡Ya somos +16K en Instagram!', false],
      ['18 sabores · con y sin alcohol', false],
      ['Entregas de viernes a domingo en CDMX', false]
    ];
    windowNode.innerHTML = `<div class="announcement-grid">${items.map(([text, campaign]) => {
      const tag = campaign ? 'button' : 'span';
      const attrs = campaign ? ' type="button" data-novia-open' : '';
      return `<${tag}${attrs} class="announcement-grid__item${campaign ? ' is-campaign' : ''}"><i aria-hidden="true"></i><strong>${text}</strong></${tag}>`;
    }).join('')}</div>`;
    if (live) live.textContent = items.map(([text]) => text).join('. ');
  }

  function ensureEditorialLinks() {
    $('#antojoBlogLink')?.remove();

    const drawer = $('#drawer');
    if (drawer && !$('#drawerBlogButton')) {
      const faq = $('[data-faq-open]', drawer);
      const button = document.createElement('button');
      button.id = 'drawerBlogButton';
      button.type = 'button';
      button.innerHTML = '<span>06</span><b>Diario ANTOJO.</b><i>↗</i>';
      button.addEventListener('click', () => { window.location.href = '/blog/'; });
      drawer.insertBefore(button, faq || null);
      if (faq) $('span', faq).textContent = '07';
    }

    const links = $('.bio-links');
    if (links && !$('#homeBlogLink')) {
      const link = document.createElement('a');
      link.id = 'homeBlogLink';
      link.className = 'bio-link bio-link--journal';
      link.href = '/blog/';
      link.innerHTML = `
        <span class="bio-link__icon bio-link__icon--system" aria-hidden="true">
          <svg viewBox="0 0 32 32"><path d="M8 5.5h13.5A2.5 2.5 0 0 1 24 8v18.5H10.5A2.5 2.5 0 0 1 8 24V5.5Z"></path><path d="M8 22.5h13.5A2.5 2.5 0 0 1 24 25M12 11h8M12 15h8M12 19h5"></path></svg>
        </span>
        <span><small>Decisiones, números y aprendizajes</small><strong>Leer el diario</strong></span><b>06</b>`;
      links.appendChild(link);
    }

    const footerNav = $('.footer-top nav');
    if (footerNav && !$('#footerBlogLink')) {
      const link = document.createElement('a');
      link.id = 'footerBlogLink';
      link.href = '/blog/';
      link.textContent = 'Diario ↗';
      footerNav.insertBefore(link, footerNav.firstChild);
    }
  }

  function currentMood() {
    const stored = storageGet(MOOD_KEY);
    return MOODS.some(mood => mood.id === stored) ? stored : DEFAULT_MOOD;
  }

  function updateMoodUi(mood) {
    const button = $('#antojoMoodButton');
    if (button) {
      button.dataset.mood = mood.id;
      button.title = `Mood: ${mood.label}`;
      button.setAttribute('aria-label', `Cambiar atmósfera visual. Actual: ${mood.label}`);
    }
    $$('#antojoMoodMenu [data-mood-option]').forEach(option => {
      const active = option.dataset.moodOption === mood.id;
      option.classList.toggle('is-active', active);
      option.setAttribute('aria-checked', String(active));
    });
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = mood.color;
  }

  function applyMood(id, persist = true) {
    const mood = MOODS.find(item => item.id === id) || MOODS[0];
    document.documentElement.dataset.mood = mood.id;
    if (persist) storageSet(MOOD_KEY, mood.id);
    updateMoodUi(mood);
    window.antojoTrack?.('change_visual_mood', { mood: mood.id });
  }

  function closeMoodMenu(restoreFocus = false) {
    const menu = $('#antojoMoodMenu');
    const button = $('#antojoMoodButton');
    if (!menu || !button) return;
    menu.classList.remove('is-open');
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (restoreFocus) button.focus();
  }

  function injectMoodControl() {
    const actions = $('.header-actions');
    if (!actions) return;
    $('#antojoMoodButton')?.remove();
    $('#antojoMoodMenu')?.remove();

    const button = document.createElement('button');
    button.id = 'antojoMoodButton';
    button.className = 'mood-button';
    button.type = 'button';
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = '<span aria-hidden="true">◐</span>';

    const menu = document.createElement('div');
    menu.id = 'antojoMoodMenu';
    menu.className = 'mood-menu';
    menu.hidden = true;
    menu.setAttribute('role', 'radiogroup');
    menu.setAttribute('aria-label', 'Atmósfera visual');
    menu.innerHTML = `
      <div class="mood-menu__head"><small>ATMÓSFERA</small><strong>Elige cómo se siente ANTOJO.</strong></div>
      <div class="mood-menu__grid">${MOODS.map(mood => `<button type="button" role="radio" aria-checked="false" data-mood-option="${mood.id}"><i class="mood-swatch mood-swatch--${mood.id}" aria-hidden="true"></i><span>${mood.label}</span></button>`).join('')}</div>`;

    actions.insertBefore(button, $('#menuButton'));
    document.body.appendChild(menu);

    button.addEventListener('click', event => {
      event.stopPropagation();
      if (menu.hidden) {
        menu.hidden = false;
        requestAnimationFrame(() => menu.classList.add('is-open'));
        button.setAttribute('aria-expanded', 'true');
        setTimeout(() => $('[aria-checked="true"]', menu)?.focus(), 20);
      } else {
        closeMoodMenu();
      }
    });

    menu.addEventListener('click', event => {
      const option = event.target.closest('[data-mood-option]');
      if (!option) return;
      applyMood(option.dataset.moodOption);
      closeMoodMenu(true);
    });

    document.addEventListener('click', event => {
      if (!event.target.closest('#antojoMoodButton,#antojoMoodMenu')) closeMoodMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !menu.hidden) closeMoodMenu(true);
    });

    applyMood(currentMood(), false);
  }

  function syncRoute() {
    const route = String(location.hash || '#inicio').replace(/^#\/?/, '') || 'inicio';
    document.body.dataset.route = route;
    renderAnnouncementBar();
  }

  function start() {
    try {
      localStorage.removeItem('antojo-mood-v1');
      localStorage.removeItem('antojo-mood-v2');
    } catch {}
    normalizeBrand();
    renderAnnouncementBar();
    ensureEditorialLinks();
    injectMoodControl();
    syncRoute();
    window.addEventListener('hashchange', syncRoute);
    new MutationObserver(normalizeBrand).observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();

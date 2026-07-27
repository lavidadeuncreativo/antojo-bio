(() => {
  'use strict';

  const INSTAGRAM_URL = 'https://www.instagram.com/antojo.beb/';
  const MOODS = [
    { id: 'cream', label: 'Crema' },
    { id: 'pulse', label: 'Pulso' },
    { id: 'mariposa', label: 'Mariposa' }
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

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

  function patchCommunityAndInstagram() {
    replaceText(document.body, [
      [/¡Ya somos 15K en Instagram!/g, '¡Ya somos +16K en Instagram!'],
      [/\b15K\+\b/g, '+16K'],
      [/@antojo\.bebidas/g, '@antojo.beb']
    ]);

    $$('a[href*="instagram.com/antojo.bebidas"]').forEach(link => {
      link.href = INSTAGRAM_URL;
      link.rel = 'noopener';
    });
  }

  function applyMood(id) {
    const mood = MOODS.find(item => item.id === id) || MOODS[0];
    document.documentElement.dataset.mood = mood.id;
    try { localStorage.setItem('antojo-mood-v1', mood.id); } catch {}
    const button = $('#antojoMoodButton');
    if (button) {
      button.dataset.mood = mood.id;
      button.setAttribute('aria-label', `Cambiar mood. Actual: ${mood.label}`);
      button.innerHTML = `<span aria-hidden="true"></span>Mood: ${mood.label}`;
    }
  }

  function cycleMood() {
    const current = document.documentElement.dataset.mood || MOODS[0].id;
    const index = Math.max(0, MOODS.findIndex(item => item.id === current));
    applyMood(MOODS[(index + 1) % MOODS.length].id);
    window.antojoTrack?.('change_visual_mood', { mood: document.documentElement.dataset.mood });
  }

  function injectHeaderControls() {
    const actions = $('.header-actions');
    if (!actions) return;

    if (!$('#antojoBlogLink')) {
      const blog = document.createElement('a');
      blog.id = 'antojoBlogLink';
      blog.className = 'header-blog';
      blog.href = '/blog/';
      blog.textContent = 'Diario ↗';
      actions.insertBefore(blog, $('#menuButton'));
    }

    if (!$('#antojoMoodButton')) {
      const button = document.createElement('button');
      button.id = 'antojoMoodButton';
      button.className = 'mood-button';
      button.type = 'button';
      button.addEventListener('click', cycleMood);
      actions.insertBefore(button, $('#antojoBlogLink'));
    }
  }

  function injectDrawerLink() {
    const drawer = $('#drawer');
    if (!drawer || $('#drawerBlogButton')) return;
    const faq = $('[data-faq-open]', drawer);
    const button = document.createElement('button');
    button.id = 'drawerBlogButton';
    button.type = 'button';
    button.innerHTML = '<span>06</span><b>Diario ANTOJO.</b><i>↗</i>';
    button.addEventListener('click', () => { window.location.href = '/blog/'; });
    drawer.insertBefore(button, faq || null);
    if (faq) {
      const number = $('span', faq);
      if (number) number.textContent = '07';
    }
  }

  function injectHomeLink() {
    const links = $('.bio-links');
    if (!links || $('#homeBlogLink')) return;
    const link = document.createElement('a');
    link.id = 'homeBlogLink';
    link.className = 'bio-link bio-link--journal';
    link.href = '/blog/';
    link.innerHTML = `
      <span class="bio-link__icon bio-link__icon--system" aria-hidden="true">
        <svg viewBox="0 0 32 32"><path d="M8 5.5h13.5A2.5 2.5 0 0 1 24 8v18.5H10.5A2.5 2.5 0 0 1 8 24V5.5Z"></path><path d="M8 22.5h13.5A2.5 2.5 0 0 1 24 25M12 11h8M12 15h8M12 19h5"></path></svg>
      </span>
      <span><small>Capítulos, decisiones y aprendizajes</small><strong>Leer el diario</strong></span><b>06</b>`;
    links.appendChild(link);
  }

  function injectFooterLink() {
    const footerNav = $('.footer-top nav');
    if (!footerNav || $('#footerBlogLink')) return;
    const link = document.createElement('a');
    link.id = 'footerBlogLink';
    link.href = '/blog/';
    link.textContent = 'Diario ↗';
    footerNav.insertBefore(link, footerNav.firstChild);
  }

  function inject() {
    injectHeaderControls();
    injectDrawerLink();
    injectHomeLink();
    injectFooterLink();
    patchCommunityAndInstagram();
  }

  function start() {
    inject();
    let stored = 'cream';
    try { stored = localStorage.getItem('antojo-mood-v1') || 'cream'; } catch {}
    applyMood(stored);

    const ticker = $('#announcementTrack');
    const social = $('#socialTrack');
    const observer = new MutationObserver(() => patchCommunityAndInstagram());
    if (ticker) observer.observe(ticker, { childList: true, subtree: true, characterData: true });
    if (social) observer.observe(social, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();

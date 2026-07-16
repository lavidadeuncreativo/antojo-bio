(()=>{
  'use strict';
  const A = window.ANTOJO;
  const {$, $$, state} = A;
  let onboardingIndex = 0;
  let selectedRating = 0;

  const setImage = (id, src) => {
    const image = $(`#${id}`);
    if (image) image.src = src;
  };

  A.initImages = () => {
    setImage('desktopCanA','/assets/renders/mojito-mariposa.webp');
    setImage('desktopCanB','/assets/renders/espresso-horchata.webp');
    setImage('onboardCanA','/assets/renders/maracuya.webp');
    setImage('onboardCanB','/assets/renders/mojito-mariposa.webp');
    setImage('onboardCanC','/assets/renders/horchata.webp');
    setImage('heroCanA','/assets/renders/maracuya.webp');
    setImage('heroCanB','/assets/renders/espresso-horchata.webp');
    setImage('heroCanC','/assets/renders/mojito-mariposa.webp');
  };

  A.renderOnboarding = () => {
    $$('.onboarding-slide').forEach((slide, index) => slide.classList.toggle('active', index === onboardingIndex));
    $$('.onboarding-dots i').forEach((dot, index) => dot.classList.toggle('active', index === onboardingIndex));
    $('#nextOnboarding').textContent = onboardingIndex === 2 ? 'Entrar' : 'Siguiente';
  };

  A.finishOnboarding = () => {
    try { localStorage.setItem(A.ONBOARDING_KEY, '1'); } catch {}
    document.documentElement.classList.add('onboarding-seen');
    $('#onboarding')?.classList.add('closed');
  };

  A.setupParallax = () => {
    if (matchMedia('(max-width:900px)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hero = $('#homeHero');
    const heroCans = $$('#heroCans img');
    hero?.addEventListener('mousemove', event => {
      const box = hero.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - .5;
      const y = (event.clientY - box.top) / box.height - .5;
      heroCans.forEach((image, index) => image.style.transform = `translate3d(${x * (index + 1) * 8}px,${-y * (index + 1) * 7}px,0) rotate(${[-8,2,8][index]}deg)`);
    });
    hero?.addEventListener('mouseleave', () => heroCans.forEach(image => image.style.transform = ''));

    const story = $('#desktopStory');
    const cans = $$('.desktop-can', story);
    story?.addEventListener('mousemove', event => {
      const box = story.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - .5;
      const y = (event.clientY - box.top) / box.height - .5;
      cans.forEach((can, index) => can.style.transform = `translate3d(${x * (index ? 18 : -22)}px,${y * (index ? -16 : 20)}px,0) rotate(${index ? -8 : 7}deg)`);
    });
    story?.addEventListener('mouseleave', () => cans.forEach((can, index) => can.style.transform = `rotate(${index ? -8 : 7}deg)`));
  };

  A.goHomeAnchor = anchor => {
    A.closeMobileMenu();
    A.showScreen('home');
    const map = {needs:'#needsSection',how:'#howSection',faq:'#faqSection'};
    setTimeout(() => A.$(map[anchor])?.scrollIntoView({behavior:'smooth',block:'start'}), 120);
  };

  A.bindGlobalEvents = () => {
    document.addEventListener('click', event => {
      const menuTarget = event.target.closest('[data-menu-target]');
      if (menuTarget) {
        event.preventDefault();
        A.showScreen(menuTarget.dataset.menuTarget);
        return;
      }
      const homeAnchor = event.target.closest('[data-home-anchor]');
      if (homeAnchor) {
        event.preventDefault();
        A.goHomeAnchor(homeAnchor.dataset.homeAnchor);
        return;
      }
      const screenLink = event.target.closest('[data-screen-link]');
      if (screenLink) {
        event.preventDefault();
        A.showScreen(screenLink.dataset.screenLink);
        return;
      }
      const journey = event.target.closest('[data-journey]');
      if (journey) {
        event.preventDefault();
        A.openJourney(journey.dataset.journey);
        return;
      }
      const editJourney = event.target.closest('[data-edit-journey]');
      if (editJourney) {
        event.preventDefault();
        A.openJourney(editJourney.dataset.editJourney);
        return;
      }
      const product = event.target.closest('[data-product-id]');
      if (product) {
        event.preventDefault();
        A.openProduct(product.dataset.productId);
        return;
      }
      const category = event.target.closest('[data-category]');
      if (category) {
        state.category = category.dataset.category;
        A.renderMenu();
        return;
      }
      const sheetQty = event.target.closest('[data-sheet-qty]');
      if (sheetQty) {
        A.selectedProductQty = Number(sheetQty.dataset.sheetQty);
        A.renderProductSheet();
        return;
      }
      if (event.target.closest('[data-sheet-minus]')) {
        A.selectedProductQty = Math.max(1, A.selectedProductQty - 1);
        A.renderProductSheet();
        return;
      }
      if (event.target.closest('[data-sheet-plus]')) {
        A.selectedProductQty = Math.min(1000, A.selectedProductQty + 1);
        A.renderProductSheet();
        return;
      }
      if (event.target.closest('#addProduct')) {
        state.cart[A.selectedProductId] = Number(state.cart[A.selectedProductId] || 0) + A.selectedProductQty;
        A.persist();
        A.closeProduct();
        A.updateCounts();
        A.showScreen('cart');
        A.toast(`${A.selectedProductQty} bebidas agregadas.`);
        return;
      }
      const minus = event.target.closest('[data-cart-minus]');
      if (minus) return A.changeCart(minus.dataset.cartMinus, -1);
      const plus = event.target.closest('[data-cart-plus]');
      if (plus) return A.changeCart(plus.dataset.cartPlus, 1);
      const remove = event.target.closest('[data-remove-item]');
      if (remove) {
        delete state.cart[remove.dataset.removeItem];
        A.persist();
        A.updateCounts();
        A.renderCart();
        return;
      }
      if (event.target.closest('#startCheckout')) {
        A.startCheckout();
        return;
      }
    });

    $('#menuButton').onclick = A.openMobileMenu;
    $('#closeMobileMenu').onclick = A.closeMobileMenu;
    $('#mobileMenu').onclick = event => { if (event.target.id === 'mobileMenu') A.closeMobileMenu(); };
    $('#closeProductModal').onclick = A.closeProduct;
    $('#productModal').onclick = event => { if (event.target.id === 'productModal') A.closeProduct(); };
    $('#closeJourneyModal').onclick = A.closeJourney;
    $('#journeyModal').onclick = event => { if (event.target.id === 'journeyModal') A.closeJourney(); };

    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      A.closeProduct();
      A.closeJourney();
      A.closeMobileMenu();
    });

    $('#skipOnboarding').onclick = A.finishOnboarding;
    $('#nextOnboarding').onclick = () => {
      if (onboardingIndex < 2) { onboardingIndex += 1; A.renderOnboarding(); }
      else A.finishOnboarding();
    };

    $$('[data-rating]').forEach(button => button.onclick = () => {
      selectedRating = Number(button.dataset.rating);
      $$('[data-rating]').forEach(star => star.classList.toggle('active', Number(star.dataset.rating) <= selectedRating));
      $('#sendReview').disabled = false;
    });
    $('#sendReview').onclick = () => {
      if (!selectedRating) return;
      location.href = `https://wa.me/${A.WHATSAPP}?text=${encodeURIComponent(`Hola ANTOJO. Ya probé sus bebidas y mi calificación es ${selectedRating}/5 ⭐. Quiero contarles cómo me fue:`)}`;
    };

    window.addEventListener('beforeunload', A.persist);
    document.addEventListener('input', event => {
      if (event.target.matches('input,textarea,select')) setTimeout(A.persist, 0);
    });
  };

  A.init = () => {
    A.initImages();
    A.bindGlobalEvents();
    A.renderOnboarding();
    A.renderHome();
    A.renderMenu();
    A.renderCart();
    A.updateCounts();
    A.setupParallax();
    A.observeReveals();
    A.retryPending();
    const last = A.parse(localStorage.getItem(A.LAST_KEY), null);
    if (last?.folio && Date.now() - Number(last.at || 0) < 864e5) A.renderSuccess(last);
    if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', A.init, {once:true});
  else A.init();
})();

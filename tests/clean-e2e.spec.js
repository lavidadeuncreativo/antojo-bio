const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.CLEAN_BASE_URL || 'http://127.0.0.1:4173';

async function openCleanApp(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem('antojo_clean_onboarding_seen', '1');
    localStorage.removeItem('antojo_clean_state_v2');
    localStorage.removeItem('antojo_clean_last_registration_v2');
    localStorage.removeItem('antojo_clean_pending_v2');
  });
  await page.route('**/api/submit', async route => {
    const request = route.request();
    const payload = request.postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ok:true, folio:payload.folio, notionUrl:'https://notion.so/test-record'})
    });
  });
  await page.route('**/api/whatsapp-opened', route => route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'}));
  await page.goto(BASE_URL, {waitUntil:'networkidle'});
  await page.waitForFunction(() => window.ANTOJO && window.ANTOJO.PRODUCTS?.length >= 18);
  await page.waitForTimeout(300);
  return errors;
}

function futureDate(days = 4) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

async function addProduct(page, productName, quantity = null) {
  await page.getByRole('button', {name:new RegExp(productName, 'i')}).first().click();
  await expect(page.locator('#productModal')).toHaveClass(/open/);
  if (quantity) await page.locator(`[data-sheet-qty="${quantity}"]`).click();
  await page.locator('#addProduct').click();
  await expect(page.locator('[data-screen="cart"]')).toHaveClass(/active/);
}

async function completeContactAndSubmit(page) {
  await page.locator('#nameField').fill('Prueba ANTOJO');
  await page.locator('#phoneField').fill('5522026291');
  await page.locator('#consentField').check();
  await page.locator('#checkoutNext').click();
  await expect(page.locator('[data-screen="success"]')).toHaveClass(/active/);
  await expect(page.getByText(/quedó registrado/i)).toBeVisible();
  await expect(page.getByRole('button', {name:/Enviar resumen por WhatsApp/i})).toBeVisible();
  await expect(page.getByRole('link', {name:/Seguir nuestra historia/i})).toBeVisible();
}

test.describe('ANTOJO clean frontend', () => {
  test('landing, renders, carousel and product modal work', async ({page}) => {
    const errors = await openCleanApp(page);
    await expect(page.getByRole('heading', {name:'¿Qué necesitas?'})).toBeVisible();
    await expect(page.getByRole('heading', {name:'Así funciona'})).toBeVisible();
    const needsBox = await page.locator('#needsSection').boundingBox();
    const howBox = await page.locator('#howSection').boundingBox();
    expect(needsBox.y).toBeLessThan(howBox.y);

    const heroImages = page.locator('#heroCans img');
    await expect(heroImages).toHaveCount(3);
    for (let index = 0; index < 3; index += 1) {
      await expect.poll(() => heroImages.nth(index).evaluate(image => image.naturalWidth)).toBeGreaterThan(0);
      expect(await heroImages.nth(index).getAttribute('src')).toMatch(/^data:image\/webp;base64,/);
    }

    const track = page.locator('#favoritesTrack');
    const before = await track.evaluate(node => getComputedStyle(node).transform);
    await page.waitForTimeout(1800);
    const after = await track.evaluate(node => getComputedStyle(node).transform);
    expect(after).not.toBe(before);

    await page.getByRole('button', {name:/Espresso horchata/i}).first().click();
    await expect(page.locator('#productModal')).toHaveClass(/open/);
    await page.locator('#closeProductModal').click();
    await expect(page.locator('#productModal')).not.toHaveClass(/open/);

    await page.getByRole('button', {name:/Espresso horchata/i}).first().click();
    await page.locator('#productModal').click({position:{x:5,y:5}});
    await expect(page.locator('#productModal')).not.toHaveClass(/open/);
    expect(errors).toEqual([]);
  });

  test('small order registers, clears state and keeps WhatsApp optional', async ({page}) => {
    const errors = await openCleanApp(page);
    await page.getByRole('button', {name:/Quiero pedir bebidas/i}).click();
    await expect(page.locator('[data-screen="menu"]')).toHaveClass(/active/);
    await addProduct(page, 'Horchata');
    await page.locator('#startCheckout').click();

    await page.getByRole('button', {name:/Recoger en WTC/i}).click();
    await page.locator('#checkoutNext').click();
    await page.locator('#occasionField').selectOption({label:'Fin de semana'});
    await page.locator('#dateField').fill(futureDate());
    await page.locator('#checkoutNext').click();
    await page.getByRole('button', {name:/Lata ANTOJO/i}).click();
    await page.locator('#checkoutNext').click();
    await completeContactAndSubmit(page);

    await expect(page.locator('#headerCartCount')).not.toHaveClass(/show/);
    expect(await page.evaluate(() => window.ANTOJO.totalQty())).toBe(0);
    const urlBefore = page.url();
    await page.waitForTimeout(1800);
    expect(page.url()).toBe(urlBefore);
    expect(errors).toEqual([]);
  });

  test('event and personalized journeys remain independent and editable', async ({page}) => {
    const errors = await openCleanApp(page);
    await page.getByRole('button', {name:/Estoy planeando un evento/i}).click();
    await expect(page.locator('#journeyModal')).toHaveClass(/open/);
    await page.getByRole('button', {name:/Boda/i}).click();
    await page.locator('#journeyNext').click();
    await page.locator('#eventGuests').fill('50');
    await page.getByRole('button', {name:'2 por persona'}).click();
    await expect(page.locator('#eventTarget')).toHaveValue('100');
    await page.locator('#journeyNext').click();
    await page.getByRole('button', {name:/Mix para brindar/i}).click();
    await page.locator('#journeyNext').click();
    await page.locator('#venueUnknown').check();
    await page.locator('#dateUnknown').check();
    await page.locator('#timeUnknown').check();
    await page.locator('#journeyNext').click();
    await expect(page.locator('[data-screen="menu"]')).toHaveClass(/active/);
    await expect(page.getByText(/100 bebidas para 50 personas/i)).toBeVisible();

    await addProduct(page, 'Clericot', 50);
    await page.locator('#startCheckout').click();
    await page.locator('#checkoutNext').click();
    await page.getByRole('button', {name:/Lata ANTOJO/i}).click();
    await page.locator('#adultField').check();
    await page.locator('#checkoutNext').click();
    await completeContactAndSubmit(page);

    await page.getByRole('button', {name:/Volver al inicio/i}).click();
    await page.getByRole('button', {name:/Quiero latas con frase o logo/i}).click();
    await page.getByRole('button', {name:/Frase o nombre/i}).click();
    await page.locator('#journeyNext').click();
    await page.getByRole('button', {name:/Regalo/i}).click();
    await page.locator('[data-custom-qty="25"]').click();
    await page.locator('#journeyNext').click();
    await page.locator('#customIdea').fill('FELIZ CUMPLE');
    await page.locator('#journeyNext').click();
    await addProduct(page, 'Horchata', 25);
    await page.locator('#startCheckout').click();
    await page.locator('#checkoutNext').click();
    await expect(page.locator('.personalizer-overlay.phrase')).toBeVisible();
    await expect(page.locator('.personalizer-overlay.phrase span')).toHaveText('FELIZ CUMPLE');
    await expect(page.locator('#phraseSizeField')).toBeVisible();
    expect(errors).toEqual([]);
  });
});

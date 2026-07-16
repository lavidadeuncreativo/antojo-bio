(()=>{
  'use strict';

  const A = window.ANTOJO = window.ANTOJO || {};
  A.VERSION = 'clean-2.0.0';
  A.STORAGE_KEY = 'antojo_clean_state_v2';
  A.ONBOARDING_KEY = 'antojo_clean_onboarding_seen';
  A.LAST_KEY = 'antojo_clean_last_registration_v2';
  A.PENDING_KEY = 'antojo_clean_pending_v2';
  A.SESSION_KEY = 'antojo_clean_session_v2';
  A.WHATSAPP = '525522026291';
  A.INSTAGRAM = 'https://www.instagram.com/antojo.bebidas/';

  A.$ = (selector, root = document) => root.querySelector(selector);
  A.$$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  A.escape = (value = '') => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  A.money = value => new Intl.NumberFormat('es-MX', {style:'currency', currency:'MXN', maximumFractionDigits:0}).format(Number(value || 0));
  A.parse = (value, fallback = null) => { try { return JSON.parse(value); } catch { return fallback; } };
  A.normalize = (value = '') => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  A.clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value || 0)));
  A.round5 = value => Math.max(5, Math.round(Number(value || 0) / 5) * 5);
  A.nowIso = () => new Date().toISOString();
  A.cdmxTime = value => new Intl.DateTimeFormat('es-MX', {timeZone:'America/Mexico_City', dateStyle:'medium', timeStyle:'short'}).format(new Date(value || Date.now()));
  A.uuid = () => crypto?.randomUUID?.() || `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  A.CATEGORIES = [
    {id:'all', label:'Todas'},
    {id:'alcohol', label:'Con alcohol'},
    {id:'zero', label:'Sin alcohol'},
    {id:'coffee', label:'Café y cremosas'}
  ];

  const assets = '/assets/renders/';
  A.PRODUCTS = [
    {id:'margarita-mezcal',name:'Margarita con mezcal',category:'alcohol',categoryLabel:'Con alcohol',image:`${assets}margarita.webp`,description:'Cítrica, fresca y con un golpe ahumado.',friendly:'Para brindar',alcohol:true,caffeine:false,dairy:false,bg:'#eef2da'},
    {id:'mojito-clasico',name:'Mojito clásico',category:'alcohol',categoryLabel:'Con alcohol',image:`${assets}mojito-clasico.webp`,description:'Limón, hierbabuena y mezcal.',friendly:'Fresco y herbal',alcohol:true,caffeine:false,dairy:false,bg:'#e8f0df'},
    {id:'mojito-mariposa',name:'Mojito mariposa',category:'alcohol',categoryLabel:'Con alcohol',image:`${assets}mojito-mariposa.webp`,description:'Té mariposa, limón verde y mezcal.',friendly:'Visual y cítrico',alcohol:true,caffeine:false,dairy:false,bg:'#eee9ee'},
    {id:'mezcalita-jamaica',name:'Mezcalita de jamaica',category:'alcohol',categoryLabel:'Con alcohol',image:`${assets}jamaica.webp`,description:'Jamaica ácida, limón y mezcal.',friendly:'Intensa y fresca',alcohol:true,caffeine:false,dairy:false,bg:'#f3e3de'},
    {id:'pepino-mezcal',name:'Pepino limón con mezcal',category:'alcohol',categoryLabel:'Con alcohol',image:`${assets}pepino.webp`,description:'Pepino, limón y mezcal.',friendly:'Ligera y refrescante',alcohol:true,caffeine:false,dairy:false,bg:'#e8eee2'},
    {id:'maracuya-mezcal',name:'Maracuyá con mezcal',category:'alcohol',categoryLabel:'Con alcohol',image:`${assets}maracuya.webp`,description:'Maracuyá tropical, limón y mezcal.',friendly:'Tropical',alcohol:true,caffeine:false,dairy:false,bg:'#f3ead9'},
    {id:'clericot',name:'Clericot',category:'alcohol',categoryLabel:'Con alcohol',image:`${assets}clericot.webp`,description:'Fruta, vino y un perfil fácil de compartir.',friendly:'Para celebración',alcohol:true,caffeine:false,dairy:false,bg:'#f1e1dc'},
    {id:'carajillo',name:'Carajillo',category:'coffee',categoryLabel:'Café · con alcohol',image:`${assets}carajillo.webp`,description:'Café intenso con licor.',friendly:'Sobremesa',alcohol:true,caffeine:true,dairy:false,bg:'#e9e3dc'},
    {id:'mojito-mocktail',name:'Mojito sin alcohol',category:'zero',categoryLabel:'Sin alcohol',image:`${assets}mojito-clasico.webp`,description:'Limón y hierbabuena, sin alcohol.',friendly:'Fresco y herbal',alcohol:false,caffeine:false,dairy:false,bg:'#e8f0df'},
    {id:'mariposa-mocktail',name:'Mariposa limón',category:'zero',categoryLabel:'Sin alcohol',image:`${assets}mojito-mariposa.webp`,description:'Té mariposa con limón verde.',friendly:'Cambia de color',alcohol:false,caffeine:false,dairy:false,bg:'#eee9ee'},
    {id:'jamaica-limon',name:'Jamaica limón',category:'zero',categoryLabel:'Sin alcohol',image:`${assets}jamaica.webp`,description:'Jamaica, limón y un toque fresco.',friendly:'Ácida y ligera',alcohol:false,caffeine:false,dairy:false,bg:'#f3e3de'},
    {id:'pepino-limon',name:'Pepino limón',category:'zero',categoryLabel:'Sin alcohol',image:`${assets}pepino.webp`,description:'Pepino y limón, sin alcohol.',friendly:'Muy refrescante',alcohol:false,caffeine:false,dairy:false,bg:'#e8eee2'},
    {id:'maracuya-limon',name:'Maracuyá limón',category:'zero',categoryLabel:'Sin alcohol',image:`${assets}maracuya.webp`,description:'Maracuyá y limón, sin alcohol.',friendly:'Tropical y brillante',alcohol:false,caffeine:false,dairy:false,bg:'#f3ead9'},
    {id:'horchata',name:'Horchata',category:'coffee',categoryLabel:'Cremosa · sin alcohol',image:`${assets}horchata.webp`,description:'Horchata fría, suave y especiada.',friendly:'Clásica',alcohol:false,caffeine:false,dairy:true,bg:'#ede7df'},
    {id:'espresso-horchata',name:'Espresso horchata',category:'coffee',categoryLabel:'Café · sin alcohol',image:`${assets}espresso-horchata.webp`,description:'Horchata fría con espresso.',friendly:'Cremosa e intensa',alcohol:false,caffeine:true,dairy:true,bg:'#e8e1da'},
    {id:'americano',name:'Americano frío',category:'coffee',categoryLabel:'Café · sin alcohol',image:`${assets}americano.webp`,description:'Café negro frío, directo y ligero.',friendly:'El mañanero',alcohol:false,caffeine:true,dairy:false,bg:'#e7e3dd'},
    {id:'cold-brew',name:'Cold brew vainilla',category:'coffee',categoryLabel:'Café · sin alcohol',image:`${assets}cold-brew.webp`,description:'Cold brew con vainilla.',friendly:'Suave y aromático',alcohol:false,caffeine:true,dairy:false,bg:'#eae4dd'},
    {id:'latte',name:'Latte frío',category:'coffee',categoryLabel:'Café · sin alcohol',image:`${assets}latte.webp`,description:'Café con leche, frío y cremoso.',friendly:'Fácil de tomar',alcohol:false,caffeine:true,dairy:true,bg:'#ece6df'}
  ];

  A.FAQS = [
    ['¿Cómo nació ANTOJO.?','Nació como un proyecto para vender bebidas frías listas para tomar y construir algo propio paso a paso. Nos gusta enseñar el proceso real, mejorar con cada pedido y crecer sin aparentar algo que todavía no somos.'],
    ['¿Por qué casi siempre entregan fines de semana?','Hoy concentramos producción y entregas durante el fin de semana para cuidar mejor cada lote. Los pedidos entre semana se pueden coordinar según fecha, cantidad y disponibilidad.'],
    ['¿Cuánto duran las bebidas?','Deben mantenerse refrigeradas. La duración depende de la receta, así que al confirmar tu pedido te indicamos el mejor rango de consumo para cada sabor. Recomendamos tomarlas lo más frescas posible.'],
    ['¿Qué precio tienen?','De 1 a 5 piezas cuestan $65 c/u; de 6 a 10, $60 c/u; de 11 a 20, $58 c/u; y de 21 a 49, $55 c/u. Los pedidos de 50 o más piezas se cotizan según cantidad, fecha, sabores, personalización y entrega.'],
    ['¿Puedo combinar sabores?','Sí. Puedes sumar o quitar cada bebida individualmente. Para eventos recomendamos elegir dos o tres sabores principales para cuidar producción, presentación y tiempos.'],
    ['¿Puedo pedirlas con frase, logo o identidad?','Sí. Puedes solicitar una frase, nombres, fecha, logo o concepto visual. La vista de la página es una referencia y el arte final se revisa contigo antes de producir.'],
    ['¿Puedo recoger o pedir entrega?','Puedes recoger por la zona WTC · Polyforum. También hay entrega a domicilio desde 10 bebidas. El costo se estima con tu zona y se confirma antes de cerrar el pedido.'],
    ['¿Cómo se confirma un evento?','Primero registramos la solicitud y revisamos disponibilidad, logística y precio. Cuando todo está definido, la confirmación se realiza con 50% de anticipo.']
  ];

  A.defaultState = () => ({
    screen:'home', journey:'', category:'all', search:'', cart:{},
    eventType:'', eventGuests:50, eventCoverage:1.5, eventTarget:75, eventService:'Solo bebidas', eventVenue:'', eventVenueUnknown:false,
    date:'', time:'', dateUnknown:false, timeUnknown:false,
    customType:'logo', customUse:'Evento', customIdea:'',
    fulfillment:'', address:'', shippingFee:0, shippingZone:'', shippingEta:'',
    personalization:'normal', personalizationText:'', logoData:'', logoName:'', logoMime:'',
    occasion:'', name:'', phone:'', notes:'', adultConfirmed:false, consent:false,
    checkoutStep:0, folio:'', requestFingerprint:'', registrationStatus:''
  });

  const saved = A.parse(localStorage.getItem(A.STORAGE_KEY), null);
  A.state = saved?.state && Date.now() - Number(saved.savedAt || 0) < 30 * 864e5
    ? {...A.defaultState(), ...saved.state, cart:{...(saved.state.cart || {})}, screen:'home', checkoutStep:0, registrationStatus:''}
    : A.defaultState();

  A.persist = () => {
    const snapshot = {...A.state, screen:'home', checkoutStep:0};
    try {
      localStorage.setItem(A.STORAGE_KEY, JSON.stringify({version:A.VERSION, savedAt:Date.now(), state:snapshot}));
    } catch {
      snapshot.logoData = '';
      localStorage.setItem(A.STORAGE_KEY, JSON.stringify({version:A.VERSION, savedAt:Date.now(), state:snapshot}));
    }
  };
  if (!localStorage.getItem(A.SESSION_KEY)) localStorage.setItem(A.SESSION_KEY, A.uuid());

  A.product = id => A.PRODUCTS.find(item => item.id === id);
  A.cartItems = () => Object.entries(A.state.cart).map(([id, qty]) => ({...A.product(id), qty:Number(qty)})).filter(item => item.id && item.qty > 0);
  A.totalQty = () => A.cartItems().reduce((sum, item) => sum + item.qty, 0);
  A.hasAlcohol = () => A.cartItems().some(item => item.alcohol);
  A.isQuote = () => ['event','custom'].includes(A.state.journey) || A.totalQty() >= 50 || A.state.personalization !== 'normal';
  A.pricePlan = (qty = A.totalQty()) => {
    const q = Number(qty || 0);
    if (q <= 5) return {unit:65, band:'1–5 piezas'};
    if (q <= 10) return {unit:60, band:'6–10 piezas'};
    if (q <= 20) return {unit:58, band:'11–20 piezas'};
    if (q <= 49) return {unit:55, band:'21–49 piezas'};
    if (q <= 99) return {unit:53, band:'50–99 piezas', reference:true};
    if (q <= 149) return {unit:52, band:'100–149 piezas', reference:true};
    return {unit:50, band:'150+ piezas', reference:true};
  };
  A.personalReference = qty => Number(qty || 0) < 100 ? 65 : Number(qty || 0) < 150 ? 62 : 60;
  A.totalEstimate = () => A.isQuote() ? null : A.totalQty() * A.pricePlan().unit + Number(A.state.shippingFee || 0);

  A.estimateShipping = address => {
    const text = A.normalize(address);
    const cp = (text.match(/\b\d{5}\b/) || [])[0] || '';
    const zones = [
      {name:'Zona cercana',fee:55,eta:'25–40 min',prefix:['03'],words:['del valle','napoles','narvarte','wtc','xoco','acacias','portales','alamos','san pedro de los pinos']},
      {name:'Zona media',fee:75,eta:'35–55 min',prefix:['06','04'],words:['roma','condesa','juarez','doctores','centro','coyoacan','mixcoac','escandon','tacubaya']},
      {name:'Zona extendida',fee:95,eta:'45–70 min',prefix:['01','11'],words:['polanco','anzures','san angel','observatorio','reforma','miguel hidalgo','alvaro obregon']},
      {name:'Zona amplia',fee:115,eta:'55–85 min',prefix:['08','15'],words:['iztacalco','aeropuerto','venustiano carranza']},
      {name:'Zona lejana',fee:145,eta:'70–110 min',prefix:['07','09','14','16'],words:['lindavista','iztapalapa','tlalpan','xochimilco','gustavo a madero']},
      {name:'Zona especial',fee:170,eta:'Por confirmar',prefix:['05','12'],words:['santa fe','cuajimalpa','interlomas']}
    ];
    const match = zones.find(zone => (cp && zone.prefix.some(prefix => cp.startsWith(prefix))) || zone.words.some(word => text.includes(word)));
    const result = match || {name:'Zona por confirmar', fee:0, eta:'Revisión manual'};
    Object.assign(A.state, {address:String(address || '').trim(), shippingFee:result.fee, shippingZone:result.name, shippingEta:result.eta});
    A.persist();
    return result;
  };

  A.generateFolio = () => {
    const date = new Date();
    const stamp = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
    return `ANT-${stamp}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
  };
})();

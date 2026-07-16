(()=>{
  'use strict';
  const CELL_WIDTH = 60;
  const CELL_HEIGHT = 119;
  const SOURCES = ['margarita','mojito-clasico','mojito-mariposa','horchata','espresso-horchata','americano','pepino','clericot','maracuya','latte','cold-brew','carajillo','jamaica'];
  const PRODUCT_SOURCE = {
    'margarita-mezcal':'margarita',
    'mojito-clasico':'mojito-clasico',
    'mojito-mocktail':'mojito-clasico',
    'mojito-mariposa':'mojito-mariposa',
    'mariposa-mocktail':'mojito-mariposa',
    'horchata':'horchata',
    'espresso-horchata':'espresso-horchata',
    'americano':'americano',
    'pepino-mezcal':'pepino',
    'pepino-limon':'pepino',
    'clericot':'clericot',
    'maracuya-mezcal':'maracuya',
    'maracuya-limon':'maracuya',
    'latte':'latte',
    'cold-brew':'cold-brew',
    'carajillo':'carajillo',
    'mezcalita-jamaica':'jamaica',
    'jamaica-limon':'jamaica'
  };

  window.ANTOJO_RENDER_READY = new Promise((resolve, reject) => {
    const encoded = window.ANTOJO_RENDER_SPRITE || '';
    if (!encoded) return reject(new Error('Render sprite data is missing.'));
    const image = new Image();
    image.onerror = () => reject(new Error('Render sprite could not be decoded.'));
    image.onload = () => {
      try {
        const map = {};
        SOURCES.forEach((name, index) => {
          const canvas = document.createElement('canvas');
          canvas.width = 240;
          canvas.height = 476;
          const context = canvas.getContext('2d');
          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = 'high';
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, index * CELL_WIDTH, 0, CELL_WIDTH, CELL_HEIGHT, 0, 0, canvas.width, canvas.height);
          map[name] = canvas.toDataURL('image/webp', .9);
        });
        window.ANTOJO_RENDER_MAP = map;
        const app = window.ANTOJO;
        if (app?.PRODUCTS) {
          app.PRODUCTS.forEach(product => {
            const source = PRODUCT_SOURCE[product.id];
            if (source && map[source]) product.image = map[source];
          });
        }
        window.ANTOJO_RENDER_SPRITE = '';
        resolve(map);
      } catch (error) { reject(error); }
    };
    image.src = `data:image/webp;base64,${encoded}`;
  });
})();

(() => {
  'use strict';

  try {
    if (!localStorage.getItem('antojo-mood-v2')) {
      localStorage.removeItem('antojo-mood-v1');
    }
  } catch {
    // Storage is optional; the new system still defaults to blanco editorial.
  }
})();

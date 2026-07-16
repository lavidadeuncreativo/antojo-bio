(()=>{
  'use strict';
  const A = window.ANTOJO;
  const inherited = A.buildPayload;
  const occasionMap = {
    'Fin de semana':'fin',
    'Oficina':'office',
    'Cumpleaños pequeño':'birthday',
    'Reunión':'Otro',
    'Regalo':'Otro',
    'Otro':'Otro'
  };
  const packageMap = {
    'Solo bebidas':'Solo bebidas',
    'Mix sin alcohol':'Mix sin alcohol',
    'Mix para brindar':'Mix con alcohol',
    'Café y sobremesa':'Café y sobremesa',
    'Barra o montaje':'Barra ANTOJO.',
    'Personalizado':'Personalizado'
  };
  A.buildPayload = () => {
    const payload = inherited();
    payload.occasion = A.state.journey === 'event' ? 'event' : (occasionMap[A.state.occasion] || A.state.occasion || 'Otro');
    payload.eventPackage = A.state.journey === 'custom' ? 'Personalizado' : (packageMap[A.state.eventService] || payload.eventPackage || 'Solo bebidas');
    return payload;
  };
})();

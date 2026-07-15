window.ANTOJO_RENDERS=window.ANTOJO_RENDERS||{};
(()=>{
  const drinks={
    'mariposa-mocktail':['Mojito mariposa','#372b9e','#936ce6','#f5df55'],
    'jamaica-limon':['Jamaica limón','#74152c','#d64055','#ffcb64'],
    'pepino-limon':['Pepino limón','#327a4b','#9bd469','#d9efab'],
    'maracuya-limon':['Maracuyá limón','#df7c12','#ffc83f','#fff09a'],
    'horchata':['Horchata','#c7a67c','#f0ddbf','#8a5738'],
    'espresso-horchata':['Espresso horchata','#75503a','#d3aa7a','#f0ddbf'],
    'americano':['Americano','#2f1710','#74412c','#cf9b6a'],
    'cold-brew':['Cold brew vainilla','#321c13','#98603d','#e9b56f'],
    'latte':['Latte frío','#9d7654','#ead2ad','#fff3df'],
    'carajillo':['Carajillo','#3a1b11','#9d542e','#e89a52']
  };
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const render=(label,a,b,accent)=>{
    const bubbles=Array.from({length:28},(_,i)=>`<circle cx="${65+(i*43)%180}" cy="${105+(i*67)%470}" r="${2+(i%5)}" fill="#fff" opacity="${.14+(i%4)*.06}"/>`).join('');
    const garnish=`<g opacity=".82"><circle cx="85" cy="132" r="28" fill="none" stroke="${accent}" stroke-width="10"/><path d="M65 132h40M85 112v40" stroke="${accent}" stroke-width="4"/><ellipse cx="226" cy="560" rx="37" ry="18" fill="${accent}" opacity=".72"/></g>`;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 720"><defs><linearGradient id="body" x1="0" x2="1"><stop stop-color="${a}"/><stop offset=".48" stop-color="${b}"/><stop offset="1" stop-color="${a}"/></linearGradient><linearGradient id="shine" x1="0" x2="1"><stop stop-color="#fff" stop-opacity=".42"/><stop offset=".16" stop-color="#fff" stop-opacity=".04"/><stop offset=".8" stop-color="#000" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity=".18"/></linearGradient><filter id="shadow"><feDropShadow dx="0" dy="18" stdDeviation="15" flood-opacity=".28"/></filter></defs><g filter="url(#shadow)"><rect x="39" y="25" width="242" height="670" rx="47" fill="url(#body)"/><rect x="39" y="25" width="242" height="670" rx="47" fill="url(#shine)"/>${bubbles}${garnish}<ellipse cx="160" cy="38" rx="111" ry="25" fill="#e9e9e9"/><ellipse cx="160" cy="40" rx="82" ry="14" fill="#aaa"/><ellipse cx="160" cy="44" rx="68" ry="8" fill="#555" opacity=".55"/><rect x="55" y="652" width="210" height="25" rx="13" fill="#ddd" opacity=".82"/><text x="160" y="370" fill="#fff" font-family="Helvetica Neue,Arial" font-size="54" font-weight="800" text-anchor="middle" transform="rotate(-90 160 370)" letter-spacing="2">ANTOJO.</text><text x="160" y="622" fill="#fff" font-family="Helvetica Neue,Arial" font-size="18" font-weight="700" text-anchor="middle">${esc(label)}</text></g></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };
  Object.entries(drinks).forEach(([id,[label,a,b,accent]])=>{if(!window.ANTOJO_RENDERS[id])window.ANTOJO_RENDERS[id]=render(label,a,b,accent)});
})();
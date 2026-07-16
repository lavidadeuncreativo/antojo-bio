window.ANTOJO_RENDERS=window.ANTOJO_RENDERS||{};
(()=>{
  const r=window.ANTOJO_RENDERS;
  const copy=(target,source)=>{if(r[source])r[target]=r[source]};
  copy('mojito-mocktail','mojito-clasico');
  copy('mariposa-mocktail','mojito-mariposa');
  copy('jamaica-limon','mezcalita-jamaica');
  copy('pepino-limon','pepino-mezcal');
  copy('maracuya-limon','maracuya-mezcal');
})();

const {getPricing,getDateStatus,mexicoDateISO}=require('../pricing');

const NOTION_VERSION='2026-03-11';
const DEFAULT_DATA_SOURCE_ID='119298bb-476d-40f3-b8f0-eab4c5bd5d8a';
const requestsByIp=new Map();
const PRODUCT_NAMES={
  'mojito-clasico':'Mojito clásico',
  'mojito-mariposa':'Mojito mariposa',
  'mezcalita-jamaica':'Mezcalita de jamaica',
  'margarita-mezcal':'Margarita de mezcal',
  'pepino-mezcal':'Pepino-limón con mezcal',
  'maracuya-mezcal':'Maracuyá con mezcal',
  clericot:'Clericot',
  'mojito-mocktail':'Mojito clásico mocktail',
  'mariposa-mocktail':'Mojito mariposa mocktail',
  'jamaica-limon':'Jamaica-limón',
  'pepino-limon':'Pepino-limón',
  'maracuya-limon':'Maracuyá-limón',
  horchata:'Horchata clásica',
  'espresso-horchata':'Espresso horchata',
  americano:'Americano',
  'cold-brew':'Cold brew vainilla',
  latte:'Latte frío',
  carajillo:'Carajillo'
};

function sendJson(res,status,body){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(body))}
function clean(value,max=2000){return String(value??'').replace(/[\u0000-\u001F\u007F]/g,' ').trim().slice(0,max)}
function markdownText(value,max=2000){return clean(value,max).replace(/([\\`*_{}\[\]()#+\-.!>|])/g,'\\$1')}
function richText(value){const content=clean(value);return{rich_text:content?[{type:'text',text:{content}}]:[]}}
function title(value){return{title:[{type:'text',text:{content:clean(value,200)||'Pedido web'}}]}}
function numberProperty(value){if(value===null||value===undefined||value==='')return{number:null};const parsed=Number(value);return{number:Number.isFinite(parsed)?parsed:null}}
function getBody(req){if(req.body&&typeof req.body==='object')return req.body;if(typeof req.body==='string'){try{return JSON.parse(req.body)}catch{return null}}return null}
function allowedOrigin(req){const origin=req.headers.origin;if(!origin)return true;const configured=clean(process.env.ALLOWED_ORIGINS||'',1000).split(',').map(v=>v.trim()).filter(Boolean);if(configured.includes(origin))return true;try{return new URL(origin).host===clean(req.headers['x-forwarded-host']||req.headers.host,300)}catch{return false}}
function rateLimited(req){const ip=clean((req.headers['x-forwarded-for']||'').split(',')[0]||req.socket?.remoteAddress||'unknown',100),now=Date.now(),windowMs=15*60*1000,current=requestsByIp.get(ip)||{startedAt:now,count:0};if(now-current.startedAt>windowMs){requestsByIp.set(ip,{startedAt:now,count:1});return false}current.count+=1;requestsByIp.set(ip,current);return current.count>12}
function positiveInteger(value){const parsed=Number(value);return Number.isInteger(parsed)&&parsed>0?parsed:null}
function isHttpUrl(value){if(!value)return true;try{const url=new URL(value);return url.protocol==='http:'||url.protocol==='https:'}catch{return false}}
function normalizeItems(items){return items.map(item=>({id:clean(item.id,80),name:PRODUCT_NAMES[clean(item.id,80)]||'',qty:positiveInteger(item.qty),alcohol:Boolean(item.alcohol)}))}
function validate(payload){
  if(!payload||typeof payload!=='object')return{error:'Solicitud inválida.'};
  if(clean(payload.website))return{error:'Solicitud inválida.'};
  if(!/^ANT-\d{8}-[A-Z0-9]{4,8}$/.test(clean(payload.folio,40)))return{error:'Folio inválido.'};
  if(clean(payload.name,120).length<2)return{error:'Nombre inválido.'};
  const phone=clean(payload.phone,40);if(!/^\+?[\d\s().-]{10,40}$/.test(phone)||phone.replace(/\D/g,'').length<10)return{error:'Teléfono inválido.'};
  if(payload.consent!==true)return{error:'Se requiere consentimiento.'};
  if(!['order','quote'].includes(payload.type))return{error:'Tipo inválido.'};
  if(!Array.isArray(payload.items)||payload.items.length<1||payload.items.length>18)return{error:'Productos inválidos.'};
  const items=normalizeItems(payload.items),ids=new Set();
  for(const item of items){if(!item.id||!item.name||!item.qty||item.qty>2000||ids.has(item.id))return{error:'Productos inválidos.'};ids.add(item.id)}
  const units=items.reduce((sum,item)=>sum+item.qty,0);if(units<1||units>2000)return{error:'Cantidad inválida.'};
  const targetQuantity=positiveInteger(payload.targetQuantity)||units;if(targetQuantity>2000)return{error:'Cantidad objetivo inválida.'};
  const personalized=['phrase','logo'].includes(payload.personalization);
  if(!['normal','phrase','logo'].includes(payload.personalization))return{error:'Personalización inválida.'};
  if(personalized&&targetQuantity<50)return{error:'La personalización está disponible a partir de 50 piezas.'};
  if(payload.type==='quote'&&units!==targetQuantity)return{error:'La selección debe coincidir con la cantidad objetivo.'};
  const pricing=getPricing(targetQuantity,personalized);if(!pricing.isValid)return{error:pricing.error||'Cantidad inválida.'};
  if(!['wtc','delivery','special_event_logistics'].includes(payload.fulfillment))return{error:'Método de entrega inválido.'};
  if(payload.fulfillment==='delivery'&&units<10)return{error:'La entrega está disponible desde 10 bebidas.'};
  if(payload.fulfillment==='delivery'&&(!clean(payload.address,500)||!clean(payload.neighborhood,200)))return{error:'Completa la dirección y colonia o referencia.'};
  if(clean(payload.postalCode,10)&&!/^\d{5}$/.test(clean(payload.postalCode,10)))return{error:'Código postal inválido.'};
  if(!isHttpUrl(clean(payload.mapsLink,700)))return{error:'Enlace de Google Maps inválido.'};
  if(items.some(item=>item.alcohol)&&payload.adultConfirmed!==true)return{error:'Se requiere confirmación de mayoría de edad.'};
  if(clean(payload.logoData,1200000).length>1000000)return{error:'El logo es demasiado grande.'};
  let dateStatus={isValid:true,isUrgent:false,needsReview:false,message:''};
  if(!payload.dateUnknown){dateStatus=getDateStatus(clean(payload.requiredDate,20),personalized,mexicoDateISO());if(!dateStatus.isValid)return{error:dateStatus.message}}
  const needsReview=Boolean(pricing.needsHumanReview||dateStatus.needsReview||payload.fulfillment==='special_event_logistics'||payload.needsReview);
  const reviewReasons=[pricing.needsHumanReview?'Cantidad mayor a 1,000 piezas':'',dateStatus.isUrgent?'Anticipación menor a la recomendada':'',payload.fulfillment==='special_event_logistics'?'Logística especial':'',clean(payload.reviewReason,500)].filter(Boolean);
  return{error:null,items,units,targetQuantity,personalized,pricing,dateStatus,needsReview,reviewReason:[...new Set(reviewReasons)].join(' · ')};
}
function notionJson(path,token,options={}){return fetch(`https://api.notion.com${path}`,{...options,headers:{Authorization:`Bearer ${token}`,'Notion-Version':NOTION_VERSION,'Content-Type':'application/json',...(options.headers||{})}})}
async function findExisting(folio,token,dataSourceId){try{const response=await notionJson(`/v1/data_sources/${dataSourceId}/query`,token,{method:'POST',body:JSON.stringify({page_size:1,filter:{property:'Folio',rich_text:{equals:folio}}})});if(!response.ok)return null;const data=await response.json();return data.results?.[0]||null}catch{return null}}
function dateProperty(value,includeTime=false){const text=clean(value,50);if(!text)return{date:null};const date=new Date(text);if(Number.isNaN(date.getTime()))return{date:null};return{date:{start:includeTime?date.toISOString():text.slice(0,10)}}}
function mexicoTime(value){const date=new Date(value);if(Number.isNaN(date.getTime()))return'';return new Intl.DateTimeFormat('es-MX',{timeZone:'America/Mexico_City',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true}).format(date)}
function mapDelivery(value){return({wtc:'Recoger en WTC',delivery:'Domicilio',special_event_logistics:'Logística para evento'})[value]||'Logística para evento'}
function mapOccasion(value){return({fin:'Para el fin',event:'Evento',office:'Oficina',birthday:'Cumple'})[value]||'Otro'}
function mapPersonalization(value){return({normal:'Normal',phrase:'Nombre o frase',logo:'Logo o concepto'})[value]||'Normal'}
function mapEventPackage(value){return({'Combinación libre':'Solo bebidas','Principalmente sin alcohol':'Mix sin alcohol','Para brindar':'Mix con alcohol','Café y sobremesa':'Café y sobremesa'})[clean(value,100)]||'Solo bebidas'}
function safeSelect(value,allowed,fallback){const cleaned=clean(value,100);return allowed.includes(cleaned)?cleaned:fallback}
async function uploadLogo(payload,token){const dataUrl=clean(payload.logoData,1000000);if(!dataUrl)return null;const match=dataUrl.match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/);if(!match)throw new Error('Formato de logo inválido.');const mime=match[1],buffer=Buffer.from(match[2],'base64');if(buffer.length>750000)throw new Error('El logo optimizado supera el límite.');const extension=mime==='image/jpeg'?'jpg':mime.split('/')[1],filename=clean(payload.logoName,120)||`logo-${payload.folio}.${extension}`;const create=await notionJson('/v1/file_uploads',token,{method:'POST',body:JSON.stringify({mode:'single_part',filename,content_type:mime})});const created=await create.json().catch(()=>({}));if(!create.ok||!created.id)throw new Error(created.message||'No pudimos preparar el logo.');const form=new FormData();form.append('file',new Blob([buffer],{type:mime}),filename);const sent=await fetch(`https://api.notion.com/v1/file_uploads/${created.id}/send`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Notion-Version':NOTION_VERSION},body:form});const sentData=await sent.json().catch(()=>({}));if(!sent.ok)throw new Error(sentData.message||'No pudimos guardar el logo.');return{id:created.id,filename}}

module.exports=async function handler(req,res){
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS')return sendJson(res,204,{});if(req.method!=='POST')return sendJson(res,405,{ok:false,error:'Método no permitido.'});if(!allowedOrigin(req))return sendJson(res,403,{ok:false,error:'Origen no permitido.'});if(rateLimited(req))return sendJson(res,429,{ok:false,error:'Demasiadas solicitudes. Intenta nuevamente en unos minutos.'});
  const token=process.env.NOTION_TOKEN,dataSourceId=clean(process.env.NOTION_DATA_SOURCE_ID||process.env.NOTION_DATABASE_ID||DEFAULT_DATA_SOURCE_ID,100);if(!token)return sendJson(res,503,{ok:false,code:'NOTION_NOT_CONFIGURED',error:'El registro de pedidos todavía no está disponible.'});
  const payload=getBody(req),validation=validate(payload);if(validation.error)return sendJson(res,400,{ok:false,error:validation.error});
  const folio=clean(payload.folio,40),existing=await findExisting(folio,token,dataSourceId);if(existing)return sendJson(res,200,{ok:true,duplicate:true,folio,notionUrl:existing.url,pageId:existing.id});
  const {items,units,targetQuantity,pricing,dateStatus,needsReview,reviewReason}=validation,flavors=items.map(item=>`${item.qty} × ${item.name}`).join(' · '),createdAt=payload.createdAt||new Date().toISOString(),submittedTime=mexicoTime(createdAt),requestType=payload.type==='quote'?'Cotización':'Pedido',requestTitle=`${folio} · ${clean(payload.name,90)}`,utm=payload.utm||{},deliveryAddress=[clean(payload.address,500),clean(payload.neighborhood,200),clean(payload.postalCode,10)].filter(Boolean).join(', '),operationalNotes=[clean(payload.notes,1200),`Rango: ${pricing.rangeName}`,pricing.deposit!==null?`Anticipo: $${pricing.deposit}`:'Anticipo: por confirmar',pricing.balance!==null?`Saldo: $${pricing.balance}`:'Saldo: por confirmar',needsReview?`Revisión: ${reviewReason||'Sí'}`:''].filter(Boolean).join(' · ');
  try{
    const logoUpload=await uploadLogo(payload,token);
    const properties={
      'Solicitud':title(requestTitle),'Folio':richText(folio),'Estado':{select:{name:'Registrada'}},'Tipo':{select:{name:requestType}},'Origen':{select:{name:'Web app'}},'Fecha solicitud':dateProperty(createdAt,true),'Hora solicitud':richText(submittedTime),'Fecha requerida':dateProperty(payload.requiredDate),'Fecha por definir':{checkbox:Boolean(payload.dateUnknown)},'Nombre':richText(payload.name),'Teléfono':{phone_number:clean(payload.phone,40)||null},'Unidades':numberProperty(units),'Cantidad objetivo':numberProperty(targetQuantity),'Sabores':richText(flavors),'Entrega':{select:{name:mapDelivery(payload.fulfillment)}},'Dirección':richText(deliveryAddress||payload.address),'Envío estimado':numberProperty(null),'Ocasión':{select:{name:mapOccasion(payload.occasion)}},'Personalización':{select:{name:mapPersonalization(payload.personalization)}},'Detalle personalización':richText(payload.personalizationText),'Precio unitario':numberProperty(pricing.unitPrice),'Total estimado':numberProperty(pricing.subtotal),'Notas':richText(operationalNotes),'UTM Source':richText(utm.source),'UTM Medium':richText(utm.medium),'UTM Campaign':richText(utm.campaign),'Consentimiento':{checkbox:true},'WhatsApp abierto':{checkbox:false},'Seguimiento':dateProperty(createdAt,true),
      'Tipo de evento':{select:{name:safeSelect(payload.eventType,['Boda','Cumpleaños','Evento corporativo','Activación de marca','Reunión privada','Otro'],'Otro')}},'Personas':numberProperty(payload.eventGuests),'Lugar':richText(payload.eventVenueName||payload.eventVenue),'Google Place ID':richText(payload.eventPlaceId),'Coordenadas':richText(payload.eventLat&&payload.eventLng?`${payload.eventLat},${payload.eventLng}`:''),'Paquete':{select:{name:mapEventPackage(payload.eventPackage)}}
    };
    if(payload.type!=='quote'){delete properties['Tipo de evento'];delete properties['Personas'];delete properties['Lugar'];delete properties['Google Place ID'];delete properties['Coordenadas'];delete properties['Paquete']}
    if(logoUpload)properties.Logo={files:[{name:logoUpload.filename,type:'file_upload',file_upload:{id:logoUpload.id}}]};
    const details=items.map(item=>`- **${item.qty}** × ${markdownText(item.name,120)}`).join('\n'),eventSection=payload.type==='quote'?`\n## Evento o solicitud especial\n\n- Tipo: ${markdownText(payload.eventType,120)||'Por definir'}\n- Personas: ${Number(payload.eventGuests)||'Por definir'}\n- Paquete: ${markdownText(mapEventPackage(payload.eventPackage),120)}\n- Lugar: ${payload.eventVenueUnknown?'Por definir':markdownText(payload.eventVenue,500)||'Por definir'}\n- Fecha: ${payload.dateUnknown?'Por definir':markdownText(payload.requiredDate,40)||'Por definir'} ${markdownText(payload.requiredTime,20)}\n`:'';
    const markdown=`## Registro desde la web app\n\n**Folio:** ${folio}\n\n**Estado:** Solicitud registrada, no confirmada\n\n**Tipo:** ${requestType}\n\n**Contacto:** ${markdownText(payload.name,120)} · ${markdownText(payload.phone,40)}\n\n**Hora de registro:** ${submittedTime} · CDMX\n${eventSection}\n## Bebidas\n${details}\n\n- Cantidad seleccionada: ${units}\n- Cantidad objetivo: ${targetQuantity}\n- Presentación: ${mapPersonalization(payload.personalization)}\n\n## Precio estimado\n\n- Rango: ${markdownText(pricing.rangeName,120)}\n- Precio unitario: ${pricing.unitPrice===null?'Por confirmar':`$${pricing.unitPrice}`}\n- Subtotal: ${pricing.subtotal===null?'Por confirmar':`$${pricing.subtotal}`}\n- Anticipo 50%: ${pricing.deposit===null?'Por confirmar':`$${pricing.deposit}`}\n- Saldo: ${pricing.balance===null?'Por confirmar':`$${pricing.balance}`}\n- Envío: Pendiente de confirmar\n\n## Entrega y personalización\n\n- Entrega: ${mapDelivery(payload.fulfillment)}\n- Dirección: ${markdownText(deliveryAddress,700)||'No aplica'}\n- Google Maps: ${markdownText(payload.mapsLink,700)||'No proporcionado'}\n- Personalización: ${mapPersonalization(payload.personalization)}\n- Detalle: ${markdownText(payload.personalizationText,1000)||'No aplica'}\n- Logo: ${logoUpload?'Guardado en Notion':'No aplica'}\n\n## Validación operativa\n\n- Urgente: ${dateStatus.isUrgent?'Sí':'No'}\n- Revisión humana: ${needsReview?'Sí':'No'}\n- Motivo: ${markdownText(reviewReason,1000)||'No aplica'}\n- Nota: La fecha y producción se confirman después de validar el anticipo.\n\n## Información técnica\n\n- Sesión: ${markdownText(payload.sessionId,100)}\n- Página: ${markdownText(payload.pageUrl,500)}\n- Creada: ${markdownText(createdAt,50)} (${submittedTime} CDMX)`;
    const response=await notionJson('/v1/pages',token,{method:'POST',body:JSON.stringify({parent:{data_source_id:dataSourceId},properties,markdown})}),data=await response.json().catch(()=>({}));if(!response.ok){console.error('Notion page creation failed',response.status,data);return sendJson(res,502,{ok:false,code:'NOTION_WRITE_FAILED',error:'No pudimos guardar tu pedido. Intenta nuevamente.'})}return sendJson(res,201,{ok:true,folio,notionUrl:data.url,pageId:data.id,logoSaved:Boolean(logoUpload),submittedTime,pricing:{unitPrice:pricing.unitPrice,subtotal:pricing.subtotal,deposit:pricing.deposit,balance:pricing.balance,rangeName:pricing.rangeName},urgent:dateStatus.isUrgent,needsReview});
  }catch(notionError){console.error('Registration failed',notionError);return sendJson(res,502,{ok:false,code:'REGISTRATION_FAILED',error:'No pudimos guardar tu pedido. Intenta nuevamente.'})}
};
module.exports._test={validate,mapDelivery,mapEventPackage,numberProperty};

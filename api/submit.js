const NOTION_VERSION='2026-03-11';
const DEFAULT_DATA_SOURCE_ID='119298bb-476d-40f3-b8f0-eab4c5bd5d8a';
const requestsByIp=new Map();

function sendJson(res,status,body){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(body))}
function clean(value,max=2000){return String(value??'').replace(/[\u0000-\u001F\u007F]/g,' ').trim().slice(0,max)}
function richText(value){const content=clean(value);return{rich_text:content?[{type:'text',text:{content}}]:[]}}
function title(value){return{title:[{type:'text',text:{content:clean(value,200)||'Pedido web'}}]}}
function numberProperty(value){const parsed=Number(value);return{number:Number.isFinite(parsed)?parsed:null}}
function getBody(req){if(req.body&&typeof req.body==='object')return req.body;if(typeof req.body==='string'){try{return JSON.parse(req.body)}catch{return null}}return null}
function allowedOrigin(req){const origin=req.headers.origin;if(!origin)return true;const configured=clean(process.env.ALLOWED_ORIGINS||'',1000).split(',').map(v=>v.trim()).filter(Boolean);if(configured.includes(origin))return true;try{return new URL(origin).host===clean(req.headers['x-forwarded-host']||req.headers.host,300)}catch{return false}}
function rateLimited(req){const ip=clean((req.headers['x-forwarded-for']||'').split(',')[0]||req.socket?.remoteAddress||'unknown',100),now=Date.now(),windowMs=15*60*1000,current=requestsByIp.get(ip)||{startedAt:now,count:0};if(now-current.startedAt>windowMs){requestsByIp.set(ip,{startedAt:now,count:1});return false}current.count+=1;requestsByIp.set(ip,current);return current.count>12}
function validate(payload){if(!payload||typeof payload!=='object')return'Solicitud inválida.';if(clean(payload.website))return'Solicitud inválida.';if(!/^ANT-\d{8}-[A-Z0-9]{4,8}$/.test(clean(payload.folio,40)))return'Folio inválido.';if(clean(payload.name,120).length<2)return'Nombre inválido.';if(clean(payload.phone,40).replace(/\D/g,'').length<10)return'Teléfono inválido.';if(payload.consent!==true)return'Se requiere consentimiento.';if(!['order','quote'].includes(payload.type))return'Tipo inválido.';if(!Array.isArray(payload.items)||payload.items.length<1||payload.items.length>18)return'Productos inválidos.';const total=payload.items.reduce((sum,item)=>sum+Math.max(0,Number(item.qty)||0),0);if(total<1||total>2000)return'Cantidad inválida.';if(clean(payload.logoData,1200000).length>1000000)return'El logo es demasiado grande.';return null}
async function notionJson(path,token,options={}){return fetch(`https://api.notion.com${path}`,{...options,headers:{Authorization:`Bearer ${token}`,'Notion-Version':NOTION_VERSION,'Content-Type':'application/json',...(options.headers||{})}})}
async function findExisting(folio,token,dataSourceId){try{const response=await notionJson(`/v1/data_sources/${dataSourceId}/query`,token,{method:'POST',body:JSON.stringify({page_size:1,filter:{property:'Folio',rich_text:{equals:folio}}})});if(!response.ok)return null;const data=await response.json();return data.results?.[0]||null}catch{return null}}
function dateProperty(value,includeTime=false){const text=clean(value,50);if(!text)return{date:null};const date=new Date(text);if(Number.isNaN(date.getTime()))return{date:null};return{date:{start:includeTime?date.toISOString():text.slice(0,10)}}}
function mapDelivery(value){return({wtc:'Recoger en WTC',delivery:'Domicilio',event:'Logística para evento'})[value]||'Logística para evento'}
function mapOccasion(value){return({fin:'Para el fin',event:'Evento',office:'Oficina',birthday:'Cumple'})[value]||'Otro'}
function mapPersonalization(value){return({normal:'Normal',phrase:'Nombre o frase',logo:'Logo o concepto'})[value]||'Normal'}
function safeSelect(value,allowed,fallback){const cleaned=clean(value,100);return allowed.includes(cleaned)?cleaned:fallback}

async function uploadLogo(payload,token){
  const dataUrl=clean(payload.logoData,1000000);if(!dataUrl)return null;
  const match=dataUrl.match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/);if(!match)throw new Error('Formato de logo inválido.');
  const mime=match[1],buffer=Buffer.from(match[2],'base64');if(buffer.length>750000)throw new Error('El logo optimizado supera el límite.');
  const extension=mime==='image/jpeg'?'jpg':mime.split('/')[1];
  const filename=clean(payload.logoName,120)||`logo-${payload.folio}.${extension}`;
  const create=await notionJson('/v1/file_uploads',token,{method:'POST',body:JSON.stringify({mode:'single_part',filename,content_type:mime})});
  const created=await create.json().catch(()=>({}));if(!create.ok||!created.id)throw new Error(created.message||'No pudimos preparar el logo.');
  const form=new FormData();form.append('file',new Blob([buffer],{type:mime}),filename);
  const sent=await fetch(`https://api.notion.com/v1/file_uploads/${created.id}/send`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Notion-Version':NOTION_VERSION},body:form});
  const sentData=await sent.json().catch(()=>({}));if(!sent.ok)throw new Error(sentData.message||'No pudimos guardar el logo.');
  return{id:created.id,filename};
}

module.exports=async function handler(req,res){
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS')return sendJson(res,204,{});if(req.method!=='POST')return sendJson(res,405,{ok:false,error:'Método no permitido.'});if(!allowedOrigin(req))return sendJson(res,403,{ok:false,error:'Origen no permitido.'});if(rateLimited(req))return sendJson(res,429,{ok:false,error:'Demasiadas solicitudes. Intenta nuevamente en unos minutos.'});
  const token=process.env.NOTION_TOKEN,dataSourceId=clean(process.env.NOTION_DATA_SOURCE_ID||process.env.NOTION_DATABASE_ID||DEFAULT_DATA_SOURCE_ID,100);if(!token)return sendJson(res,503,{ok:false,code:'NOTION_NOT_CONFIGURED',error:'El registro de pedidos todavía no está disponible.'});
  const payload=getBody(req),error=validate(payload);if(error)return sendJson(res,400,{ok:false,error});
  const folio=clean(payload.folio,40),existing=await findExisting(folio,token,dataSourceId);if(existing)return sendJson(res,200,{ok:true,duplicate:true,folio,notionUrl:existing.url,pageId:existing.id});
  const units=payload.items.reduce((sum,item)=>sum+Math.max(0,Number(item.qty)||0),0),flavors=payload.items.map(item=>`${Number(item.qty)||0} × ${clean(item.name,100)}`).join(' · '),createdAt=payload.createdAt||new Date().toISOString(),requestType=payload.type==='quote'?'Cotización':'Pedido',requestTitle=`${folio} · ${clean(payload.name,90)}`,utm=payload.utm||{};
  try{
    const logoUpload=await uploadLogo(payload,token);
    const properties={
      'Solicitud':title(requestTitle),'Folio':richText(folio),'Estado':{select:{name:'Registrada'}},'Tipo':{select:{name:requestType}},'Origen':{select:{name:'Web app'}},'Fecha solicitud':dateProperty(createdAt,true),'Fecha requerida':dateProperty(payload.requiredDate),'Fecha por definir':{checkbox:Boolean(payload.dateUnknown)},'Nombre':richText(payload.name),'Teléfono':{phone_number:clean(payload.phone,40)||null},'Unidades':numberProperty(units),'Cantidad objetivo':numberProperty(payload.targetQuantity),'Sabores':richText(flavors),'Entrega':{select:{name:mapDelivery(payload.fulfillment)}},'Dirección':richText(payload.address),'Envío estimado':numberProperty(payload.shippingFee),'Ocasión':{select:{name:mapOccasion(payload.occasion)}},'Personalización':{select:{name:mapPersonalization(payload.personalization)}},'Detalle personalización':richText(payload.personalizationText),'Precio unitario':numberProperty(payload.unitPrice),'Total estimado':numberProperty(payload.totalEstimate),'Notas':richText(payload.notes),'UTM Source':richText(utm.source),'UTM Medium':richText(utm.medium),'UTM Campaign':richText(utm.campaign),'Consentimiento':{checkbox:true},'WhatsApp abierto':{checkbox:false},'Seguimiento':dateProperty(createdAt),
      'Tipo de evento':{select:{name:safeSelect(payload.eventType,['Boda','Cumpleaños','Evento corporativo','Activación de marca','Reunión privada','Otro'],'Otro')}},'Personas':numberProperty(payload.eventGuests),'Lugar':richText(payload.eventVenueName||payload.eventVenue),'Google Place ID':richText(payload.eventPlaceId),'Coordenadas':richText(payload.eventLat&&payload.eventLng?`${payload.eventLat},${payload.eventLng}`:''),'Paquete':{select:{name:safeSelect(payload.eventPackage,['Solo bebidas','Mix sin alcohol','Mix con alcohol','Café y sobremesa','Barra ANTOJO.','Personalizado'],'Solo bebidas')}}
    };
    if(payload.type!=='quote'){delete properties['Tipo de evento'];delete properties['Personas'];delete properties['Lugar'];delete properties['Google Place ID'];delete properties['Coordenadas'];delete properties['Paquete']}
    if(logoUpload)properties['Logo']={files:[{name:logoUpload.filename,type:'file_upload',file_upload:{id:logoUpload.id}}]};
    const details=payload.items.map(item=>`- **${Number(item.qty)||0}** × ${clean(item.name,120)}`).join('\n');
    const eventSection=payload.type==='quote'?`\n## Evento\n\n- Tipo: ${clean(payload.eventType,120)||'Por definir'}\n- Personas: ${Number(payload.eventGuests)||'Por definir'}\n- Paquete: ${clean(payload.eventPackage,120)||'Solo bebidas'}\n- Lugar: ${payload.eventVenueUnknown?'Por definir':clean(payload.eventVenue,500)||'Por definir'}\n- Fecha: ${payload.dateUnknown?'Por definir':clean(payload.requiredDate,40)||'Por definir'} ${clean(payload.requiredTime,20)}\n`:'';
    const markdown=`## Registro desde la web app\n\n**Folio:** ${folio}\n\n**Tipo:** ${requestType}\n\n**Contacto:** ${clean(payload.name,120)} · ${clean(payload.phone,40)}\n${eventSection}\n## Bebidas\n${details}\n\n## Entrega y personalización\n\n- Entrega: ${mapDelivery(payload.fulfillment)}\n- Dirección: ${clean(payload.address,500)||'No aplica'}\n- Personalización: ${mapPersonalization(payload.personalization)}\n- Detalle: ${clean(payload.personalizationText,1000)||'No aplica'}\n- Logo: ${logoUpload?'Guardado en Notion':'No aplica'}\n\n## Información técnica\n\n- Sesión: ${clean(payload.sessionId,100)}\n- Página: ${clean(payload.pageUrl,500)}\n- Creada: ${clean(createdAt,50)}`;
    const response=await notionJson('/v1/pages',token,{method:'POST',body:JSON.stringify({parent:{data_source_id:dataSourceId},properties,markdown})});const data=await response.json().catch(()=>({}));if(!response.ok){console.error('Notion page creation failed',response.status,data);return sendJson(res,502,{ok:false,code:'NOTION_WRITE_FAILED',error:'No pudimos guardar tu pedido. Intenta nuevamente.'})}return sendJson(res,201,{ok:true,folio,notionUrl:data.url,pageId:data.id,logoSaved:Boolean(logoUpload)});
  }catch(notionError){console.error('Registration failed',notionError);return sendJson(res,502,{ok:false,code:'REGISTRATION_FAILED',error:'No pudimos guardar tu pedido. Intenta nuevamente.'})}
};
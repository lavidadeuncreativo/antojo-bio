const NOTION_VERSION='2026-03-11';
const DEFAULT_DATA_SOURCE_ID='119298bb-476d-40f3-b8f0-eab4c5bd5d8a';
function send(res,status,body){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(body))}
function clean(value,max=200){return String(value??'').replace(/[\u0000-\u001F\u007F]/g,' ').trim().slice(0,max)}
async function notion(path,token,options={}){return fetch(`https://api.notion.com${path}`,{...options,headers:{Authorization:`Bearer ${token}`,'Notion-Version':NOTION_VERSION,'Content-Type':'application/json'}})}
module.exports=async function handler(req,res){
  if(req.method!=='POST')return send(res,405,{ok:false});
  let body={};try{body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{})}catch{return send(res,400,{ok:false})}
  const token=process.env.NOTION_TOKEN,dataSourceId=clean(process.env.NOTION_DATA_SOURCE_ID||process.env.NOTION_DATABASE_ID||DEFAULT_DATA_SOURCE_ID,100),folio=clean(body.folio,40);
  if(!token||!/^ANT-\d{8}-[A-Z0-9]{4,8}$/.test(folio))return send(res,400,{ok:false});
  try{
    const query=await notion(`/v1/data_sources/${dataSourceId}/query`,token,{method:'POST',body:JSON.stringify({page_size:1,filter:{property:'Folio',rich_text:{equals:folio}}})});const found=await query.json();const page=found.results?.[0];if(!page)return send(res,404,{ok:false});
    const update=await notion(`/v1/pages/${page.id}`,token,{method:'PATCH',body:JSON.stringify({properties:{'WhatsApp abierto':{checkbox:true},'Estado':{select:{name:'WhatsApp abierto'}}}})});if(!update.ok)return send(res,502,{ok:false});return send(res,200,{ok:true});
  }catch{return send(res,502,{ok:false})}
};
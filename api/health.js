const NOTION_VERSION='2026-03-11';
const DEFAULT_DATA_SOURCE_ID='119298bb-476d-40f3-b8f0-eab4c5bd5d8a';
module.exports=async function handler(req,res){
  const token=process.env.NOTION_TOKEN;
  const dataSourceId=process.env.NOTION_DATA_SOURCE_ID||process.env.NOTION_DATABASE_ID||DEFAULT_DATA_SOURCE_ID;
  let notionDataSourceAccessible=false;
  let notionStatus=token?'permission_required':'not_configured';
  if(token){
    try{
      const response=await fetch(`https://api.notion.com/v1/data_sources/${dataSourceId}`,{headers:{Authorization:`Bearer ${token}`,'Notion-Version':NOTION_VERSION}});
      notionDataSourceAccessible=response.ok;
      notionStatus=response.ok?'connected':'permission_required';
    }catch{notionStatus='unreachable'}
  }
  const googleMapsConfigured=Boolean(process.env.GOOGLE_MAPS_BROWSER_KEY);
  res.statusCode=200;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify({
    ok:true,
    ready:Boolean(token&&notionDataSourceAccessible),
    service:'antojo-webapp',
    notionConfigured:Boolean(token),
    notionDataSourceAccessible,
    notionStatus,
    googleMapsConfigured,
    timestamp:new Date().toISOString()
  }));
};
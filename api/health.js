module.exports = async function handler(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify({
    ok: true,
    service: 'antojo-webapp',
    notionConfigured: Boolean(process.env.NOTION_TOKEN),
    timestamp: new Date().toISOString()
  }));
};

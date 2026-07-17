module.exports = function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.statusCode = 200;
  res.end(JSON.stringify({
    ok: true,
    release: 'phase1-20260717-6',
    commit: process.env.VERCEL_GIT_COMMIT_SHA || null,
    branch: process.env.VERCEL_GIT_COMMIT_REF || null,
    environment: process.env.VERCEL_ENV || null,
    generatedAt: new Date().toISOString()
  }));
};

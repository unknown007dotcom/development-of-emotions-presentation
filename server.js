const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const REFLECTIONS_FILE = path.join(DATA_DIR, 'reflections.json');
const QUIZ_FILE = path.join(DATA_DIR, 'quiz-results.json');

fs.mkdirSync(DATA_DIR, { recursive: true });
for (const file of [REFLECTIONS_FILE, QUIZ_FILE]) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, '[]', 'utf8');
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(body));
}

function readStore(file) {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

function writeStore(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

function getBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 100000) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (error) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function cleanedText(value, maxLength) {
  return String(value || '').replace(/[<>]/g, '').trim().slice(0, maxLength);
}

async function handleApi(req, res, pathname) {
  if (req.method === 'GET' && pathname === '/api/health') {
    return sendJson(res, 200, { ok: true, app: 'Development of Emotions', timestamp: new Date().toISOString() });
  }

  if (req.method === 'GET' && pathname === '/api/reflections') {
    const reflections = readStore(REFLECTIONS_FILE);
    return sendJson(res, 200, {
      count: reflections.length,
      recent: reflections.slice(-4).reverse().map(({ id, firstName, text, createdAt }) => ({ id, firstName, text, createdAt }))
    });
  }

  if (req.method === 'POST' && pathname === '/api/reflections') {
    try {
      const body = await getBody(req);
      const firstName = cleanedText(body.firstName, 36) || 'Anonymous learner';
      const text = cleanedText(body.text, 280);
      if (text.length < 8) return sendJson(res, 400, { ok: false, message: 'Please write at least a short reflection (8 characters).' });

      const reflections = readStore(REFLECTIONS_FILE);
      const reflection = {
        id: crypto.randomUUID(),
        firstName,
        text,
        createdAt: new Date().toISOString()
      };
      reflections.push(reflection);
      writeStore(REFLECTIONS_FILE, reflections.slice(-100));
      return sendJson(res, 201, { ok: true, reflection, count: reflections.length });
    } catch (error) {
      return sendJson(res, 400, { ok: false, message: error.message || 'Unable to save reflection.' });
    }
  }

  if (req.method === 'POST' && pathname === '/api/quiz-results') {
    try {
      const body = await getBody(req);
      const score = Number(body.score);
      const total = Number(body.total);
      if (!Number.isFinite(score) || !Number.isFinite(total) || score < 0 || total < 1 || score > total) {
        return sendJson(res, 400, { ok: false, message: 'Please submit a valid score.' });
      }
      const results = readStore(QUIZ_FILE);
      const result = {
        id: crypto.randomUUID(),
        score,
        total,
        createdAt: new Date().toISOString()
      };
      results.push(result);
      writeStore(QUIZ_FILE, results.slice(-150));
      return sendJson(res, 201, { ok: true, result });
    } catch (error) {
      return sendJson(res, 400, { ok: false, message: error.message || 'Unable to record score.' });
    }
  }

  return sendJson(res, 404, { ok: false, message: 'API route not found.' });
}

function serveStatic(req, res, pathname) {
  let requested = pathname === '/' ? '/index.html' : pathname;
  try { requested = decodeURIComponent(requested); } catch { return sendJson(res, 400, { ok: false, message: 'Malformed URL.' }); }
  const normalized = path.normalize(requested).replace(/^([.][.][\\/])+/, '');
  const filePath = path.join(ROOT, normalized);

  if (!filePath.startsWith(ROOT)) return sendJson(res, 403, { ok: false, message: 'Forbidden.' });

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 — Page not found');
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff'
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname.startsWith('/api/')) {
    handleApi(req, res, url.pathname);
  } else {
    serveStatic(req, res, url.pathname);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Development of Emotions site is live at http://0.0.0.0:${PORT}`);
});

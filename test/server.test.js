/**
 * Basic tests for the publicmd server.
 * Uses Node's built-in http/assert modules – no extra deps needed.
 */

const http = require('http');
const assert = require('assert');

// Start the server on a random port for testing
process.env.PORT = '0';

// Patch listen so we can grab the actual port
const server = require('../server');

// Give the server a tick to bind
setTimeout(runTests, 200);

function get(path) {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    http.get(`http://localhost:${port}${path}`, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ ${name}`);
      console.error(`    ${err.message}`);
      failed++;
    }
  }

  console.log('\npublicmd server tests\n');

  await test('GET / returns 200', async () => {
    const { status } = await get('/');
    assert.strictEqual(status, 200);
  });

  await test('GET /api/docs returns JSON array', async () => {
    const { status, body } = await get('/api/docs');
    assert.strictEqual(status, 200);
    const docs = JSON.parse(body);
    assert.ok(Array.isArray(docs), 'response should be an array');
  });

  await test('GET /api/docs includes sample docs', async () => {
    const { body } = await get('/api/docs');
    const docs = JSON.parse(body);
    assert.ok(docs.length >= 1, 'should have at least one document');
    assert.ok(docs.every((d) => d.name && d.url), 'each doc should have name and url');
  });

  await test('GET /docs/welcome.md returns rendered HTML', async () => {
    const { status, body } = await get('/docs/welcome.md');
    assert.strictEqual(status, 200);
    const data = JSON.parse(body);
    assert.ok(data.html, 'should have html field');
    assert.ok(data.raw, 'should have raw field');
    assert.ok(data.html.includes('<h1'), 'rendered HTML should contain an h1');
  });

  await test('GET /docs/nonexistent.md returns 404', async () => {
    const { status } = await get('/docs/nonexistent.md');
    assert.strictEqual(status, 404);
  });

  await test('GET /docs/../server.js returns 400 (path traversal blocked)', async () => {
    const { status } = await get('/docs/..%2Fserver.js');
    assert.strictEqual(status, 400);
  });

  await test('GET /docs/..%2F..%2Fpackage.json returns 400 (double-encoded traversal blocked)', async () => {
    const { status } = await get('/docs/..%2F..%2Fpackage.json');
    assert.strictEqual(status, 400);
  });

  await test('GET /docs/notamd.txt returns 400', async () => {
    const { status } = await get('/docs/notamd.txt');
    assert.strictEqual(status, 400);
  });

  console.log(`\n${passed} passed, ${failed} failed\n`);
  server.close();
  process.exit(failed > 0 ? 1 : 0);
}

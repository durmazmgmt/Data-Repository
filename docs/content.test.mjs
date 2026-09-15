import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const contentPath = path.join(root, 'docs', 'content.json');
const appPath = path.join(root, 'docs', 'app.js');
const indexPath = path.join(root, 'docs', 'index.html');

assert.equal(fs.existsSync(contentPath), true, 'docs/content.json must exist');

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
assert.equal(content.version, '1.0.0');
assert.ok(Array.isArray(content.collections), 'collections must be an array');

const ids = new Set(content.collections.map((item) => item.id));
for (const required of ['durmaz-management', 'tax-season-support', 'mobile-notary-hub']) {
  assert.ok(ids.has(required), `missing approved public collection: ${required}`);
}

for (const collection of content.collections) {
  assert.equal(typeof collection.title, 'string');
  assert.equal(typeof collection.summary, 'string');
  assert.ok(Array.isArray(collection.services), `${collection.id} services must be an array`);
  assert.ok(collection.services.length > 0, `${collection.id} must contain services`);
}

const blockedKeyPattern = /(sourceUrl|sourceSystem|contentJson|client[_-]?id|ssn|ein|token|credential|private[_-]?key|audit[_-]?log)/i;
function scan(value, trail = 'root') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => scan(item, `${trail}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, nested] of Object.entries(value)) {
    assert.equal(blockedKeyPattern.test(key), false, `blocked field name at ${trail}.${key}`);
    scan(nested, `${trail}.${key}`);
  }
}
scan(content);

const app = fs.readFileSync(appPath, 'utf8');
assert.match(app, /CONTENT_URL\s*=\s*['"]\.\/content\.json['"]/);
assert.match(app, /function\s+renderContentCollections\s*\(/);

const index = fs.readFileSync(indexPath, 'utf8');
assert.match(index, /id=["']publicContent["']/);

console.log(`Public content contract validated for ${content.collections.length} collection(s).`);

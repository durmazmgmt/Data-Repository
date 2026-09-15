const FEED_URL = 'https://charming-lapwing-610.eu-west-1.convex.site/repository/public';

const state = { records: [], generatedAt: null };
const recordsEl = document.getElementById('records');
const emptyEl = document.getElementById('emptyState');
const errorEl = document.getElementById('errorState');
const searchEl = document.getElementById('search');
const typeEl = document.getElementById('typeFilter');
const countEl = document.getElementById('recordCount');
const updatedEl = document.getElementById('lastUpdated');
const statusEl = document.getElementById('connectionStatus');

function text(value) {
  return value == null ? '' : String(value);
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function makeElement(tag, className, value) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (value !== undefined) el.textContent = text(value);
  return el;
}

function render() {
  const query = searchEl.value.trim().toLowerCase();
  const selectedType = typeEl.value;
  const visible = state.records.filter((record) => {
    const matchesType = selectedType === 'all' || record.recordType === selectedType;
    const haystack = [record.name, record.key, record.summary, record.version, ...(record.tags || [])].join(' ').toLowerCase();
    return matchesType && (!query || haystack.includes(query));
  });

  recordsEl.replaceChildren();
  countEl.textContent = String(visible.length);
  emptyEl.hidden = visible.length !== 0 || state.records.length === 0;

  for (const record of visible) {
    const card = makeElement('article', 'card');
    const head = makeElement('div', 'card-head');
    head.append(makeElement('h2', '', record.name), makeElement('span', 'badge', record.recordType));
    card.append(head);

    if (record.summary) card.append(makeElement('p', 'summary-text', record.summary));

    const meta = makeElement('div', 'meta');
    for (const tag of (record.tags || []).slice(0, 6)) meta.append(makeElement('span', 'tag', tag));
    if (meta.childNodes.length) card.append(meta);

    const details = makeElement('div', 'details');
    details.append(
      makeElement('span', '', record.version ? `Version ${record.version}` : 'Current record'),
      makeElement('span', '', formatDate(record.updatedAt)),
    );
    card.append(details);
    recordsEl.append(card);
  }
}

function populateTypes() {
  const types = [...new Set(state.records.map((record) => record.recordType).filter(Boolean))].sort();
  for (const type of types) {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    typeEl.append(option);
  }
}

async function loadRepository() {
  try {
    const response = await fetch(FEED_URL, { method: 'GET', mode: 'cors', credentials: 'omit', cache: 'no-store' });
    if (!response.ok) throw new Error(`Feed returned ${response.status}`);
    const data = await response.json();
    state.records = Array.isArray(data.items) ? data.items : [];
    state.generatedAt = data.generatedAt || null;
    populateTypes();
    updatedEl.textContent = state.generatedAt ? `· refreshed ${formatDate(state.generatedAt)}` : '';
    statusEl.textContent = 'Secure read-only feed connected';
    errorEl.hidden = true;
    render();
  } catch (error) {
    console.error('Public repository feed failed to load.');
    statusEl.textContent = 'Feed unavailable';
    errorEl.hidden = false;
    recordsEl.replaceChildren();
    countEl.textContent = '0';
  }
}

searchEl.addEventListener('input', render);
typeEl.addEventListener('change', render);
void loadRepository();

import { Storage } from './storage.js';

export const ROOT = new URL('../../', import.meta.url);
export const DATA = new URL('data/', ROOT);
export const pageUrl = (path = '') => new URL(path, ROOT).href;

const NAV_ITEMS = [
  ['Dashboard', 'index.html', 'home'],
  ['Planner', 'planner.html', 'planner'],
  ['Subjects', 'subjects/linear-algebra/index.html', 'subjects'],
  ['Practice', 'practice/index.html', 'practice'],
  ['Tests', 'test-center/index.html', 'tests'],
  ['Formula sheet', 'formula-sheet.html', 'formulas'],
  ['About', 'about.html', 'about'],
];

const icon = (name) => {
  const paths = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10M9 20v-6h6v6"/>',
    planner: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>',
    subjects: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5z"/><path d="M4 6.5v13M8 8h8M8 12h6"/>',
    practice: '<path d="M9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    tests: '<path d="M9 2h6l1 3h3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3z"/><path d="M9 12h6M9 16h4"/>',
    formulas: '<path d="M4 5h15M4 19h15M7 5l5 7-5 7M15 9h4M17 7v4"/>',
    about: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24">${paths[name]}</svg>`;
};

function initShell() {
  const current = document.body.dataset.page;
  const header = document.querySelector('#siteHeader');
  if (header) {
    header.innerHTML = `
      <a class="skip-link" href="#main">Skip to content</a>
      <div class="topbar">
        <a class="brand" href="${pageUrl('index.html')}" aria-label="GATE DA Prep Hub home">
          <span class="brand-mark">G</span><span><strong>GATE DA</strong><small>Prep Hub · 2027</small></span>
        </a>
        <div class="topbar-actions">
          <button class="icon-button" id="searchButton" aria-label="Open search" title="Search (Ctrl K)">${icon('practice')}</button>
          <button class="icon-button" id="themeButton" aria-label="Toggle color theme" title="Toggle theme"><span aria-hidden="true">◐</span></button>
          <button class="icon-button menu-button" id="menuButton" aria-label="Open navigation" aria-expanded="false">☰</button>
        </div>
      </div>
      <nav class="primary-nav" id="primaryNav" aria-label="Primary navigation">
        ${NAV_ITEMS.map(([label, href, key]) => `<a href="${pageUrl(href)}" ${current === key ? 'aria-current="page"' : ''}>${icon(key)}<span>${label}</span></a>`).join('')}
      </nav>`;
  }

  const footer = document.querySelector('#siteFooter');
  if (footer) footer.innerHTML = `<p>Built for focused preparation. Your progress stays on this device.</p><p><a href="${pageUrl('about.html')}">Sources & data controls</a></p>`;

  const savedTheme = Storage.get('theme', 'light');
  document.documentElement.dataset.theme = savedTheme;
  document.querySelector('#themeButton')?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    Storage.set('theme', next);
  });
  document.querySelector('#menuButton')?.addEventListener('click', (event) => {
    const open = document.body.classList.toggle('nav-open');
    event.currentTarget.setAttribute('aria-expanded', String(open));
  });
  document.querySelector('#searchButton')?.addEventListener('click', openSearch);
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openSearch();
    }
    if (event.key === 'Escape') closeSearch();
  });
}

let searchIndex;
async function openSearch() {
  let dialog = document.querySelector('#searchDialog');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'searchDialog';
    dialog.className = 'search-dialog';
    dialog.innerHTML = `<form method="dialog" class="search-box"><label for="globalSearch">Search the hub</label><div class="search-input-wrap"><input id="globalSearch" type="search" placeholder="Try “Bayes”, “eigenvalue”, or “Poisson”" autocomplete="off"><button aria-label="Close search">×</button></div><div id="searchResults" class="search-results"><p class="muted">Search theory, formulas, and all 280 practice questions.</p></div></form>`;
    document.body.append(dialog);
    dialog.querySelector('input').addEventListener('input', handleSearch);
  }
  dialog.showModal();
  dialog.querySelector('input').focus();
}

function closeSearch() { document.querySelector('#searchDialog')?.close(); }

async function handleSearch(event) {
  const query = event.target.value.trim().toLowerCase();
  const results = document.querySelector('#searchResults');
  if (query.length < 2) { results.innerHTML = '<p class="muted">Type at least two characters.</p>'; return; }
  if (!searchIndex) searchIndex = await fetch(new URL('search-index.json', DATA)).then((r) => r.json());
  const matches = searchIndex.filter((item) => `${item.title} ${item.text} ${item.tags}`.toLowerCase().includes(query)).slice(0, 12);
  results.innerHTML = matches.length ? matches.map((item) => `<a href="${pageUrl(item.url)}"><span class="eyebrow">${item.kind}</span><strong>${item.title}</strong><small>${item.text.slice(0, 105)}${item.text.length > 105 ? '…' : ''}</small></a>`).join('') : '<p>No matches yet. Try a broader term.</p>';
}

export async function fetchJSON(path) {
  const response = await fetch(new URL(path, DATA));
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

export function renderMath(root = document.body) {
  if (!window.renderMathInElement) return;
  window.renderMathInElement(root, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '\\[', right: '\\]', display: true },
      { left: '\\(', right: '\\)', display: false },
    ],
    throwOnError: false,
  });
}

export function toast(message) {
  const node = document.createElement('div');
  node.className = 'toast';
  node.textContent = message;
  document.body.append(node);
  setTimeout(() => node.remove(), 2600);
}

initShell();
window.addEventListener('load', () => renderMath());


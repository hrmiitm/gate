import { fetchJSON, pageUrl } from './app.js';
import { Storage } from './storage.js';

async function render() {
  const tests = await fetchJSON('tests/index.json');
  const attempts = Storage.get('attempts', {});
  const subject = new URLSearchParams(location.search).get('subject');
  const filtered = subject ? tests.filter((test) => test.subject === subject) : tests;
  const groups = [['topic', 'Topic tests'], ['subject', 'Subject tests'], ['combined', 'Combined test']];
  document.querySelector('#testCenterApp').innerHTML = `<span class="eyebrow">GATE-accurate scoring</span><h1>Test the work, then study the evidence.</h1><p class="lede">Practice mode teaches as you go. Exam mode is timed and keeps every explanation locked until submission.</p><div class="notice"><strong>Marking:</strong> MCQ +1/−⅓ or +2/−⅔ · MSQ and NAT full marks or zero · no partial credit for MSQ.</div>${groups.map(([kind, title]) => {
    const items = filtered.filter((test) => test.kind === kind); if (!items.length) return '';
    return `<section><div class="section-heading"><h2>${title}</h2><span class="tag">${items.length} available</span></div><div class="test-list">${items.map((test) => { const history = attempts[test.id] || []; const last = history.at(-1); return `<article class="card test-card"><span class="eyebrow">${test.labelPrefix}</span><h3>${test.title}</h3><div class="test-meta"><span>${test.questionIds.length} questions</span><span>${test.minutes} minutes</span></div><p>${last ? `Last attempt: ${last.score.toFixed(2)}/${last.possible} · ${Math.round(last.accuracy)}% accuracy` : 'No attempts yet. Start clean.'}</p><div class="button-row"><a class="button small" href="${pageUrl(`test-center/runner.html?test=${test.id}&mode=exam`)}">Exam mode</a><a class="button secondary small" href="${pageUrl(`test-center/runner.html?test=${test.id}&mode=practice`)}">Practice mode</a></div></article>`; }).join('')}</div></section>`;
  }).join('')}`;
}
render();


import { fetchJSON, pageUrl } from './app.js';
import { Storage } from './storage.js';

async function render() {
  const syllabus = await fetchJSON('syllabus.json');
  const id = document.body.dataset.subject;
  const subject = syllabus.subjects.find((item) => item.id === id);
  const solved = Storage.get('solved', []);
  const attempts = Storage.get('attempts', {});
  const other = syllabus.subjects.find((item) => item.status === 'live' && item.id !== id);
  document.title = `${subject.title} · GATE DA Prep Hub`;
  document.querySelector('#subjectApp').innerHTML = `
    <span class="eyebrow">Live subject · 7 modules</span><h1>${subject.title}</h1><p class="lede">${subject.estimate}. Treat the number as a planning signal, never an official promise.</p>
    <div class="subject-switch"><a class="button secondary small" href="${pageUrl(`subjects/${other.id}/index.html`)}">Switch to ${other.title}</a><a class="button ghost small" href="${pageUrl(`test-center/index.html?subject=${id}`)}">Subject test</a></div>
    <div class="module-list">${subject.modules.map((title, index) => {
      const prefix = `${id === 'linear-algebra' ? 'la' : 'ps'}-${String(index + 1).padStart(2, '0')}-`;
      const count = solved.filter((qid) => qid.startsWith(prefix)).length;
      const test = attempts[`topic-${id}-${index + 1}`]?.at(-1);
      return `<a class="module-row" href="${pageUrl(`subjects/module.html?subject=${id}&module=${index + 1}`)}"><span class="module-number">${String(index + 1).padStart(2, '0')}</span><div><h3>${title}</h3><p>${count}/20 practice questions solved${test ? ` · Last test ${test.score.toFixed(1)}/${test.possible}` : ''}</p></div><div class="module-progress"><div class="progress-track"><span class="progress-fill" style="--progress:${Math.min(100, count / 20 * 100)}%"></span></div><small>${Math.round(Math.min(100, count / 20 * 100))}% practice</small></div><span aria-hidden="true">→</span></a>`;
    }).join('')}</div>`;
}

render().catch((error) => { document.querySelector('#subjectApp').innerHTML = `<div class="empty-state">${error.message}</div>`; });


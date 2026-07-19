import { fetchJSON, renderMath } from './app.js';
import { loadModule } from './content.js';

async function render() {
  const syllabus = await fetchJSON('syllabus.json');
  const live = syllabus.subjects.filter((subject) => subject.status === 'live');
  const modules = await Promise.all(live.flatMap((subject) => subject.modules.map((_, index) => loadModule(subject.id, index + 1))));
  const app = document.querySelector('#formulaApp');
  app.innerHTML = `<span class="eyebrow">Print-ready revision</span><h1>The formula sheet you can actually scan.</h1><p class="lede">Every core identity from both live subjects, grouped in the same order you learned it.</p><div class="formula-controls no-print"><input id="formulaSearch" type="search" placeholder="Filter formulas by module or keyword"><button class="button" id="printFormulas">Print / save PDF</button></div><div id="formulaResults">${live.map((subject) => `<section class="formula-subject"><h2>${subject.title}</h2><div class="card-grid">${modules.filter((module) => module.subject === subject.id).map((module) => `<article class="card formula-module" data-search="${module.title.toLowerCase()} ${module.searchTerms.join(' ')}"><span class="eyebrow">Module ${module.module}</span><h3>${module.title}</h3><ul>${module.formulas.map((formula) => `<li>\\(${formula}\\)</li>`).join('')}</ul></article>`).join('')}</div></section>`).join('')}</div>`;
  app.querySelector('#printFormulas').addEventListener('click', () => window.print());
  app.querySelector('#formulaSearch').addEventListener('input', (event) => { const query = event.target.value.trim().toLowerCase(); app.querySelectorAll('.formula-module').forEach((card) => { card.hidden = query && !card.dataset.search.includes(query); }); });
  renderMath(app);
}
render();

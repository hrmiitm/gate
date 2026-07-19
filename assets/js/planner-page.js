import { fetchJSON, pageUrl } from './app.js';
import { Storage } from './storage.js';
import { buildPlan, groupWeeks } from './planner-engine.js';

const formatDate = (value, end) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', ...(end ? { year: 'numeric' } : {}) }).format(new Date(`${value}T12:00:00`));

async function render() {
  const [config, syllabus] = await Promise.all([fetchJSON('planner/calendar-config.json'), fetchJSON('syllabus.json')]);
  const plan = buildPlan(config, syllabus);
  const weeks = groupWeeks(plan);
  const completed = Storage.get('planner:completed', []);
  const live = plan.filter((day) => !day.locked);
  const percent = Math.round(completed.filter((id) => live.some((day) => day.id === id)).length / live.length * 100);
  const app = document.querySelector('#plannerApp');
  app.innerHTML = `<div class="planner-hero"><div><span class="eyebrow">Six-month roadmap</span><h1>Know what to do when you sit down.</h1><p class="lede">${live.length} fully interactive Phase-1 days, followed by locked roadmap blocks. Five focused days, one test-heavy day, and one lighter day is the rhythm—not a guilt machine.</p></div><div class="planner-summary"><div><strong>${percent}%</strong><small>Phase 1 done</small></div><div><strong>${live.length}</strong><small>live days</small></div></div></div><div class="notice"><strong>Planning date:</strong> ${formatDate(config.targetExamDate, true)} is provisional until the official GATE 2027 notification is published.</div>
    <div class="week-list">${weeks.map((week) => {
      if (week.type === 'locked') { const day = week.days[0]; return `<details class="week locked-week"><summary><span>Weeks ${week.number}–${week.number + day.weeks - 1} · ${day.title}</span><span class="tag">Coming soon</span></summary><div class="empty-state"><p>${day.weeks} weeks reserved · ${formatDate(day.date)}–${formatDate(day.endDate, true)}</p><p>This track is intentionally visible but locked until verified content is ready.</p></div></details>`; }
      const first = week.days[0], last = week.days.at(-1); const done = week.days.filter((day) => completed.includes(day.id)).length;
      return `<details class="week" ${week.number <= 2 ? 'open' : ''}><summary><span>Week ${week.number} · ${first.subjectTitle}</span><span class="tag">${done}/${week.days.length} done · ${formatDate(first.date)}–${formatDate(last.date)}</span></summary><div class="week-days">${week.days.map((day) => `<article class="plan-day ${completed.includes(day.id) ? 'completed' : ''}"><input class="day-check" type="checkbox" aria-label="Mark day ${day.dayNumber} complete" data-day="${day.id}" ${completed.includes(day.id) ? 'checked' : ''}><span class="day-date">${formatDate(day.date)}<br>Day ${day.dayNumber}</span><div><span class="eyebrow">${day.kind}</span><h3>${day.title}</h3><p>${day.task}</p></div><span class="tag">${day.minutes} min</span>${day.testId ? `<a class="button small" href="${pageUrl(`test-center/runner.html?test=${day.testId}&mode=exam`)}">Start test</a>` : `<a class="button ghost small" href="${pageUrl(`subjects/module.html?subject=${day.subject}&module=${day.module}`)}">Open module</a>`}</article>`).join('')}</div></details>`;
    }).join('')}</div>`;
  app.querySelectorAll('[data-day]').forEach((input) => input.addEventListener('change', () => {
    const values = Storage.get('planner:completed', []);
    Storage.set('planner:completed', input.checked ? [...new Set([...values, input.dataset.day])] : values.filter((id) => id !== input.dataset.day));
    input.closest('.plan-day').classList.toggle('completed', input.checked);
  }));
}
render();


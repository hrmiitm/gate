import { fetchJSON, pageUrl } from './app.js';
import { Storage } from './storage.js';
import { buildPlan, streak } from './planner-engine.js';

async function render() {
  const [config, syllabus] = await Promise.all([fetchJSON('planner/calendar-config.json'), fetchJSON('syllabus.json')]);
  const plan = buildPlan(config, syllabus);
  const live = plan.filter((day) => !day.locked);
  const complete = Storage.get('planner:completed', []);
  const todayIso = new Date().toISOString().slice(0, 10);
  const today = live.find((day) => day.date === todayIso) || live.find((day) => !complete.includes(day.id)) || live.at(-1);
  const phasePercent = Math.round(complete.filter((id) => live.some((day) => day.id === id)).length / live.length * 100);
  const totalRoadmapDays = Math.max(1, Math.round((new Date(config.targetExamDate) - new Date(config.startDate)) / 86400000));
  const overallPercent = Math.round(complete.length / totalRoadmapDays * 100);
  const daysLeft = Math.max(0, Math.ceil((new Date(`${config.targetExamDate}T12:00:00`) - new Date()) / 86400000));
  const attempts = Storage.get('attempts', {});
  const mastery = syllabus.subjects.filter((subject) => subject.status === 'live').flatMap((subject) => subject.modules.map((title, index) => {
    const last = attempts[`topic-${subject.id}-${index + 1}`]?.at(-1);
    const percent = last ? last.score / last.possible * 100 : null;
    return { title, short: `${subject.short}${index + 1}`, percent };
  }));
  const app = document.querySelector('#dashboardApp');
  app.innerHTML = `<section class="hero-split"><div><span class="eyebrow">Your GATE DA command desk</span><h1>Small, exact steps. Every day.</h1></div><div class="countdown"><strong>${daysLeft}</strong><span>days to the provisional target<br>1 February 2027</span></div></section>
    <div class="section-heading"><div><span class="eyebrow">Today's focus</span><h2>Continue the plan</h2></div><a href="${pageUrl('planner.html')}" class="button ghost small">View full planner</a></div>
    <article class="card today-card"><div><span class="tag live">Day ${today.dayNumber} · ${today.minutes} min</span><h3>${today.title}</h3><p>${today.task}</p></div><a class="button" href="${today.testId ? pageUrl(`test-center/runner.html?test=${today.testId}&mode=exam`) : pageUrl(`subjects/module.html?subject=${today.subject}&module=${today.module}`)}">${today.testId ? 'Start test' : 'Open module'} →</a></article>
    <div class="section-heading"><h2>Momentum</h2></div><div class="card-grid"><article class="card metric"><span class="eyebrow">Phase 1</span><span class="metric-value">${phasePercent}%</span><div><div class="progress-track"><span class="progress-fill" style="--progress:${phasePercent}%"></span></div><small>Can reach 100% with the live curriculum</small></div></article><article class="card metric"><span class="eyebrow">Full roadmap</span><span class="metric-value">${overallPercent}%</span><div><div class="progress-track"><span class="progress-fill" style="--progress:${overallPercent}%"></span></div><small>Locked tracks count toward the six-month whole</small></div></article><article class="card metric"><span class="eyebrow">Current streak</span><span class="metric-value">${streak(complete)}</span><small>consecutive completed days</small></article></div>
    <div class="section-heading"><div><span class="eyebrow">Topic tests</span><h2>Mastery map</h2></div><a href="${pageUrl('test-center/index.html')}" class="button ghost small">Open Test Center</a></div><div class="heatmap">${mastery.map((item) => `<div class="heat-cell ${item.percent === null ? '' : item.percent >= 70 ? 'good' : 'warn'}"><strong>${item.short}</strong><span>${item.percent === null ? 'Not tested' : `${Math.round(item.percent)}%`}</span><small>${item.title}</small></div>`).join('')}</div>`;
}
render();

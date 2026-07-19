import { fetchJSON } from './app.js';

export async function loadModule(subject, module) {
  return fetchJSON(`${subject}/module-${module}.json`);
}

export async function loadQuestions(subject, module) {
  return fetchJSON(`${subject}/questions/module-${module}.json`);
}

export async function loadAllQuestions() {
  const syllabus = await fetchJSON('syllabus.json');
  const live = syllabus.subjects.filter((subject) => subject.status === 'live');
  const sets = await Promise.all(live.flatMap((subject) => subject.modules.map((_, index) => loadQuestions(subject.id, index + 1))));
  return sets.flat();
}


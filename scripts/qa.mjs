import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { scoreQuestion } from '../assets/js/marking.js';

const root = resolve(import.meta.dirname, '..');
const subjects = ['probability-statistics', 'linear-algebra'];
const ids = new Set();
let total = 0;

for (const subject of subjects) {
  for (let module = 1; module <= 7; module += 1) {
    const theory = JSON.parse(await readFile(resolve(root, `data/${subject}/module-${module}.json`)));
    const questions = JSON.parse(await readFile(resolve(root, `data/${subject}/questions/module-${module}.json`)));
    assert.equal(theory.examples.length, 4, `${subject}/${module}: four examples`);
    assert.ok(theory.formulas.length >= 4, `${subject}/${module}: formula coverage`);
    assert.ok(theory.pitfalls.length >= 4, `${subject}/${module}: pitfalls coverage`);
    assert.equal(questions.length, 20, `${subject}/${module}: original question quota`);
    assert.deepEqual(questions.reduce((acc, q) => { acc[q.difficulty] = (acc[q.difficulty] || 0) + 1; return acc; }, {}), { foundation: 7, 'gate-standard': 9, challenge: 4 });
    for (const q of questions) {
      assert.ok(!ids.has(q.id), `duplicate ID ${q.id}`); ids.add(q.id); total += 1;
      assert.equal(q.subject, subject); assert.equal(q.module, module);
      assert.ok(['MCQ', 'MSQ', 'NAT'].includes(q.type)); assert.ok([1, 2].includes(q.marks));
      assert.equal(q.source, 'original'); assert.ok(q.solution_latex.length >= 10); assert.ok(q.common_mistake.length >= 10);
      if (q.type === 'NAT') { assert.equal(typeof q.nat_answer.value, 'number'); assert.ok(q.nat_answer.tolerance >= 0); }
      else { assert.equal(q.options.length, 4); assert.ok(q.correct.length >= 1); }
    }
  }
}
assert.equal(total, 280);

const tests = JSON.parse(await readFile(resolve(root, 'data/tests/index.json')));
assert.equal(tests.length, 17); assert.equal(tests.filter((t) => t.kind === 'topic').length, 14);
tests.forEach((test) => test.questionIds.forEach((id) => assert.ok(ids.has(id), `${test.id} references missing ${id}`)));

const mcq1 = { type: 'MCQ', marks: 1, correct: ['B'] };
const mcq2 = { type: 'MCQ', marks: 2, correct: ['B'] };
const msq = { type: 'MSQ', marks: 2, correct: ['A', 'C'] };
const nat = { type: 'NAT', marks: 2, nat_answer: { value: 2.5, tolerance: 0.01 } };
assert.equal(scoreQuestion(mcq1, ['A']).earned, -1 / 3);
assert.equal(scoreQuestion(mcq2, ['A']).earned, -2 / 3);
assert.equal(scoreQuestion(msq, ['A']).earned, 0);
assert.equal(scoreQuestion(msq, ['A', 'C']).earned, 2);
assert.equal(scoreQuestion(nat, '2.505').earned, 2);
assert.equal(scoreQuestion(nat, '').status, 'unattempted');

console.log(`QA passed: ${total} questions, ${tests.length} tests, unique IDs, schemas, quotas, and GATE marking rules.`);

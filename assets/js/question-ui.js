import { Storage } from './storage.js';
import { renderMath, toast } from './app.js';
import { answerIsCorrect, isAttempted } from './marking.js';

export { answerIsCorrect, isAttempted } from './marking.js';

export function readAnswer(container, question) {
  if (question.type === 'NAT') return container.querySelector('input[type="number"]')?.value ?? '';
  return [...container.querySelectorAll('input:checked')].map((input) => input.value);
}

export function answerLabel(question) {
  if (question.type === 'NAT') return `${question.nat_answer.value} (±${question.nat_answer.tolerance})`;
  return question.correct.join(', ');
}

export function renderInputs(question, name, answer = []) {
  if (question.type === 'NAT') return `<label>Numerical answer <input class="answer-input" name="${name}" type="number" step="any" inputmode="decimal" value="${answer ?? ''}"></label>`;
  const inputType = question.type === 'MSQ' ? 'checkbox' : 'radio';
  return `<div class="options">${question.options.map((option, index) => {
    const key = String.fromCharCode(65 + index);
    const checked = Array.isArray(answer) && answer.includes(key) ? 'checked' : '';
    return `<label class="option"><input type="${inputType}" name="${name}" value="${key}" ${checked}><span><strong>${key}.</strong> ${option}</span></label>`;
  }).join('')}</div>`;
}

export function questionCard(question, { index, interactive = true, showSolution = false } = {}) {
  const bookmarks = Storage.get('bookmarks', []);
  return `<article class="card question-card" data-question-id="${question.id}">
    <header><div class="meta"><span class="tag">${question.type}</span><span class="tag">${question.marks} mark${question.marks > 1 ? 's' : ''}</span><span class="tag ${question.difficulty === 'challenge' ? 'challenge' : ''}">${question.difficulty.replace('-', ' ')}</span><span class="tag">${question.source}</span></div><button class="button ghost small bookmark-button ${bookmarks.includes(question.id) ? 'active' : ''}" type="button" data-bookmark="${question.id}" aria-label="Bookmark question">${bookmarks.includes(question.id) ? 'Saved' : 'Save'}</button></header>
    ${index !== undefined ? `<span class="eyebrow">Question ${index + 1}</span>` : ''}
    <div class="question-text">${question.question_latex}</div>
    ${interactive ? renderInputs(question, `answer-${question.id}`) : ''}
    <div class="question-actions">${interactive ? '<button class="button small check-answer" type="button">Check answer</button>' : ''}<button class="button ghost small reveal-solution" type="button">${showSolution ? 'Hide solution' : 'View solution'}</button><button class="button ghost small revise-button" type="button">Revise later</button></div>
    <div class="solution" ${showSolution ? '' : 'hidden'}><span class="eyebrow">Answer · ${answerLabel(question)}</span><p>${question.solution_latex}</p><p class="muted"><strong>Watch for:</strong> ${question.common_mistake}</p></div>
  </article>`;
}

export function bindQuestionCards(root, questions, onAnswer) {
  const map = new Map(questions.map((question) => [question.id, question]));
  root.querySelectorAll('[data-bookmark]').forEach((button) => button.addEventListener('click', () => {
    const values = Storage.toggleIn('bookmarks', button.dataset.bookmark);
    button.classList.toggle('active', values.includes(button.dataset.bookmark));
    button.textContent = values.includes(button.dataset.bookmark) ? 'Saved' : 'Save';
    toast(values.includes(button.dataset.bookmark) ? 'Question bookmarked' : 'Bookmark removed');
  }));
  root.querySelectorAll('.reveal-solution').forEach((button) => button.addEventListener('click', () => {
    const solution = button.closest('.question-card').querySelector('.solution');
    solution.hidden = !solution.hidden;
    button.textContent = solution.hidden ? 'View solution' : 'Hide solution';
    renderMath(solution);
  }));
  root.querySelectorAll('.revise-button').forEach((button) => button.addEventListener('click', () => {
    const id = button.closest('.question-card').dataset.questionId;
    const values = Storage.get('mistakes', []);
    if (!values.includes(id)) Storage.set('mistakes', [...values, id]);
    toast('Added to Revise Later');
  }));
  root.querySelectorAll('.check-answer').forEach((button) => button.addEventListener('click', () => {
    const card = button.closest('.question-card');
    const question = map.get(card.dataset.questionId);
    const answer = readAnswer(card, question);
    if (!isAttempted(question, answer)) { toast('Choose or enter an answer first'); return; }
    const correct = answerIsCorrect(question, answer);
    button.textContent = correct ? 'Correct' : 'Not quite';
    button.classList.toggle('secondary', !correct);
    if (!correct) {
      const values = Storage.get('mistakes', []);
      if (!values.includes(question.id)) Storage.set('mistakes', [...values, question.id]);
    }
    const solved = Storage.get('solved', []);
    if (!solved.includes(question.id)) Storage.set('solved', [...solved, question.id]);
    card.querySelector('.solution').hidden = false;
    renderMath(card);
    onAnswer?.(question, correct);
  }));
}

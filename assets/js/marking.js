export function answerIsCorrect(question, answer) {
  if (question.type === 'NAT') {
    if (answer === '' || answer === null || answer === undefined) return false;
    return Math.abs(Number(answer) - question.nat_answer.value) <= question.nat_answer.tolerance;
  }
  const given = Array.isArray(answer) ? [...answer].sort() : answer ? [answer] : [];
  return JSON.stringify(given) === JSON.stringify([...question.correct].sort());
}

export function isAttempted(question, answer) {
  return question.type === 'NAT' ? answer !== '' && answer !== null && answer !== undefined : Array.isArray(answer) && answer.length > 0;
}

export function scoreQuestion(question, answer) {
  if (!isAttempted(question, answer)) return { earned: 0, status: 'unattempted' };
  if (answerIsCorrect(question, answer)) return { earned: question.marks, status: 'correct' };
  if (question.type === 'MCQ') return { earned: -(question.marks / 3), status: 'wrong' };
  return { earned: 0, status: 'wrong' };
}

export function scoreTest(questions, answers) {
  const rows = questions.map((question) => ({ question, ...scoreQuestion(question, answers[question.id]) }));
  const score = rows.reduce((sum, row) => sum + row.earned, 0);
  const possible = questions.reduce((sum, question) => sum + question.marks, 0);
  const attempted = rows.filter((row) => row.status !== 'unattempted').length;
  const correct = rows.filter((row) => row.status === 'correct').length;
  const byTopic = Object.values(rows.reduce((acc, row) => {
    const key = row.question.topic;
    acc[key] ??= { topic: key, score: 0, possible: 0, correct: 0, total: 0 };
    acc[key].score += row.earned;
    acc[key].possible += row.question.marks;
    acc[key].correct += row.status === 'correct' ? 1 : 0;
    acc[key].total += 1;
    return acc;
  }, {}));
  return { score, possible, attempted, correct, accuracy: attempted ? (correct / attempted) * 100 : 0, rows, byTopic };
}

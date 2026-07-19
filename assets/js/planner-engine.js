const addDays = (date, days) => { const next = new Date(date); next.setDate(next.getDate() + days); return next; };
const iso = (date) => date.toISOString().slice(0, 10);

export function buildPlan(config, syllabus) {
  const days = [];
  let cursor = new Date(`${config.startDate}T12:00:00`);
  let dayNumber = 1;
  for (const subjectId of config.phaseOrder) {
    const subject = syllabus.subjects.find((item) => item.id === subjectId);
    subject.modules.forEach((moduleTitle, moduleIndex) => {
      const conceptDays = config.modulePacing[subjectId][moduleIndex];
      const tasks = [
        `Read the theory brief and build a one-page recall map. Solve 5 foundation questions.`,
        `Replay all worked examples without looking. Solve 8 foundation and 5 GATE-standard questions.`,
        `Solve the remaining GATE-standard and challenge set. Add every miss to Revise Later.`,
        `Deep-work extension: connect the hardest results, then redo two missed questions cold.`,
      ];
      for (let index = 0; index < conceptDays; index += 1) {
        const weekday = cursor.getDay();
        const isRevision = weekday === 0;
        days.push({ id: iso(cursor), date: iso(cursor), dayNumber, subject: subjectId, subjectTitle: subject.title, module: moduleIndex + 1, moduleTitle, kind: isRevision ? 'revision' : 'study', title: isRevision ? `Review · ${moduleTitle}` : moduleTitle, task: isRevision ? 'Light day: review your recall sheet and clear two items from Revise Later. Stop after 45 minutes.' : tasks[Math.min(index, tasks.length - 1)], minutes: isRevision ? 45 : index === 0 ? 75 : 95, locked: false });
        cursor = addDays(cursor, 1); dayNumber += 1;
      }
      days.push({ id: iso(cursor), date: iso(cursor), dayNumber, subject: subjectId, subjectTitle: subject.title, module: moduleIndex + 1, moduleTitle, kind: 'test', title: `Topic test · ${moduleTitle}`, task: 'Take the test in exam mode, then review every solution—even correct answers.', minutes: 40, testId: `topic-${subjectId}-${moduleIndex + 1}`, locked: false });
      cursor = addDays(cursor, 1); dayNumber += 1;
    });
    days.push({ id: iso(cursor), date: iso(cursor), dayNumber, subject: subjectId, subjectTitle: subject.title, kind: 'test', title: `${subject.title} subject test`, task: 'Simulate exam conditions. Review the topic breakdown and schedule your weakest module.', minutes: 75, testId: `subject-${subjectId}`, locked: false });
    cursor = addDays(cursor, 1); dayNumber += 1;
  }
  days.push({ id: iso(cursor), date: iso(cursor), dayNumber, subject: 'phase-1', subjectTitle: 'Phase 1', kind: 'test', title: 'Phase-1 cumulative test', task: 'One uninterrupted math-section simulation: Probability & Statistics plus Linear Algebra.', minutes: 90, testId: 'combined-phase-1', locked: false });
  cursor = addDays(cursor, 1); dayNumber += 1;

  for (const block of config.lockedBlocks) {
    const subject = syllabus.subjects.find((item) => item.id === block.subject);
    const title = subject?.title ?? 'Final revision & full mocks';
    const start = iso(cursor);
    const end = iso(addDays(cursor, block.weeks * 7 - 1));
    days.push({ id: `locked-${block.subject}`, date: start, endDate: end, dayNumber, subject: block.subject, subjectTitle: title, kind: 'locked', title, weeks: block.weeks, locked: true });
    cursor = addDays(cursor, block.weeks * 7); dayNumber += block.weeks * 7;
  }
  return days;
}

export function groupWeeks(days) {
  const live = days.filter((day) => !day.locked);
  const weeks = [];
  for (let index = 0; index < live.length; index += 7) weeks.push({ type: 'live', number: weeks.length + 1, days: live.slice(index, index + 7) });
  days.filter((day) => day.locked).forEach((day) => weeks.push({ type: 'locked', number: weeks.length + 1, days: [day] }));
  return weeks;
}

export function streak(completedDates) {
  const set = new Set(completedDates);
  let count = 0;
  const cursor = new Date();
  while (set.has(iso(cursor))) { count += 1; cursor.setDate(cursor.getDate() - 1); }
  return count;
}


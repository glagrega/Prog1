const headers = new Set(['pregunta', 'preguntas', 'question', 'questions']);

export function questionsFromRows(rows) {
  const nonempty = rows.filter(row => row.some(value => value != null && String(value).trim()));
  if (!nonempty.length) throw new Error('El Excel está vacío. Añade al menos una pregunta.');
  const headerColumn = nonempty[0].findIndex(value => headers.has(String(value ?? '').trim().toLowerCase()));
  const column = headerColumn >= 0 ? headerColumn : 0;
  const data = headerColumn >= 0 ? nonempty.slice(1) : nonempty;
  const questions = [...new Set(data.map(row => row[column]).filter(value => typeof value === 'string').map(value => value.trim()).filter(Boolean))];
  if (!questions.length) throw new Error('No encontramos preguntas. Usa una columna «Pregunta» o coloca los textos en la primera columna.');
  return questions;
}

export function pickQuestion(questions, random = Math.random) {
  if (!questions.length) return null;
  return questions[Math.floor(random() * questions.length)];
}

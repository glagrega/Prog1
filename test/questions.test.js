import test from 'node:test';
import assert from 'node:assert/strict';
import { questionsFromRows, pickQuestion } from '../src/questions.js';

test('importa la columna Pregunta, elimina vacíos y duplicados', () => {
  assert.deepEqual(questionsFromRows([[null], ['ID', 'Pregunta'], [1, ' Primera '], [2, ''], [3, 'Segunda'], [4, 'Primera']]), ['Primera', 'Segunda']);
});
test('admite la primera columna sin encabezado', () => {
  assert.deepEqual(questionsFromRows([['¿Qué es HTML?'], [null], ['¿Qué es CSS?']]), ['¿Qué es HTML?', '¿Qué es CSS?']);
});
test('rechaza hojas vacías o con solo encabezado', () => {
  assert.throws(() => questionsFromRows([]), /vacío/);
  assert.throws(() => questionsFromRows([['Pregunta']]), /No encontramos/);
});
test('el sorteo cubre los extremos y permite un banco de una pregunta', () => {
  assert.equal(pickQuestion(['A', 'B', 'C'], () => 0), 'A');
  assert.equal(pickQuestion(['A', 'B', 'C'], () => 0.99999), 'C');
  assert.equal(pickQuestion(['A'], () => 0.5), 'A');
  assert.equal(pickQuestion([]), null);
});

import { describe, expect, it } from 'vitest';

import { getCompletionRatio, todoReducer, type Todo } from './todos';

const baseTodos: Todo[] = [
  { id: 'a', title: 'Scan card', lane: 'scan', done: false, createdAt: 1 },
  { id: 'b', title: 'Grade card', lane: 'grade', done: true, createdAt: 2 },
];

describe('todoReducer', () => {
  it('adds a trimmed todo to the top of the list', () => {
    const result = todoReducer(baseTodos, {
      type: 'add',
      title: '  Prepare trade offer  ',
      lane: 'trade',
      id: 'c',
      now: 3,
    });

    expect(result[0]).toEqual({
      id: 'c',
      title: 'Prepare trade offer',
      lane: 'trade',
      done: false,
      createdAt: 3,
    });
  });

  it('ignores blank todo titles', () => {
    expect(todoReducer(baseTodos, { type: 'add', title: ' ', lane: 'scan' })).toBe(
      baseTodos,
    );
  });

  it('toggles completion', () => {
    const result = todoReducer(baseTodos, { type: 'toggle', id: 'a' });
    expect(result[0]?.done).toBe(true);
  });
});

describe('getCompletionRatio', () => {
  it('returns the completed ratio', () => {
    expect(getCompletionRatio(baseTodos)).toBe(0.5);
  });

  it('handles empty lists', () => {
    expect(getCompletionRatio([])).toBe(0);
  });
});

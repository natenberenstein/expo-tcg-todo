import { describe, expect, it } from 'vitest';

import { getCompletionRatio, todoReducer, type Todo } from './todos';

const baseTodos: Todo[] = [
  {
    id: 'a',
    title: 'Scan card',
    lane: 'scan',
    done: false,
    createdAt: '2026-05-16T09:00:00.000Z',
  },
  {
    id: 'b',
    title: 'Grade card',
    lane: 'grade',
    done: true,
    createdAt: '2026-05-16T09:05:00.000Z',
  },
];

describe('todoReducer', () => {
  it('adds a trimmed todo to the top of the list', () => {
    const result = todoReducer(baseTodos, {
      type: 'add',
      title: '  Prepare trade offer  ',
      lane: 'trade',
      id: 'c',
      now: '2026-05-16T09:10:00.000Z',
    });

    expect(result[0]).toEqual({
      id: 'c',
      title: 'Prepare trade offer',
      lane: 'trade',
      done: false,
      createdAt: '2026-05-16T09:10:00.000Z',
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

import { TaskLane } from '../theme/tokens';

export type Todo = {
  id: string;
  title: string;
  lane: TaskLane;
  done: boolean;
  createdAt: number;
};

export type TodoAction =
  | { type: 'add'; title: string; lane: TaskLane; id?: string; now?: number }
  | { type: 'toggle'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'clear-completed' };

export const initialTodos: Todo[] = [
  {
    id: 'seed-1',
    title: 'Scan binder page for missing 151 cards',
    lane: 'scan',
    done: false,
    createdAt: 1,
  },
  {
    id: 'seed-2',
    title: 'Review grade ROI for top three raw cards',
    lane: 'grade',
    done: false,
    createdAt: 2,
  },
  {
    id: 'seed-3',
    title: 'Prepare shipping checklist for accepted offers',
    lane: 'ship',
    done: true,
    createdAt: 3,
  },
];

export function todoReducer(todos: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'add': {
      const title = action.title.trim();

      if (!title) {
        return todos;
      }

      return [
        {
          id: action.id ?? `todo-${Date.now()}`,
          title,
          lane: action.lane,
          done: false,
          createdAt: action.now ?? Date.now(),
        },
        ...todos,
      ];
    }
    case 'toggle':
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo,
      );
    case 'remove':
      return todos.filter((todo) => todo.id !== action.id);
    case 'clear-completed':
      return todos.filter((todo) => !todo.done);
    default:
      return todos;
  }
}

export function getCompletionRatio(todos: Todo[]): number {
  if (todos.length === 0) {
    return 0;
  }

  return todos.filter((todo) => todo.done).length / todos.length;
}

export function getLaneCount(todos: Todo[], lane: TaskLane): number {
  return todos.filter((todo) => todo.lane === lane && !todo.done).length;
}

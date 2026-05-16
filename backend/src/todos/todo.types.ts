export const taskLanes = ['scan', 'grade', 'trade', 'ship'] as const;

export type TaskLane = (typeof taskLanes)[number];

export const todoFilters = ['all', 'open', 'done'] as const;

export type TodoFilter = (typeof todoFilters)[number];

export type Todo = {
  id: string;
  title: string;
  lane: TaskLane;
  done: boolean;
  createdAt: string;
};

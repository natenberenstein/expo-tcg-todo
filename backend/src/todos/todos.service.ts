import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { CreateTodoDto } from './dto/create-todo.dto';
import { QueryTodosDto } from './dto/query-todos.dto';
import { taskLanes, type TaskLane, type Todo } from './todo.types';

const initialTodos: Todo[] = [
  {
    id: 'seed-1',
    title: 'Scan binder page for missing 151 cards',
    lane: 'scan',
    done: false,
    createdAt: new Date('2026-05-16T09:00:00.000Z').toISOString(),
  },
  {
    id: 'seed-2',
    title: 'Review grade ROI for top three raw cards',
    lane: 'grade',
    done: false,
    createdAt: new Date('2026-05-16T09:05:00.000Z').toISOString(),
  },
  {
    id: 'seed-3',
    title: 'Prepare shipping checklist for accepted offers',
    lane: 'ship',
    done: true,
    createdAt: new Date('2026-05-16T09:10:00.000Z').toISOString(),
  },
];

@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);
  private todos: Todo[] = [...initialTodos];

  findAll(query: QueryTodosDto = {}) {
    const filter = query.filter ?? 'all';

    const data = this.todos.filter((todo) => {
      if (query.lane && todo.lane !== query.lane) {
        return false;
      }

      if (filter === 'open') {
        return !todo.done;
      }

      if (filter === 'done') {
        return todo.done;
      }

      return true;
    });

    this.logger.log(
      `Listed ${data.length} todos filter=${filter} lane=${query.lane ?? 'any'}`,
    );

    return {
      data,
      meta: this.getSummary(),
    };
  }

  create(dto: CreateTodoDto): Todo {
    const todo: Todo = {
      id: randomUUID(),
      title: dto.title.trim(),
      lane: dto.lane,
      done: false,
      createdAt: new Date().toISOString(),
    };

    this.todos = [todo, ...this.todos];
    this.logger.log(`Created todo id=${todo.id} lane=${todo.lane} title="${todo.title}"`);

    return todo;
  }

  toggle(id: string): Todo {
    const todo = this.findByIdOrThrow(id);
    todo.done = !todo.done;
    this.logger.log(`Toggled todo id=${todo.id} done=${todo.done}`);

    return todo;
  }

  remove(id: string) {
    this.findByIdOrThrow(id);
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.logger.log(`Removed todo id=${id}`);

    return { removed: true };
  }

  clearCompleted() {
    const before = this.todos.length;
    this.todos = this.todos.filter((todo) => !todo.done);
    this.logger.log(`Cleared completed todos removed=${before - this.todos.length}`);

    return {
      removed: before - this.todos.length,
    };
  }

  getSummary() {
    const completedCount = this.todos.filter((todo) => todo.done).length;
    const openCount = this.todos.length - completedCount;
    const laneCounts = taskLanes.reduce<Record<TaskLane, number>>(
      (counts, lane) => ({
        ...counts,
        [lane]: this.todos.filter((todo) => todo.lane === lane && !todo.done).length,
      }),
      {
        scan: 0,
        grade: 0,
        trade: 0,
        ship: 0,
      },
    );

    return {
      completedCount,
      completionRatio: this.todos.length === 0 ? 0 : completedCount / this.todos.length,
      laneCounts,
      openCount,
      total: this.todos.length,
    };
  }

  private findByIdOrThrow(id: string): Todo {
    const todo = this.todos.find((item) => item.id === id);

    if (!todo) {
      this.logger.warn(`Todo not found id=${id}`);
      throw new NotFoundException(`Todo ${id} was not found.`);
    }

    return todo;
  }
}

import { type Todo } from '../domain/todos';
import { type TaskLane } from '../theme/tokens';

declare const process: {
  env?: {
    EXPO_PUBLIC_API_URL?: string;
  };
};

const configuredApiUrl =
  typeof process === 'undefined' ? undefined : process.env?.EXPO_PUBLIC_API_URL?.trim();

export const API_URL = (configuredApiUrl || 'http://localhost:3000/api').replace(
  /\/+$/,
  '',
);

type TodosResponse = {
  data: Todo[];
};

type ScanResponse = {
  todo: Todo;
};

type CreateTodoPayload = {
  title: string;
  lane: TaskLane;
};

type CreateScanPayload = {
  imageUri?: string;
  notes?: string;
};

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
  });
  const text = await response.text();
  const body = parseResponseBody(text);

  if (!response.ok) {
    throw new Error(getApiErrorMessage(body, response.statusText));
  }

  return body as T;
}

function parseResponseBody(text: string): unknown {
  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function getApiErrorMessage(body: unknown, fallback: string): string {
  if (typeof body !== 'object' || body === null) {
    return fallback;
  }

  if ('message' in body) {
    const message = body.message;

    if (Array.isArray(message)) {
      return message.join(', ');
    }

    if (typeof message === 'string') {
      return message;
    }
  }

  return fallback;
}

export async function getTodos(): Promise<Todo[]> {
  const response = await apiRequest<TodosResponse>('/todos');

  return response.data;
}

export function createTodo(payload: CreateTodoPayload): Promise<Todo> {
  return apiRequest<Todo>('/todos', {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
}

export function toggleTodo(id: string): Promise<Todo> {
  return apiRequest<Todo>(`/todos/${encodeURIComponent(id)}/toggle`, {
    method: 'PATCH',
  });
}

export function removeTodo(id: string): Promise<{ removed: boolean }> {
  return apiRequest<{ removed: boolean }>(`/todos/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export function clearCompletedTodos(): Promise<{ removed: number }> {
  return apiRequest<{ removed: number }>('/todos/completed', {
    method: 'DELETE',
  });
}

export function createScan(payload: CreateScanPayload): Promise<ScanResponse> {
  return apiRequest<ScanResponse>('/scans', {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
}

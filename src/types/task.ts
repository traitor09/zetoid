export interface Task {
  id: string;
  title: string;
  dueDate: Date | null;
  priority: number; // 1=high, 3=medium, 5=low
  tags: string[];
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RawTaskFromDB {
  id: string;
  title: string;
  dueDate: Date | null;
  priority: number;
  tags: string; // JSON string
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParsedTask {
  title: string;
  dueDate: string | null;
  priority: number; // 1 | 3 | 5
  tags: string[];
  confidence?: number;
}

export type TaskFilter = 'all' | 'today' | 'upcoming' | 'high' | 'completed';

export interface CreateTaskInput {
  title: string;
  dueDate?: string | Date | null;
  priority?: number;
  tags?: string[];
}

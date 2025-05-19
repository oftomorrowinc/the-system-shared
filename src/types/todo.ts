// shared/types/todo.ts
import { z } from 'zod';
import { WithRequired } from './common';
import { User } from './user';
import { LucideIcon } from 'lucide-react';

// Todo schema for workflow tasks
export const TodoSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  taskId: z.string(),
  projectStep: z.number(),
  workflowStep: z.number().nullable(),
  name: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'blocked', 'approved', 'rejected']),
  assignedTo: z.array(z.string()).default([]),
  needsApproval: z.boolean().default(false),
  inputValues: z.record(z.string(), z.any()).optional(),
  outputValues: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deleted: z.boolean().default(false),
});

export type Todo = WithRequired<z.infer<typeof TodoSchema>, 'needsApproval'>;

// UI-related types

export interface TodoStatus {
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export interface TodoItemProps {
  todo: Todo;
  taskName: string;
  userMap: Record<string, User>;
  statusInfo: TodoStatus;
  isOwner: boolean;
  onStatusChange: (todoId: string, status: Todo['status']) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export interface TodoFormData {
  name: string;
  taskId: string;
  assignees: string[];
  needsApproval: boolean;
}

// Todo utility functions
export const isTodoComplete = (todo: Todo): boolean => {
  return todo.status === 'completed' || todo.status === 'approved';
};

export const isTodoPending = (todo: Todo): boolean => {
  return todo.status === 'pending' || todo.status === 'in_progress' || todo.status === 'blocked';
};

export const isTodoNeedsApproval = (todo: Todo): boolean => {
  return todo.status === 'completed' && todo.needsApproval;
};

export const getTodoStatusCounts = (
  todos: Todo[]
): {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  approved: number;
  blocked: number;
  needsApproval: number;
} => {
  return {
    total: todos.length,
    pending: todos.filter(todo => todo.status === 'pending').length,
    inProgress: todos.filter(todo => todo.status === 'in_progress').length,
    completed: todos.filter(todo => todo.status === 'completed').length,
    approved: todos.filter(todo => todo.status === 'approved').length,
    blocked: todos.filter(todo => todo.status === 'blocked').length,
    needsApproval: todos.filter(todo => todo.status === 'completed' && todo.needsApproval).length,
  };
};

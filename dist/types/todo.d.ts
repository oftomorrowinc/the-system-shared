import { z } from 'zod';
import { WithRequired } from './common';
import { User } from './user';
import { LucideIcon } from 'lucide-react';
export declare const TodoSchema: z.ZodObject<
  {
    id: z.ZodString;
    projectId: z.ZodString;
    taskId: z.ZodString;
    projectStep: z.ZodNumber;
    workflowStep: z.ZodNullable<z.ZodNumber>;
    name: z.ZodString;
    status: z.ZodEnum<['pending', 'in_progress', 'completed', 'blocked', 'approved', 'rejected']>;
    assignedTo: z.ZodDefault<z.ZodArray<z.ZodString, 'many'>>;
    needsApproval: z.ZodDefault<z.ZodBoolean>;
    inputValues: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodAny>, 'many'>>;
    outputValues: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    deleted: z.ZodDefault<z.ZodBoolean>;
  },
  'strip',
  z.ZodTypeAny,
  {
    status: 'in_progress' | 'completed' | 'pending' | 'blocked' | 'approved' | 'rejected';
    name: string;
    id: string;
    projectId: string;
    projectStep: number;
    taskId: string;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
    workflowStep: number | null;
    assignedTo: string[];
    needsApproval: boolean;
    inputValues?: Record<string, any>[] | undefined;
    outputValues?: Record<string, any> | undefined;
  },
  {
    status: 'in_progress' | 'completed' | 'pending' | 'blocked' | 'approved' | 'rejected';
    name: string;
    id: string;
    projectId: string;
    projectStep: number;
    taskId: string;
    createdAt: string;
    updatedAt: string;
    workflowStep: number | null;
    deleted?: boolean | undefined;
    assignedTo?: string[] | undefined;
    needsApproval?: boolean | undefined;
    inputValues?: Record<string, any>[] | undefined;
    outputValues?: Record<string, any> | undefined;
  }
>;
export type Todo = WithRequired<z.infer<typeof TodoSchema>, 'needsApproval'>;
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
export declare const isTodoComplete: (todo: Todo) => boolean;
export declare const isTodoPending: (todo: Todo) => boolean;
export declare const isTodoNeedsApproval: (todo: Todo) => boolean;
export declare const getTodoStatusCounts: (todos: Todo[]) => {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  approved: number;
  blocked: number;
  needsApproval: number;
};

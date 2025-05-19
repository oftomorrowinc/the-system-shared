// shared/types/message.ts
import { z } from 'zod';
import { convertTimestampToISOString } from './common';

// Message types
export const MessageTypeSchema = z.enum([
  'text',
  'file',
  'status_update',
  'member_update',
  'system',
]);

export const MessageSchema = z.object({
  id: z.string().optional(),
  projectId: z.string(),
  stepId: z.string().nullable().optional(),
  todoId: z.string().nullable().optional(),
  senderId: z.string(),
  senderRole: z.string(),
  content: z.string(),
  type: MessageTypeSchema,
  aiMessage: z.boolean(),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.preprocess(val => convertTimestampToISOString(val), z.string().datetime()),
  updatedAt: z.preprocess(val => convertTimestampToISOString(val), z.string().datetime()),
  deleted: z.boolean().default(false),
});

export const createMessage = (
  projectId: string,
  senderId: string,
  senderRole: string,
  content: string,
  type: MessageType,
  options: {
    stepId?: string | null;
    todoId?: string | null;
    aiMessage?: boolean;
    metadata?: Record<string, unknown>;
  } = {}
): Omit<Message, 'id'> => {
  const now = new Date().toISOString();

  return {
    projectId,
    stepId: options.stepId ?? null,
    todoId: options.todoId ?? null,
    senderId,
    senderRole,
    content,
    type,
    aiMessage: options.aiMessage ?? false,
    metadata: options.metadata,
    createdAt: now,
    updatedAt: now,
    deleted: false,
  };
};

export type Message = z.infer<typeof MessageSchema> & { id: string };
export type MessageType = z.infer<typeof MessageTypeSchema>;

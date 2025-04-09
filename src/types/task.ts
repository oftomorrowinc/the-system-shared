// shared/types/task.ts
import { z } from 'zod';
import { MetricsSchema, WithRequired } from './common';

export const TaskSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  visibility: z.enum(['public', 'private']),
  organizationId: z.string().optional().nullable(),
  description: z.string(),
  successCriteria: z.array(z.string()),
  processSteps: z.array(z.string()),
  inputSchemaId: z.string(),
  outputSchemaId: z.string(),
  tools: z.array(z.string()).default([]),
  subTasks: z.array(z.string()).default([]),
  model: z.string().optional().nullable(),
  stopSequence: z.array(z.string()).optional().nullable(),
  maxOutputTokens: z.number().default(4096),
  temperature: z.number().default(1),
  topP: z.number().default(0.95),
  topK: z.number().default(32),
  metrics: MetricsSchema,
  version: z.number().default(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deleted: z.boolean().default(false),
});

export type Task = WithRequired<z.infer<typeof TaskSchema>, 'description' | 'version' | 'deleted'>;

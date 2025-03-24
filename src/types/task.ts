// shared/types/task.ts
import { z } from 'zod';
import { MetricsSchema, WithRequired } from './common';

export const TaskSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  visibility: z.enum(['public', 'private']),
  organizationId: z.string().nullable().optional(),
  description: z.string(),
  successCriteria: z.array(z.string()),
  training: z.array(
    z.object({
      url: z.string(),
    }),
  ),
  tips: z.array(z.string()),

  // Schema IDs only
  inputSchemaId: z.string(),
  outputSchemaId: z.string(),

  tools: z.array(z.string()).default([]),
  subTasks: z.array(z.string()).default([]),
  metrics: MetricsSchema,
  version: z.number().default(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deleted: z.boolean().default(false),
});

export type Task = WithRequired<z.infer<typeof TaskSchema>, 'description' | 'version' | 'deleted'>;

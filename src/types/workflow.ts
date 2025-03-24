// shared/types/workflow.ts
import { z } from 'zod';
import { MetricsSchema } from './common';

// Workflow step schema
export const WorkflowStepSchema = z.object({
  taskId: z.string(),
  indentLevel: z.number().int().min(0),
});

export const WorkflowSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  visibility: z.enum(['public', 'private']),
  organizationId: z.string().nullable().optional(),
  version: z.number().default(1),
  requiredRoles: z.array(z.string()).default([]),
  steps: z.array(WorkflowStepSchema),
  metrics: MetricsSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deleted: z.boolean().default(false),
});

export type Workflow = z.infer<typeof WorkflowSchema>;
export type WorkflowStep = z.infer<typeof WorkflowStepSchema>;

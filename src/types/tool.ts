// shared/types/tool.ts
import { z } from 'zod';
import { isCamelCase, WithRequired } from './common';

// Schema for Tool definition
export const ToolSchema = z.object({
  id: z.string(),
  name: z.string().refine(isCamelCase, {
    message: "Name must be in camelCase format (e.g., 'myToolName')",
  }),
  description: z.string().min(1, 'Description is required'),
  visibility: z.enum(['public', 'private']),
  organizationId: z.string().nullable().optional(),
  version: z.number().default(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deleted: z.boolean().default(false),
});

export type Tool = WithRequired<z.infer<typeof ToolSchema>, 'version' | 'deleted'>;

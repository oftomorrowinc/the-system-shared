// shared/types/schema.ts
import { z } from 'zod';
import { WithRequired } from './common';

export const SchemaSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Schema name is required'),
  description: z.string(),
  schema: z.string().min(2, 'Schema content is required'), // JSON Schema content as string
  version: z.number().default(1),
  visibility: z.enum(['public', 'private']),
  organizationId: z.string().nullable().optional(),
  examples: z.array(z.string()).default([]), // Example valid values as JSON strings
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deleted: z.boolean().default(false),
});

export type Schema = WithRequired<z.infer<typeof SchemaSchema>, 'version' | 'deleted'>;

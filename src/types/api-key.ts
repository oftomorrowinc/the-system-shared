import { z } from 'zod';
import { WithRequired } from './common';

export const ApiKeySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'API Key name is required'),
  description: z.string().optional().nullable(),
  organizationId: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deleted: z.boolean().default(false),
});

export type ApiKey = WithRequired<z.infer<typeof ApiKeySchema>, 'deleted'>;

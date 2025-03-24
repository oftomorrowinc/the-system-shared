// shared/types/role.ts
import { z } from 'zod';
import { WithRequired } from './common';

// Role schema
export const RoleSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Role name is required'),
  description: z.string(),
  visibility: z.enum(['public', 'private']),
  organizationId: z.string().nullable().optional(),
  version: z.number().default(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deleted: z.boolean().default(false),
});

export type Role = WithRequired<z.infer<typeof RoleSchema>, 'version' | 'deleted'>;

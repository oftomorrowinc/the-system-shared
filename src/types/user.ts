// shared/types/user.ts
import { z } from 'zod';
import { MetricsSchema, isValidUsername, WithRequired } from './common';

// User schema
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string().refine(isValidUsername, {
    message: 'Username must start with a capital letter and only contain letters and numbers',
  }),
  email: z.string().email(),
  avatarUrl: z.string().optional(),
  organizationId: z.string().nullable().optional(),
  isSystemAdmin: z.boolean().default(false),
  isAi: z.boolean().default(false),
  metrics: z.object({
    tasksCompleted: z.number().int().min(0),
    successRate: z.number().min(0).max(1),
    avgResponseTime: z.number().min(0),
    avgRating: z.number().min(0).max(5).optional(),
    totalEarnings: z.number().min(0).optional(),
    specialties: z.record(z.string(), MetricsSchema),
  }),
  status: z.enum(['available', 'busy', 'offline']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;
export type SystemUser = WithRequired<User, 'isSystemAdmin' | 'isAi'>;

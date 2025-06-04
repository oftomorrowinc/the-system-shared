import { z } from 'zod';
import { WithRequired } from './common';

export const MonthlyTokenRollupSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  month: z.string(), // Format: "2025-01"
  year: z.number().int(),
  monthNumber: z.number().int().min(1).max(12),

  // Usage metrics
  totalTokensUsed: z.number().int().min(0).default(0),

  // Metadata
  isCurrentMonth: z.boolean().default(false),
  finalizedAt: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type MonthlyTokenRollup = WithRequired<
  z.infer<typeof MonthlyTokenRollupSchema>,
  'isCurrentMonth'
>;

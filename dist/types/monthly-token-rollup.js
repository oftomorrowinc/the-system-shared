'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.MonthlyTokenRollupSchema = void 0;
const zod_1 = require('zod');
exports.MonthlyTokenRollupSchema = zod_1.z.object({
  id: zod_1.z.string(),
  organizationId: zod_1.z.string(),
  month: zod_1.z.string(), // Format: "2025-01"
  year: zod_1.z.number().int(),
  monthNumber: zod_1.z.number().int().min(1).max(12),
  // Usage metrics
  totalTokensUsed: zod_1.z.number().int().min(0).default(0),
  // Metadata
  isCurrentMonth: zod_1.z.boolean().default(false),
  finalizedAt: zod_1.z.string().datetime().nullable().optional(),
  createdAt: zod_1.z.string().datetime(),
  updatedAt: zod_1.z.string().datetime(),
});

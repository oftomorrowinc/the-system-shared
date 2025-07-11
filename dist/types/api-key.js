'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ApiKeySchema = void 0;
const zod_1 = require('zod');
exports.ApiKeySchema = zod_1.z.object({
  id: zod_1.z.string().optional(),
  name: zod_1.z.string().min(1, 'API Key name is required'),
  description: zod_1.z.string().optional().nullable(),
  organizationId: zod_1.z.string().nullable().optional(),
  createdAt: zod_1.z.string().datetime(),
  updatedAt: zod_1.z.string().datetime(),
  deleted: zod_1.z.boolean().default(false),
});

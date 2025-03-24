"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleSchema = void 0;
// shared/types/role.ts
const zod_1 = require("zod");
// Role schema
exports.RoleSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().min(1, 'Role name is required'),
    description: zod_1.z.string(),
    visibility: zod_1.z.enum(['public', 'private']),
    organizationId: zod_1.z.string().nullable().optional(),
    version: zod_1.z.number().default(1),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    deleted: zod_1.z.boolean().default(false),
});

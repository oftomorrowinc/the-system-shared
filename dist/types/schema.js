"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaSchema = void 0;
// shared/types/schema.ts
const zod_1 = require("zod");
exports.SchemaSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().min(1, 'Schema name is required'),
    description: zod_1.z.string(),
    schema: zod_1.z.string().min(2, 'Schema content is required'), // JSON Schema content as string
    version: zod_1.z.number().default(1),
    visibility: zod_1.z.enum(['public', 'private']),
    organizationId: zod_1.z.string().nullable().optional(),
    examples: zod_1.z.array(zod_1.z.string()).default([]), // Example valid values as JSON strings
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    deleted: zod_1.z.boolean().default(false),
});

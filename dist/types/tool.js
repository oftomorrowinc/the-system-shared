"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolSchema = void 0;
// shared/types/tool.ts
const zod_1 = require("zod");
const common_1 = require("./common");
// Schema for Tool definition
exports.ToolSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().refine(common_1.isCamelCase, {
        message: "Name must be in camelCase format (e.g., 'myToolName')",
    }),
    description: zod_1.z.string().min(1, 'Description is required'),
    visibility: zod_1.z.enum(['public', 'private']),
    organizationId: zod_1.z.string().nullable().optional(),
    version: zod_1.z.number().default(1),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    deleted: zod_1.z.boolean().default(false),
});

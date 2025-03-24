"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowSchema = exports.WorkflowStepSchema = void 0;
// shared/types/workflow.ts
const zod_1 = require("zod");
const common_1 = require("./common");
// Workflow step schema
exports.WorkflowStepSchema = zod_1.z.object({
    taskId: zod_1.z.string(),
    indentLevel: zod_1.z.number().int().min(0),
});
exports.WorkflowSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    visibility: zod_1.z.enum(['public', 'private']),
    organizationId: zod_1.z.string().nullable().optional(),
    version: zod_1.z.number().default(1),
    requiredRoles: zod_1.z.array(zod_1.z.string()).default([]),
    steps: zod_1.z.array(exports.WorkflowStepSchema),
    metrics: common_1.MetricsSchema,
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    deleted: zod_1.z.boolean().default(false),
});

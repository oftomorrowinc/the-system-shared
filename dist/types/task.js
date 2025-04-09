"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSchema = void 0;
// shared/types/task.ts
const zod_1 = require("zod");
const common_1 = require("./common");
exports.TaskSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    role: zod_1.z.string(),
    visibility: zod_1.z.enum(['public', 'private']),
    organizationId: zod_1.z.string().nullable().optional(),
    description: zod_1.z.string(),
    successCriteria: zod_1.z.array(zod_1.z.string()),
    processSteps: zod_1.z.array(zod_1.z.string()),
    inputSchemaId: zod_1.z.string(),
    outputSchemaId: zod_1.z.string(),
    tools: zod_1.z.array(zod_1.z.string()).default([]),
    subTasks: zod_1.z.array(zod_1.z.string()).default([]),
    model: zod_1.z.string().optional(),
    stopSequence: zod_1.z.array(zod_1.z.string()).optional(),
    maxOutputTokens: zod_1.z.number().default(4096),
    temperature: zod_1.z.number().default(1),
    topP: zod_1.z.number().default(0.95),
    topK: zod_1.z.number().default(32),
    metrics: common_1.MetricsSchema,
    version: zod_1.z.number().default(1),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    deleted: zod_1.z.boolean().default(false),
});

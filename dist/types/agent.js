"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentToolSchema = exports.AgentConfigSchema = void 0;
// shared/types/agent.ts
const zod_1 = require("zod");
// Agent configuration schema
exports.AgentConfigSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    tools: zod_1.z.array(zod_1.z.string()).optional(),
    maxTurns: zod_1.z.number().positive().optional(),
    system: zod_1.z.string(),
});
// Agent tool schema
exports.AgentToolSchema = zod_1.z.object({
    name: zod_1.z.string(),
    type: zod_1.z.enum(['agent', 'tool']),
});

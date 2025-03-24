"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
// shared/types/user.ts
const zod_1 = require("zod");
const common_1 = require("./common");
// User schema
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    username: zod_1.z.string().refine(common_1.isValidUsername, {
        message: 'Username must start with a capital letter and only contain letters and numbers',
    }),
    email: zod_1.z.string().email(),
    avatarUrl: zod_1.z.string().optional(),
    organizationId: zod_1.z.string().nullable().optional(),
    isSystemAdmin: zod_1.z.boolean().default(false),
    isAi: zod_1.z.boolean().default(false),
    availableRoles: zod_1.z.array(zod_1.z.string()),
    preferredRoles: zod_1.z.array(zod_1.z.string()),
    metrics: zod_1.z.object({
        tasksCompleted: zod_1.z.number().int().min(0),
        successRate: zod_1.z.number().min(0).max(1),
        avgResponseTime: zod_1.z.number().min(0),
        avgRating: zod_1.z.number().min(0).max(5).optional(),
        totalEarnings: zod_1.z.number().min(0).optional(),
        specialties: zod_1.z.record(zod_1.z.string(), common_1.MetricsSchema),
    }),
    status: zod_1.z.enum(['available', 'busy', 'offline']),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSchema = exports.OrganizationSettingsSchema = exports.OrganizationMemberSchema = exports.OrganizationMemberRoleSchema = void 0;
// shared/types/organization.ts
const zod_1 = require("zod");
// Organization member role
exports.OrganizationMemberRoleSchema = zod_1.z.enum(['owner', 'admin', 'member']);
// Organization member schema
exports.OrganizationMemberSchema = zod_1.z.object({
    role: exports.OrganizationMemberRoleSchema,
    joinedAt: zod_1.z.string().datetime(),
});
// Organization settings schema
exports.OrganizationSettingsSchema = zod_1.z.object({
    allowAiAssistants: zod_1.z.boolean().default(true),
    defaultProjectVisibility: zod_1.z.enum(['private', 'organization']).default('organization'),
    requireApprovals: zod_1.z.boolean().default(false),
});
// Organization Schema
exports.OrganizationSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().min(1, 'Organization name is required'),
    description: zod_1.z.string().optional(),
    logoUrl: zod_1.z
        .union([
        zod_1.z.string().url(), // Valid URL
        zod_1.z.string().length(0), // Empty string
        zod_1.z.null(), // Null value
    ])
        .optional(),
    ownerId: zod_1.z.string(), // The user ID of the organization owner
    members: zod_1.z.record(zod_1.z.string(), exports.OrganizationMemberSchema),
    settings: exports.OrganizationSettingsSchema,
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    deleted: zod_1.z.boolean().default(false),
});

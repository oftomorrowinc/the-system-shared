"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectSchema = exports.ProjectMetricsSchema = exports.ProjectSettingsSchema = exports.ProjectMemberSchema = exports.ProjectMemberStatusSchema = void 0;
exports.processProjectData = processProjectData;
// shared/types/project.ts
const zod_1 = require("zod");
// Project member status
exports.ProjectMemberStatusSchema = zod_1.z.enum(['invited', 'active', 'removed', 'left', 'declined']);
// Project member schema
exports.ProjectMemberSchema = zod_1.z.object({
    roles: zod_1.z.array(zod_1.z.string()),
    status: exports.ProjectMemberStatusSchema.default('active'),
});
// Project settings schema
exports.ProjectSettingsSchema = zod_1.z.object({
    notifications: zod_1.z.object({
        onMessage: zod_1.z.boolean(),
        onStepComplete: zod_1.z.boolean(),
        onMemberChange: zod_1.z.boolean(),
    }),
    visibility: zod_1.z.enum(['public', 'private', 'organization']),
    allowAiAssistance: zod_1.z.boolean(),
    requireApprovals: zod_1.z.boolean().default(false),
});
// Project metrics schema
exports.ProjectMetricsSchema = zod_1.z.object({
    totalTime: zod_1.z.number().min(0),
    totalCost: zod_1.z.number().min(0),
    estimatedCompletion: zod_1.z.string().datetime(),
    estimatedTotalCost: zod_1.z.number().min(0),
    completedSteps: zod_1.z.number().int().min(0),
    totalSteps: zod_1.z.number().int().min(0),
    messagesCount: zod_1.z.number().int().min(0),
});
// Project schema
exports.ProjectSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    organizationId: zod_1.z.string().nullable().optional(),
    workflow: zod_1.z.string(),
    workflowVersion: zod_1.z.number(),
    status: zod_1.z.enum(['not_started', 'in_progress', 'completed', 'failed', 'on_hold']),
    owners: zod_1.z.array(zod_1.z.string()),
    members: zod_1.z.record(zod_1.z.string(), exports.ProjectMemberSchema),
    metrics: exports.ProjectMetricsSchema,
    settings: exports.ProjectSettingsSchema.default({
        notifications: {
            onMessage: true,
            onStepComplete: true,
            onMemberChange: true,
        },
        visibility: 'public',
        allowAiAssistance: true,
        requireApprovals: false,
    }),
    webhookUrl: zod_1.z.string().optional(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    deleted: zod_1.z.boolean().default(false),
});
// Helper function to safely process project data
function processProjectData(data) {
    try {
        // Ensure properties exist and have default values
        // Ensure organizationId is properly set
        if (data.organizationId === undefined || data.organizationId === null) {
            data.organizationId = null;
        }
        // Remove currentStep and stepThreads if they exist
        if ('currentStep' in data) {
            delete data.currentStep;
        }
        if ('stepThreads' in data) {
            delete data.stepThreads;
        }
        // Remove todos if they exist (for backwards compatibility)
        if ('todos' in data) {
            delete data.todos;
        }
        // Remove files array (no longer used)
        if ('files' in data) {
            delete data.files;
        }
        // Ensure settings object exists with proper structure
        if (!data.settings || typeof data.settings !== 'object') {
            data.settings = {
                notifications: {
                    onMessage: true,
                    onStepComplete: true,
                    onMemberChange: true,
                },
                visibility: 'public',
                allowAiAssistance: true,
                requireApprovals: false,
            };
        }
        else {
            // Ensure notifications object exists
            if (!data.settings.notifications || typeof data.settings.notifications !== 'object') {
                data.settings.notifications = {
                    onMessage: true,
                    onStepComplete: true,
                    onMemberChange: true,
                };
            }
            else {
                // Remove onFileUpload if it exists
                if ('onFileUpload' in data.settings.notifications) {
                    delete data.settings.notifications.onFileUpload;
                }
            }
        }
        // Ensure deleted field exists
        if (data.deleted === undefined) {
            data.deleted = false;
        }
        // Update metrics to remove filesCount if it exists
        if (data.metrics && 'filesCount' in data.metrics) {
            delete data.metrics.filesCount;
        }
        // Apply schema validation
        return exports.ProjectSchema.parse(data);
    }
    catch (error) {
        console.error('Error processing project data:', error);
        return null;
    }
}

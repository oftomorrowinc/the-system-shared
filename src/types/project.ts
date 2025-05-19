// shared/types/project.ts
import { z } from 'zod';

// Project member status
export const ProjectMemberStatusSchema = z.enum([
  'invited',
  'active',
  'removed',
  'left',
  'declined',
]);

// Project member schema
export const ProjectMemberSchema = z.object({
  roles: z.array(z.string()),
  status: ProjectMemberStatusSchema.default('active'),
});

// Project settings schema
export const ProjectSettingsSchema = z.object({
  notifications: z.object({
    onMessage: z.boolean(),
    onStepComplete: z.boolean(),
    onMemberChange: z.boolean(),
  }),
  visibility: z.enum(['public', 'private', 'organization']),
  allowAiAssistance: z.boolean(),
  requireApprovals: z.boolean().default(false),
});

// Project metrics schema
export const ProjectMetricsSchema = z.object({
  totalTime: z.number().min(0),
  totalCost: z.number().min(0),
  estimatedCompletion: z.string().datetime(),
  estimatedTotalCost: z.number().min(0),
  completedSteps: z.number().int().min(0),
  totalSteps: z.number().int().min(0),
  messagesCount: z.number().int().min(0),
});

// Project schema
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  organizationId: z.string().nullable().optional(),
  workflow: z.string(),
  workflowVersion: z.number(),
  status: z.enum(['not_started', 'in_progress', 'completed', 'failed', 'on_hold']),
  owners: z.array(z.string()),
  members: z.record(z.string(), ProjectMemberSchema),
  metrics: ProjectMetricsSchema,
  settings: ProjectSettingsSchema.default({
    notifications: {
      onMessage: true,
      onStepComplete: true,
      onMemberChange: true,
    },
    visibility: 'public',
    allowAiAssistance: true,
    requireApprovals: false,
  }),
  webhookUrl: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deleted: z.boolean().default(false),
});

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectMember = z.infer<typeof ProjectMemberSchema>;
export type ProjectSettings = z.infer<typeof ProjectSettingsSchema>;
export type ProjectMetrics = z.infer<typeof ProjectMetricsSchema>;
export type ProjectMemberStatus = z.infer<typeof ProjectMemberStatusSchema>;

// Helper function to safely process project data
export function processProjectData(data: any): Project | null {
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
    } else {
      // Ensure notifications object exists
      if (!data.settings.notifications || typeof data.settings.notifications !== 'object') {
        data.settings.notifications = {
          onMessage: true,
          onStepComplete: true,
          onMemberChange: true,
        };
      } else {
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
    return ProjectSchema.parse(data);
  } catch (error) {
    console.error('Error processing project data:', error);
    return null;
  }
}

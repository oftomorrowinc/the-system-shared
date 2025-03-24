// shared/types/organization.ts
import { z } from 'zod';
import { WithRequired } from './common';

// Organization member role
export const OrganizationMemberRoleSchema = z.enum(['owner', 'admin', 'member']);

// Organization member schema
export const OrganizationMemberSchema = z.object({
  role: OrganizationMemberRoleSchema,
  joinedAt: z.string().datetime(),
});

// Organization settings schema
export const OrganizationSettingsSchema = z.object({
  allowAiAssistants: z.boolean().default(true),
  defaultProjectVisibility: z.enum(['private', 'organization']).default('organization'),
  requireApprovals: z.boolean().default(false),
});

// Organization Schema
export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Organization name is required'),
  description: z.string().optional(),
  logoUrl: z
    .union([
      z.string().url(), // Valid URL
      z.string().length(0), // Empty string
      z.null(), // Null value
    ])
    .optional(),
  ownerId: z.string(), // The user ID of the organization owner
  members: z.record(z.string(), OrganizationMemberSchema),
  settings: OrganizationSettingsSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deleted: z.boolean().default(false),
});

export type Organization = WithRequired<z.infer<typeof OrganizationSchema>, 'deleted' | 'settings'>;
export type OrganizationMember = z.infer<typeof OrganizationMemberSchema>;
export type OrganizationMemberRole = z.infer<typeof OrganizationMemberRoleSchema>;
export type OrganizationSettings = z.infer<typeof OrganizationSettingsSchema>;

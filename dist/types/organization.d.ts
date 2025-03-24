import { z } from 'zod';
import { WithRequired } from './common';
export declare const OrganizationMemberRoleSchema: z.ZodEnum<["owner", "admin", "member"]>;
export declare const OrganizationMemberSchema: z.ZodObject<{
    role: z.ZodEnum<["owner", "admin", "member"]>;
    joinedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    role: "owner" | "admin" | "member";
    joinedAt: string;
}, {
    role: "owner" | "admin" | "member";
    joinedAt: string;
}>;
export declare const OrganizationSettingsSchema: z.ZodObject<{
    allowAiAssistants: z.ZodDefault<z.ZodBoolean>;
    defaultProjectVisibility: z.ZodDefault<z.ZodEnum<["private", "organization"]>>;
    requireApprovals: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    allowAiAssistants: boolean;
    defaultProjectVisibility: "private" | "organization";
    requireApprovals: boolean;
}, {
    allowAiAssistants?: boolean | undefined;
    defaultProjectVisibility?: "private" | "organization" | undefined;
    requireApprovals?: boolean | undefined;
}>;
export declare const OrganizationSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    logoUrl: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString, z.ZodNull]>>;
    ownerId: z.ZodString;
    members: z.ZodRecord<z.ZodString, z.ZodObject<{
        role: z.ZodEnum<["owner", "admin", "member"]>;
        joinedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: "owner" | "admin" | "member";
        joinedAt: string;
    }, {
        role: "owner" | "admin" | "member";
        joinedAt: string;
    }>>;
    settings: z.ZodObject<{
        allowAiAssistants: z.ZodDefault<z.ZodBoolean>;
        defaultProjectVisibility: z.ZodDefault<z.ZodEnum<["private", "organization"]>>;
        requireApprovals: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        allowAiAssistants: boolean;
        defaultProjectVisibility: "private" | "organization";
        requireApprovals: boolean;
    }, {
        allowAiAssistants?: boolean | undefined;
        defaultProjectVisibility?: "private" | "organization" | undefined;
        requireApprovals?: boolean | undefined;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    deleted: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
    ownerId: string;
    members: Record<string, {
        role: "owner" | "admin" | "member";
        joinedAt: string;
    }>;
    settings: {
        allowAiAssistants: boolean;
        defaultProjectVisibility: "private" | "organization";
        requireApprovals: boolean;
    };
    description?: string | undefined;
    logoUrl?: string | null | undefined;
}, {
    name: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    members: Record<string, {
        role: "owner" | "admin" | "member";
        joinedAt: string;
    }>;
    settings: {
        allowAiAssistants?: boolean | undefined;
        defaultProjectVisibility?: "private" | "organization" | undefined;
        requireApprovals?: boolean | undefined;
    };
    description?: string | undefined;
    deleted?: boolean | undefined;
    logoUrl?: string | null | undefined;
}>;
export type Organization = WithRequired<z.infer<typeof OrganizationSchema>, 'deleted' | 'settings'>;
export type OrganizationMember = z.infer<typeof OrganizationMemberSchema>;
export type OrganizationMemberRole = z.infer<typeof OrganizationMemberRoleSchema>;
export type OrganizationSettings = z.infer<typeof OrganizationSettingsSchema>;

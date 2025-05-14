import { z } from 'zod';
export declare const ProjectMemberStatusSchema: z.ZodEnum<["invited", "active", "removed", "left", "declined"]>;
export declare const ProjectMemberSchema: z.ZodObject<{
    roles: z.ZodArray<z.ZodString, "many">;
    status: z.ZodDefault<z.ZodEnum<["invited", "active", "removed", "left", "declined"]>>;
}, "strip", z.ZodTypeAny, {
    status: "invited" | "active" | "removed" | "left" | "declined";
    roles: string[];
}, {
    roles: string[];
    status?: "invited" | "active" | "removed" | "left" | "declined" | undefined;
}>;
export declare const ProjectSettingsSchema: z.ZodObject<{
    notifications: z.ZodObject<{
        onMessage: z.ZodBoolean;
        onStepComplete: z.ZodBoolean;
        onMemberChange: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        onMessage: boolean;
        onStepComplete: boolean;
        onMemberChange: boolean;
    }, {
        onMessage: boolean;
        onStepComplete: boolean;
        onMemberChange: boolean;
    }>;
    visibility: z.ZodEnum<["public", "private", "organization"]>;
    allowAiAssistance: z.ZodBoolean;
    requireApprovals: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    requireApprovals: boolean;
    notifications: {
        onMessage: boolean;
        onStepComplete: boolean;
        onMemberChange: boolean;
    };
    visibility: "private" | "organization" | "public";
    allowAiAssistance: boolean;
}, {
    notifications: {
        onMessage: boolean;
        onStepComplete: boolean;
        onMemberChange: boolean;
    };
    visibility: "private" | "organization" | "public";
    allowAiAssistance: boolean;
    requireApprovals?: boolean | undefined;
}>;
export declare const ProjectMetricsSchema: z.ZodObject<{
    totalTime: z.ZodNumber;
    totalCost: z.ZodNumber;
    estimatedCompletion: z.ZodString;
    estimatedTotalCost: z.ZodNumber;
    completedSteps: z.ZodNumber;
    totalSteps: z.ZodNumber;
    messagesCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    totalCost: number;
    totalTime: number;
    estimatedCompletion: string;
    estimatedTotalCost: number;
    completedSteps: number;
    totalSteps: number;
    messagesCount: number;
}, {
    totalCost: number;
    totalTime: number;
    estimatedCompletion: string;
    estimatedTotalCost: number;
    completedSteps: number;
    totalSteps: number;
    messagesCount: number;
}>;
export declare const ProjectSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    organizationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    workflow: z.ZodString;
    workflowVersion: z.ZodNumber;
    status: z.ZodEnum<["not_started", "in_progress", "completed", "failed", "on_hold"]>;
    owners: z.ZodArray<z.ZodString, "many">;
    members: z.ZodRecord<z.ZodString, z.ZodObject<{
        roles: z.ZodArray<z.ZodString, "many">;
        status: z.ZodDefault<z.ZodEnum<["invited", "active", "removed", "left", "declined"]>>;
    }, "strip", z.ZodTypeAny, {
        status: "invited" | "active" | "removed" | "left" | "declined";
        roles: string[];
    }, {
        roles: string[];
        status?: "invited" | "active" | "removed" | "left" | "declined" | undefined;
    }>>;
    metrics: z.ZodObject<{
        totalTime: z.ZodNumber;
        totalCost: z.ZodNumber;
        estimatedCompletion: z.ZodString;
        estimatedTotalCost: z.ZodNumber;
        completedSteps: z.ZodNumber;
        totalSteps: z.ZodNumber;
        messagesCount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        totalCost: number;
        totalTime: number;
        estimatedCompletion: string;
        estimatedTotalCost: number;
        completedSteps: number;
        totalSteps: number;
        messagesCount: number;
    }, {
        totalCost: number;
        totalTime: number;
        estimatedCompletion: string;
        estimatedTotalCost: number;
        completedSteps: number;
        totalSteps: number;
        messagesCount: number;
    }>;
    settings: z.ZodDefault<z.ZodObject<{
        notifications: z.ZodObject<{
            onMessage: z.ZodBoolean;
            onStepComplete: z.ZodBoolean;
            onMemberChange: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            onMessage: boolean;
            onStepComplete: boolean;
            onMemberChange: boolean;
        }, {
            onMessage: boolean;
            onStepComplete: boolean;
            onMemberChange: boolean;
        }>;
        visibility: z.ZodEnum<["public", "private", "organization"]>;
        allowAiAssistance: z.ZodBoolean;
        requireApprovals: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        requireApprovals: boolean;
        notifications: {
            onMessage: boolean;
            onStepComplete: boolean;
            onMemberChange: boolean;
        };
        visibility: "private" | "organization" | "public";
        allowAiAssistance: boolean;
    }, {
        notifications: {
            onMessage: boolean;
            onStepComplete: boolean;
            onMemberChange: boolean;
        };
        visibility: "private" | "organization" | "public";
        allowAiAssistance: boolean;
        requireApprovals?: boolean | undefined;
    }>>;
    webhookUrl: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    deleted: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    status: "not_started" | "in_progress" | "completed" | "failed" | "on_hold";
    name: string;
    description: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
    members: Record<string, {
        status: "invited" | "active" | "removed" | "left" | "declined";
        roles: string[];
    }>;
    settings: {
        requireApprovals: boolean;
        notifications: {
            onMessage: boolean;
            onStepComplete: boolean;
            onMemberChange: boolean;
        };
        visibility: "private" | "organization" | "public";
        allowAiAssistance: boolean;
    };
    workflow: string;
    workflowVersion: number;
    owners: string[];
    metrics: {
        totalCost: number;
        totalTime: number;
        estimatedCompletion: string;
        estimatedTotalCost: number;
        completedSteps: number;
        totalSteps: number;
        messagesCount: number;
    };
    organizationId?: string | null | undefined;
    webhookUrl?: string | undefined;
}, {
    status: "not_started" | "in_progress" | "completed" | "failed" | "on_hold";
    name: string;
    description: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    members: Record<string, {
        roles: string[];
        status?: "invited" | "active" | "removed" | "left" | "declined" | undefined;
    }>;
    workflow: string;
    workflowVersion: number;
    owners: string[];
    metrics: {
        totalCost: number;
        totalTime: number;
        estimatedCompletion: string;
        estimatedTotalCost: number;
        completedSteps: number;
        totalSteps: number;
        messagesCount: number;
    };
    deleted?: boolean | undefined;
    settings?: {
        notifications: {
            onMessage: boolean;
            onStepComplete: boolean;
            onMemberChange: boolean;
        };
        visibility: "private" | "organization" | "public";
        allowAiAssistance: boolean;
        requireApprovals?: boolean | undefined;
    } | undefined;
    organizationId?: string | null | undefined;
    webhookUrl?: string | undefined;
}>;
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectMember = z.infer<typeof ProjectMemberSchema>;
export type ProjectSettings = z.infer<typeof ProjectSettingsSchema>;
export type ProjectMetrics = z.infer<typeof ProjectMetricsSchema>;
export type ProjectMemberStatus = z.infer<typeof ProjectMemberStatusSchema>;
export declare function processProjectData(data: any): Project | null;

import { z } from 'zod';
export declare const WorkflowStepSchema: z.ZodObject<{
    taskId: z.ZodString;
    indentLevel: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    taskId: string;
    indentLevel: number;
}, {
    taskId: string;
    indentLevel: number;
}>;
export declare const WorkflowSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    visibility: z.ZodEnum<["public", "private"]>;
    organizationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    version: z.ZodDefault<z.ZodNumber>;
    requiredRoles: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    steps: z.ZodArray<z.ZodObject<{
        taskId: z.ZodString;
        indentLevel: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        taskId: string;
        indentLevel: number;
    }, {
        taskId: string;
        indentLevel: number;
    }>, "many">;
    metrics: z.ZodObject<{
        totalAttempts: z.ZodNumber;
        successfulAttempts: z.ZodNumber;
        successRate: z.ZodNumber;
        avgTimeAll: z.ZodNumber;
        avgTimeSuccessful: z.ZodNumber;
        avgRating: z.ZodOptional<z.ZodNumber>;
        totalCost: z.ZodNumber;
        avgCost: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        totalAttempts: number;
        successfulAttempts: number;
        successRate: number;
        avgTimeAll: number;
        avgTimeSuccessful: number;
        totalCost: number;
        avgCost: number;
        avgRating?: number | undefined;
    }, {
        totalAttempts: number;
        successfulAttempts: number;
        successRate: number;
        avgTimeAll: number;
        avgTimeSuccessful: number;
        totalCost: number;
        avgCost: number;
        avgRating?: number | undefined;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    deleted: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
    visibility: "private" | "public";
    metrics: {
        totalAttempts: number;
        successfulAttempts: number;
        successRate: number;
        avgTimeAll: number;
        avgTimeSuccessful: number;
        totalCost: number;
        avgCost: number;
        avgRating?: number | undefined;
    };
    version: number;
    requiredRoles: string[];
    steps: {
        taskId: string;
        indentLevel: number;
    }[];
    organizationId?: string | null | undefined;
}, {
    name: string;
    description: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    visibility: "private" | "public";
    metrics: {
        totalAttempts: number;
        successfulAttempts: number;
        successRate: number;
        avgTimeAll: number;
        avgTimeSuccessful: number;
        totalCost: number;
        avgCost: number;
        avgRating?: number | undefined;
    };
    steps: {
        taskId: string;
        indentLevel: number;
    }[];
    deleted?: boolean | undefined;
    organizationId?: string | null | undefined;
    version?: number | undefined;
    requiredRoles?: string[] | undefined;
}>;
export type Workflow = z.infer<typeof WorkflowSchema>;
export type WorkflowStep = z.infer<typeof WorkflowStepSchema>;

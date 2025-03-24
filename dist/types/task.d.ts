import { z } from 'zod';
import { WithRequired } from './common';
export declare const TaskSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    role: z.ZodString;
    visibility: z.ZodEnum<["public", "private"]>;
    organizationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    description: z.ZodString;
    successCriteria: z.ZodArray<z.ZodString, "many">;
    training: z.ZodArray<z.ZodObject<{
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
    }, {
        url: string;
    }>, "many">;
    tips: z.ZodArray<z.ZodString, "many">;
    inputSchemaId: z.ZodString;
    outputSchemaId: z.ZodString;
    tools: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    subTasks: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
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
    version: z.ZodDefault<z.ZodNumber>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    deleted: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    tools: string[];
    id: string;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
    role: string;
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
    successCriteria: string[];
    training: {
        url: string;
    }[];
    tips: string[];
    inputSchemaId: string;
    outputSchemaId: string;
    subTasks: string[];
    organizationId?: string | null | undefined;
}, {
    name: string;
    description: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    role: string;
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
    successCriteria: string[];
    training: {
        url: string;
    }[];
    tips: string[];
    inputSchemaId: string;
    outputSchemaId: string;
    tools?: string[] | undefined;
    deleted?: boolean | undefined;
    organizationId?: string | null | undefined;
    version?: number | undefined;
    subTasks?: string[] | undefined;
}>;
export type Task = WithRequired<z.infer<typeof TaskSchema>, 'description' | 'version' | 'deleted'>;

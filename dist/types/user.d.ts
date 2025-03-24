import { z } from 'zod';
import { WithRequired } from './common';
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    username: z.ZodEffects<z.ZodString, string, string>;
    email: z.ZodString;
    avatarUrl: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isSystemAdmin: z.ZodDefault<z.ZodBoolean>;
    isAi: z.ZodDefault<z.ZodBoolean>;
    availableRoles: z.ZodArray<z.ZodString, "many">;
    preferredRoles: z.ZodArray<z.ZodString, "many">;
    metrics: z.ZodObject<{
        tasksCompleted: z.ZodNumber;
        successRate: z.ZodNumber;
        avgResponseTime: z.ZodNumber;
        avgRating: z.ZodOptional<z.ZodNumber>;
        totalEarnings: z.ZodOptional<z.ZodNumber>;
        specialties: z.ZodRecord<z.ZodString, z.ZodObject<{
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
        }>>;
    }, "strip", z.ZodTypeAny, {
        successRate: number;
        tasksCompleted: number;
        avgResponseTime: number;
        specialties: Record<string, {
            totalAttempts: number;
            successfulAttempts: number;
            successRate: number;
            avgTimeAll: number;
            avgTimeSuccessful: number;
            totalCost: number;
            avgCost: number;
            avgRating?: number | undefined;
        }>;
        avgRating?: number | undefined;
        totalEarnings?: number | undefined;
    }, {
        successRate: number;
        tasksCompleted: number;
        avgResponseTime: number;
        specialties: Record<string, {
            totalAttempts: number;
            successfulAttempts: number;
            successRate: number;
            avgTimeAll: number;
            avgTimeSuccessful: number;
            totalCost: number;
            avgCost: number;
            avgRating?: number | undefined;
        }>;
        avgRating?: number | undefined;
        totalEarnings?: number | undefined;
    }>;
    status: z.ZodEnum<["available", "busy", "offline"]>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "available" | "busy" | "offline";
    name: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    metrics: {
        successRate: number;
        tasksCompleted: number;
        avgResponseTime: number;
        specialties: Record<string, {
            totalAttempts: number;
            successfulAttempts: number;
            successRate: number;
            avgTimeAll: number;
            avgTimeSuccessful: number;
            totalCost: number;
            avgCost: number;
            avgRating?: number | undefined;
        }>;
        avgRating?: number | undefined;
        totalEarnings?: number | undefined;
    };
    username: string;
    email: string;
    isSystemAdmin: boolean;
    isAi: boolean;
    availableRoles: string[];
    preferredRoles: string[];
    organizationId?: string | null | undefined;
    avatarUrl?: string | undefined;
}, {
    status: "available" | "busy" | "offline";
    name: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    metrics: {
        successRate: number;
        tasksCompleted: number;
        avgResponseTime: number;
        specialties: Record<string, {
            totalAttempts: number;
            successfulAttempts: number;
            successRate: number;
            avgTimeAll: number;
            avgTimeSuccessful: number;
            totalCost: number;
            avgCost: number;
            avgRating?: number | undefined;
        }>;
        avgRating?: number | undefined;
        totalEarnings?: number | undefined;
    };
    username: string;
    email: string;
    availableRoles: string[];
    preferredRoles: string[];
    organizationId?: string | null | undefined;
    avatarUrl?: string | undefined;
    isSystemAdmin?: boolean | undefined;
    isAi?: boolean | undefined;
}>;
export type User = z.infer<typeof UserSchema>;
export type SystemUser = WithRequired<User, 'isSystemAdmin' | 'isAi'>;

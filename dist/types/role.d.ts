import { z } from 'zod';
import { WithRequired } from './common';
export declare const RoleSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    visibility: z.ZodEnum<["public", "private"]>;
    organizationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    version: z.ZodDefault<z.ZodNumber>;
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
    version: number;
    organizationId?: string | null | undefined;
}, {
    name: string;
    description: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    visibility: "private" | "public";
    deleted?: boolean | undefined;
    organizationId?: string | null | undefined;
    version?: number | undefined;
}>;
export type Role = WithRequired<z.infer<typeof RoleSchema>, 'version' | 'deleted'>;

import { z } from 'zod';
import { WithRequired } from './common';
/**
 * Schema definition for Document type
 */
export declare const DocumentSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    value: z.ZodAny;
    projectId: z.ZodString;
    schemaId: z.ZodString;
    projectStep: z.ZodNullable<z.ZodNumber>;
    todoId: z.ZodNullable<z.ZodString>;
    userId: z.ZodNullable<z.ZodString>;
    taskId: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodEffects<z.ZodString, string, unknown>;
    updatedAt: z.ZodEffects<z.ZodString, string, unknown>;
    deleted: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    projectId: string;
    schemaId: string;
    projectStep: number | null;
    todoId: string | null;
    userId: string | null;
    taskId: string | null;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
    value?: any;
    id?: string | undefined;
}, {
    name: string;
    projectId: string;
    schemaId: string;
    projectStep: number | null;
    todoId: string | null;
    userId: string | null;
    taskId: string | null;
    value?: any;
    id?: string | undefined;
    createdAt?: unknown;
    updatedAt?: unknown;
    deleted?: boolean | undefined;
}>;
/**
 * Document type definition derived from the schema
 */
export type Document = WithRequired<z.infer<typeof DocumentSchema>, 'deleted'>;
/**
 * Utility functions for documents
 */
export declare const getDocumentValue: <T>(document: Document) => T;
export declare const createDocument: (name: string, value: any, projectId: string, schemaId: string, options?: {
    projectStep?: number | null;
    todoId?: string | null;
    userId?: string | null;
    taskId?: string | null;
}) => Omit<Document, "id">;

// shared/types/document.ts
import { z } from 'zod';
import { WithRequired, convertTimestampToISOString } from './common';

/**
 * Schema definition for Document type
 */
export const DocumentSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  value: z.any(), // This could store any value based on the associated schema
  projectId: z.string(),
  schemaId: z.string(),
  projectStep: z.number().nullable(),
  isFinalOutput: z.boolean().default(false),
  todoId: z.string().nullable(),
  userId: z.string().nullable(),
  taskId: z.string().nullable(),
  createdAt: z.preprocess(val => convertTimestampToISOString(val), z.string().datetime()),
  updatedAt: z.preprocess(val => convertTimestampToISOString(val), z.string().datetime()),
  deleted: z.boolean().default(false),
});

/**
 * Document type definition derived from the schema
 */
export type Document = WithRequired<z.infer<typeof DocumentSchema>, 'deleted'>;

/**
 * Utility functions for documents
 */

// Get document value with proper typing based on schema
export const getDocumentValue = <T>(document: Document): T => {
  return document.value as T;
};

// Create a new document object with default values
export const createDocument = (
  name: string,
  value: any,
  projectId: string,
  schemaId: string,
  options: {
    projectStep?: number | null;
    todoId?: string | null;
    userId?: string | null;
    taskId?: string | null;
  } = {}
): Omit<Document, 'id'> => {
  const now = new Date().toISOString();

  return {
    name,
    value,
    projectId,
    schemaId,
    projectStep: options.projectStep ?? null,
    isFinalOutput: false,
    todoId: options.todoId ?? null,
    userId: options.userId ?? null,
    taskId: options.taskId ?? null,
    createdAt: now,
    updatedAt: now,
    deleted: false,
  };
};

import { z } from 'zod';
/**
 * Prepares data for storage in the database by converting to snake_case
 * @param data The data to prepare
 * @returns The data in snake_case
 */
export declare function prepareForDb<T extends Record<string, any>>(data: T): Record<string, any>;
/**
 * Processes data from the database by converting to camelCase and validating with a schema
 * @param data The data from the database
 * @param zodSchema The zod schema to validate against
 * @returns The validated and transformed data
 */
export declare function processFromDb<T>(data: Record<string, any>, zodSchema: z.ZodSchema<T>): T;

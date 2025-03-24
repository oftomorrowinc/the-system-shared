// shared/lib/data-utils.ts
import { z } from 'zod';
import { toCamelCase, toSnakeCase } from './case-conversion';

/**
 * Prepares data for storage in the database by converting to snake_case
 * @param data The data to prepare
 * @returns The data in snake_case
 */
export function prepareForDb<T extends Record<string, any>>(data: T): Record<string, any> {
  return toSnakeCase(data);
}

/**
 * Processes data from the database by converting to camelCase and validating with a schema
 * @param data The data from the database
 * @param zodSchema The zod schema to validate against
 * @returns The validated and transformed data
 */
export function processFromDb<T>(data: Record<string, any>, zodSchema: z.ZodSchema<T>): T {
  const camelCaseData = toCamelCase(data);
  return zodSchema.parse(camelCaseData);
}

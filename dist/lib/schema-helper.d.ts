/**
 * Schema Helper Library
 * A simplified JSON schema system with string, number, boolean, array and object data types.
 */
export type PrimitiveType = 'string' | 'number' | 'boolean';
/**
 * Checks if a schema name is camelCase and converts it to snake_case
 *
 * Note: The original camelToSnake adds an underscore before each capital letter,
 * but we need to handle the first letter specially for schema names starting with capital
 * letters (e.g., "UserProfile" should become "user_profile", not "_user_profile")
 */
export declare function convertSchemaName(name: string): string;
/**
 * Builds a schema from component schemas
 */
export declare function buildSchema(schemas: Record<string, any>[]): Record<string, any>;
/**
 * Validates a data object against a schema
 */
export declare function validateSchema(schema: Record<string, any>, data: any): any;

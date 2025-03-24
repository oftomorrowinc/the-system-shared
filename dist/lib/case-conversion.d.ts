type Primitive = string | number | boolean | null | undefined;
type JsonValue = Primitive | JsonObject | JsonArray;
interface JsonObject {
    [key: string]: JsonValue;
}
type JsonArray = JsonValue[];
type ConversionResult<T> = T extends Array<infer U> ? Array<ConversionResult<U>> : T extends object ? {
    [K: string]: JsonValue;
} : T;
/**
 * Converts a camelCase string to snake_case
 * Example: "helloWorld" => "hello_world"
 * Handles special cases like "APIKey" => "api_key" and "userIDAndName" => "user_id_and_name"
 */
export declare function camelToSnake(str: string): string;
/**
 * Converts a snake_case string to camelCase
 * Example: "hello_world" => "helloWorld"
 * Handles numbers in keys like "user_123_name" => "user123Name"
 */
export declare function snakeToCamel(str: string): string;
/**
 * Converts a camelCase string to PascalCase
 * Example: "helloWorld" => "HelloWorld"
 */
export declare function camelToPascal(str: string): string;
/**
 * Converts a PascalCase string to camelCase
 * Example: "HelloWorld" => "helloWorld"
 */
export declare function pascalToCamel(str: string): string;
/**
 * Converts a snake_case string to PascalCase
 * Example: "hello_world" => "HelloWorld"
 */
export declare function snakeToPascal(str: string): string;
/**
 * Converts a PascalCase string to snake_case
 * Example: "HelloWorld" => "hello_world"
 * Directly handles conversion to avoid double processing
 */
export declare function pascalToSnake(str: string): string;
/**
 * Deeply converts all object keys from camelCase to snake_case
 * Handles nested objects and arrays
 */
export declare function toSnakeCase<T>(obj: T): ConversionResult<T>;
/**
 * Deeply converts all object keys from snake_case to camelCase
 * Handles nested objects and arrays
 */
export declare function toCamelCase<T>(obj: T): ConversionResult<T>;
/**
 * Deeply converts all object keys from camelCase to PascalCase
 * Handles nested objects and arrays
 */
export declare function toPascalCase<T>(obj: T): ConversionResult<T>;
/**
 * Deeply converts all object keys from PascalCase to camelCase
 * Handles nested objects and arrays
 */
export declare function fromPascalCase<T>(obj: T): ConversionResult<T>;
export {};

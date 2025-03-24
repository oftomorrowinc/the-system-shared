"use strict";
// src/lib/case-conversion.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelToSnake = camelToSnake;
exports.snakeToCamel = snakeToCamel;
exports.camelToPascal = camelToPascal;
exports.pascalToCamel = pascalToCamel;
exports.snakeToPascal = snakeToPascal;
exports.pascalToSnake = pascalToSnake;
exports.toSnakeCase = toSnakeCase;
exports.toCamelCase = toCamelCase;
exports.toPascalCase = toPascalCase;
exports.fromPascalCase = fromPascalCase;
/**
 * Converts a camelCase string to snake_case
 * Example: "helloWorld" => "hello_world"
 * Handles special cases like "APIKey" => "api_key" and "userIDAndName" => "user_id_and_name"
 */
function camelToSnake(str) {
    // Handle consecutive uppercase letters (e.g., "API" in "APIKey")
    // Convert patterns like "APIKey" to "Api_key" first
    let result = str.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2');
    // Handle regular camelCase conversion
    result = result.replace(/([a-z0-9])([A-Z])/g, '$1_$2');
    // Convert to lowercase
    return result.toLowerCase();
}
/**
 * Converts a snake_case string to camelCase
 * Example: "hello_world" => "helloWorld"
 * Handles numbers in keys like "user_123_name" => "user123Name"
 */
function snakeToCamel(str) {
    return str.replace(/_([a-z0-9])/gi, (_, letter) => letter.toUpperCase());
}
/**
 * Converts a camelCase string to PascalCase
 * Example: "helloWorld" => "HelloWorld"
 */
function camelToPascal(str) {
    if (!str)
        return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * Converts a PascalCase string to camelCase
 * Example: "HelloWorld" => "helloWorld"
 */
function pascalToCamel(str) {
    if (!str)
        return str;
    return str.charAt(0).toLowerCase() + str.slice(1);
}
/**
 * Converts a snake_case string to PascalCase
 * Example: "hello_world" => "HelloWorld"
 */
function snakeToPascal(str) {
    return snakeToCamel(str).charAt(0).toUpperCase() + snakeToCamel(str).slice(1);
}
/**
 * Converts a PascalCase string to snake_case
 * Example: "HelloWorld" => "hello_world"
 * Directly handles conversion to avoid double processing
 */
function pascalToSnake(str) {
    if (!str)
        return str;
    // First character to lowercase
    const result = str.charAt(0).toLowerCase() + str.slice(1);
    // Then apply the same logic as camelToSnake
    return camelToSnake(result);
}
/**
 * Deeply converts all object keys from camelCase to snake_case
 * Handles nested objects and arrays
 */
function toSnakeCase(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => toSnakeCase(item));
    }
    return Object.entries(obj).reduce((result, [key, value]) => {
        // Skip id field and special Firebase fields
        if (key === 'id' || key.startsWith('_')) {
            result[key] = value;
            return result;
        }
        const snakeKey = camelToSnake(key);
        if (value === null || value === undefined) {
            result[snakeKey] = value;
        }
        else if (typeof value === 'object') {
            result[snakeKey] = toSnakeCase(value);
        }
        else {
            result[snakeKey] = value;
        }
        return result;
    }, {});
}
/**
 * Deeply converts all object keys from snake_case to camelCase
 * Handles nested objects and arrays
 */
function toCamelCase(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => toCamelCase(item));
    }
    return Object.entries(obj).reduce((result, [key, value]) => {
        // Skip id field and special Firebase fields
        if (key === 'id' || key.startsWith('_')) {
            result[key] = value;
            return result;
        }
        const camelKey = snakeToCamel(key);
        if (value === null || value === undefined) {
            result[camelKey] = value;
        }
        else if (typeof value === 'object') {
            result[camelKey] = toCamelCase(value);
        }
        else {
            result[camelKey] = value;
        }
        return result;
    }, {});
}
/**
 * Deeply converts all object keys from camelCase to PascalCase
 * Handles nested objects and arrays
 */
function toPascalCase(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => toPascalCase(item));
    }
    return Object.entries(obj).reduce((result, [key, value]) => {
        // Skip id field and special Firebase fields
        if (key === 'id' || key.startsWith('_')) {
            result[key] = value;
            return result;
        }
        const pascalKey = camelToPascal(key);
        if (value === null || value === undefined) {
            result[pascalKey] = value;
        }
        else if (typeof value === 'object') {
            result[pascalKey] = toPascalCase(value);
        }
        else {
            result[pascalKey] = value;
        }
        return result;
    }, {});
}
/**
 * Deeply converts all object keys from PascalCase to camelCase
 * Handles nested objects and arrays
 */
function fromPascalCase(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => fromPascalCase(item));
    }
    return Object.entries(obj).reduce((result, [key, value]) => {
        // Skip id field and special Firebase fields
        if (key === 'id' || key.startsWith('_')) {
            result[key] = value;
            return result;
        }
        const camelKey = pascalToCamel(key);
        if (value === null || value === undefined) {
            result[camelKey] = value;
        }
        else if (typeof value === 'object') {
            result[camelKey] = fromPascalCase(value);
        }
        else {
            result[camelKey] = value;
        }
        return result;
    }, {});
}

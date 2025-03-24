"use strict";
/**
 * Schema Helper Library
 * A simplified JSON schema system with string, number, boolean, array and object data types.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSchemaName = convertSchemaName;
exports.buildSchema = buildSchema;
exports.validateSchema = validateSchema;
const case_conversion_1 = require("./case-conversion");
// Just comment out the unused type to avoid the TS6196 warning
// type SchemaType = PrimitiveType | PrimitiveType[] | Record<string, PrimitiveType | PrimitiveType[]>;
/**
 * Checks if a schema name is camelCase and converts it to snake_case
 *
 * Note: The original camelToSnake adds an underscore before each capital letter,
 * but we need to handle the first letter specially for schema names starting with capital
 * letters (e.g., "UserProfile" should become "user_profile", not "_user_profile")
 */
function convertSchemaName(name) {
    if (/^[A-Z]/.test(name)) {
        // Special handling for CamelCase schema names - first letter needs to be lowercase without preceding underscore
        return name.charAt(0).toLowerCase() + (0, case_conversion_1.camelToSnake)(name.slice(1));
    }
    return name;
}
/**
 * Builds a schema from component schemas
 */
function buildSchema(schemas) {
    if (!schemas || !Array.isArray(schemas) || schemas.length === 0) {
        throw new Error('Schema must be an array of at least one object');
    }
    // Step 0: Ensure each object has a single top-level property key in snake_case
    schemas.forEach((schema) => {
        const keys = Object.keys(schema);
        if (keys.length !== 1) {
            throw new Error(`Schema must have exactly one top-level property, found ${keys.length}: ${keys.join(', ')}`);
        }
        const key = keys[0];
        // Add non-null assertion since we know key exists when we get keys[0]
        if (!/^[a-z][a-z0-9]*(_[a-z][a-z0-9]*)*$/.test(key)) {
            throw new Error(`Schema key "${key}" must be in snake_case`);
        }
    });
    // Step 1: Convert camelCase names to snake_case and check references
    const schemaMap = {};
    for (const schema of schemas) {
        const schemaName = Object.keys(schema)[0];
        // Add null check to ensure schemaName exists
        if (!schemaName) {
            throw new Error('Schema has no top-level property');
        }
        const schemaContent = schema[schemaName];
        schemaMap[schemaName] = schemaContent;
        // Helper function to find and check custom types in the schema
        function findAndCheckCustomTypes(obj, path = []) {
            if (Array.isArray(obj)) {
                for (let i = 0; i < obj.length; i++) {
                    const item = obj[i];
                    if (typeof item === 'string' && /^[A-Z]/.test(item)) {
                        const snakeCaseName = convertSchemaName(item);
                        // Check if the referenced schema exists
                        if (!schemas.some((s) => Object.keys(s)[0] === snakeCaseName)) {
                            throw new Error(`Referenced schema "${item}" (as ${snakeCaseName}) is missing`);
                        }
                        // Replace camelCase with snake_case in the schema
                        obj[i] = snakeCaseName;
                    }
                    else if (typeof item === 'object' && item !== null) {
                        findAndCheckCustomTypes(item, [...path, i.toString()]);
                    }
                }
            }
            else if (typeof obj === 'object' && obj !== null) {
                for (const [k, value] of Object.entries(obj)) {
                    // Renamed 'key' to 'k' to avoid the unused variable warning
                    if (typeof value === 'string' && /^[A-Z]/.test(value)) {
                        const snakeCaseName = convertSchemaName(value);
                        // Check if the referenced schema exists
                        if (!schemas.some((s) => Object.keys(s)[0] === snakeCaseName)) {
                            throw new Error(`Referenced schema "${value}" (as ${snakeCaseName}) is missing`);
                        }
                        // Replace camelCase with snake_case in the schema
                        obj[k] = snakeCaseName;
                    }
                    else if (typeof value === 'object' && value !== null) {
                        findAndCheckCustomTypes(value, [...path, k]);
                    }
                }
            }
        }
        findAndCheckCustomTypes(schemaContent);
    }
    // Step 2: Check for circular dependencies
    function checkCircularDependencies(schemaName, visited = new Set(), path = []) {
        // If we've already visited this schema in this path, we have a circular dependency
        if (visited.has(schemaName)) {
            throw new Error(`Circular dependency detected: ${[...path, schemaName].join(' -> ')}`);
        }
        const schema = schemas.find((s) => Object.keys(s)[0] === schemaName);
        if (!schema)
            return;
        const schemaContent = schema[schemaName];
        // Add current schema to visited set for this path
        const newVisited = new Set(visited);
        newVisited.add(schemaName);
        const newPath = [...path, schemaName];
        // Helper function to check references in objects
        function checkReferences(obj) {
            if (Array.isArray(obj)) {
                for (const item of obj) {
                    if (typeof item === 'string') {
                        // Check if it's a schema reference (should be snake_case at this point)
                        if (!['string', 'number', 'boolean'].includes(item) && schemas.some((s) => Object.keys(s)[0] === item)) {
                            // If the reference is to the current schema, it's a self-reference
                            if (item === schemaName) {
                                throw new Error(`Self reference detected in schema "${schemaName}"`);
                            }
                            // Otherwise, check for circular dependencies recursively
                            checkCircularDependencies(item, newVisited, newPath);
                        }
                    }
                    else if (typeof item === 'object' && item !== null) {
                        checkReferences(item);
                    }
                }
            }
            else if (typeof obj === 'object' && obj !== null) {
                for (const value of Object.values(obj)) {
                    // Changed to use Object.values to avoid unused 'key' variable
                    if (typeof value === 'string') {
                        // Check if it's a schema reference (should be snake_case at this point)
                        if (!['string', 'number', 'boolean'].includes(value) && schemas.some((s) => Object.keys(s)[0] === value)) {
                            // If the reference is to the current schema, it's a self-reference
                            if (value === schemaName) {
                                throw new Error(`Self reference detected in schema "${schemaName}"`);
                            }
                            // Otherwise, check for circular dependencies recursively
                            checkCircularDependencies(value, newVisited, newPath);
                        }
                    }
                    else if (typeof value === 'object' && value !== null) {
                        checkReferences(value);
                    }
                }
            }
        }
        checkReferences(schemaContent);
    }
    // Check for circular dependencies in each schema
    for (const schema of schemas) {
        const schemaName = Object.keys(schema)[0];
        if (schemaName) {
            // Add null check before calling function
            checkCircularDependencies(schemaName);
        }
    }
    // Step 3: Build the initial schema object (only the first schema)
    const firstSchema = schemas[0];
    // Add null check before getting keys
    if (!firstSchema) {
        throw new Error('No schema provided');
    }
    const firstSchemaName = Object.keys(firstSchema)[0];
    if (!firstSchemaName) {
        throw new Error('First schema has no top-level property');
    }
    const result = {};
    result[firstSchemaName] = firstSchema[firstSchemaName];
    // Create a temporary full schema map for reference resolution
    const fullSchemaMap = {};
    for (const schema of schemas) {
        const schemaName = Object.keys(schema)[0];
        // Add null check
        if (schemaName) {
            fullSchemaMap[schemaName] = schema[schemaName];
        }
    }
    // Step 4: Ensure all data types are valid
    function validateDataTypes(obj, path = []) {
        if (Array.isArray(obj)) {
            if (obj.length === 0) {
                throw new Error(`Array at ${path.join('.')} must not be empty`);
            }
            obj.forEach((item, index) => {
                if (typeof item === 'string') {
                    if (!['string', 'number', 'boolean'].includes(item) && !schemas.some((s) => Object.keys(s)[0] === item)) {
                        throw new Error(`Invalid data type "${item}" at ${path.join('.')}.${index}, custom type not found in schemas`);
                    }
                }
                else if (typeof item === 'object' && item !== null) {
                    validateDataTypes(item, [...path, index.toString()]);
                }
            });
        }
        else if (typeof obj === 'object' && obj !== null) {
            for (const [key, value] of Object.entries(obj)) {
                if (typeof value === 'string') {
                    if (!['string', 'number', 'boolean'].includes(value) && !schemas.some((s) => Object.keys(s)[0] === value)) {
                        throw new Error(`Invalid data type "${value}" at ${path.join('.')}.${key}, custom type not found in schemas`);
                    }
                }
                else if (Array.isArray(value)) {
                    validateDataTypes(value, [...path, key]);
                }
                else if (typeof value === 'object' && value !== null) {
                    validateDataTypes(value, [...path, key]);
                }
            }
        }
    }
    // Pass definite non-null array to validateDataTypes
    validateDataTypes(result[firstSchemaName], [firstSchemaName]);
    // Step 5: Resolve schema references
    function resolveReferences(obj) {
        if (Array.isArray(obj)) {
            if (obj.length === 1) {
                const item = obj[0];
                // If the item is a string reference to another schema
                if (typeof item === 'string' && !['string', 'number', 'boolean'].includes(item) && fullSchemaMap[item]) {
                    // Create a new object with the referenced schema as its property
                    const resolvedObj = {};
                    resolvedObj[item] = resolveReferences(fullSchemaMap[item]);
                    // Return an array with the expanded object
                    return [resolvedObj];
                }
            }
            // For other arrays, resolve each item
            return obj.map((item) => resolveReferences(item));
        }
        else if (typeof obj === 'object' && obj !== null) {
            const resolved = {};
            for (const [key, value] of Object.entries(obj)) {
                resolved[key] = resolveReferences(value);
            }
            return resolved;
        }
        else if (typeof obj === 'string' && !['string', 'number', 'boolean'].includes(obj) && fullSchemaMap[obj]) {
            // If the value is a string reference to another schema
            return resolveReferences(fullSchemaMap[obj]);
        }
        return obj;
    }
    // Apply reference resolution - use non-null assertion since we've checked firstSchemaName earlier
    result[firstSchemaName] = resolveReferences(result[firstSchemaName]);
    return result;
}
/**
 * Validates a data object against a schema
 */
function validateSchema(schema, data) {
    // Check schema has a single top-level property in snake_case
    const schemaKeys = Object.keys(schema);
    if (schemaKeys.length !== 1) {
        throw new Error(`Schema must have exactly one top-level property, found ${schemaKeys.length}: ${schemaKeys.join(', ')}`);
    }
    const schemaKey = schemaKeys[0];
    if (!schemaKey) {
        throw new Error('Schema has no top-level property');
    }
    if (!/^[a-z][a-z0-9]*(_[a-z][a-z0-9]*)*$/.test(schemaKey)) {
        throw new Error(`Schema key "${schemaKey}" must be in snake_case`);
    }
    // Check data has a matching top-level property
    const dataKeys = Object.keys(data);
    if (dataKeys.length !== 1 || dataKeys[0] !== schemaKey) {
        throw new Error(`Data must have exactly one top-level property matching schema: ${schemaKey}`);
    }
    // Validate data against schema
    function validateData(schemaValue, dataValue, path) {
        // If schema is a primitive type string
        if (typeof schemaValue === 'string') {
            if (schemaValue === 'string') {
                if (typeof dataValue !== 'string') {
                    throw new Error(`Expected string at ${path.join('.')}, got ${typeof dataValue}`);
                }
                return dataValue;
            }
            else if (schemaValue === 'number') {
                if (typeof dataValue === 'string') {
                    const num = Number(dataValue);
                    if (isNaN(num)) {
                        throw new Error(`Cannot convert string "${dataValue}" to number at ${path.join('.')}`);
                    }
                    return num;
                }
                else if (typeof dataValue !== 'number') {
                    throw new Error(`Expected number at ${path.join('.')}, got ${typeof dataValue}`);
                }
                return dataValue;
            }
            else if (schemaValue === 'boolean') {
                if (typeof dataValue === 'string') {
                    if (dataValue.toLowerCase() === 'true')
                        return true;
                    if (dataValue.toLowerCase() === 'false')
                        return false;
                    throw new Error(`Cannot convert string "${dataValue}" to boolean at ${path.join('.')}`);
                }
                else if (typeof dataValue !== 'boolean') {
                    throw new Error(`Expected boolean at ${path.join('.')}, got ${typeof dataValue}`);
                }
                return dataValue;
            }
            else {
                // This is a custom type reference
                throw new Error(`Custom type "${schemaValue}" found in schema at ${path.join('.')}. Schema validation only supports primitive types.`);
            }
        }
        // If schema is an array
        else if (Array.isArray(schemaValue)) {
            if (!Array.isArray(dataValue)) {
                throw new Error(`Expected array at ${path.join('.')}, got ${typeof dataValue}`);
            }
            if (schemaValue.length !== 1) {
                throw new Error(`Schema array at ${path.join('.')} must have exactly one type definition`);
            }
            const schemaType = schemaValue[0];
            // If the schema type is a custom type (string that's not a primitive type)
            if (typeof schemaType === 'string' && !['string', 'number', 'boolean'].includes(schemaType)) {
                throw new Error(`Custom type "${schemaType}" found in schema array at ${path.join('.')}. Schema validation only supports primitive types.`);
            }
            return dataValue.map((item, index) => validateData(schemaType, item, [...path, index.toString()]));
        }
        // If schema is an object
        else if (typeof schemaValue === 'object' && schemaValue !== null) {
            if (typeof dataValue !== 'object' || dataValue === null) {
                throw new Error(`Expected object at ${path.join('.')}, got ${typeof dataValue}`);
            }
            const result = {};
            for (const key in schemaValue) {
                if (!(key in dataValue)) {
                    throw new Error(`Missing required property "${key}" at ${path.join('.')}`);
                }
                result[key] = validateData(schemaValue[key], dataValue[key], [...path, key]);
            }
            return result;
        }
        else {
            throw new Error(`Invalid schema value at ${path.join('.')}`);
        }
    }
    const result = {};
    // Use non-null assertion since we've checked schemaKey earlier
    result[schemaKey] = validateData(schema[schemaKey], data[schemaKey], [schemaKey]);
    return result;
}

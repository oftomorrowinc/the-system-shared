"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareForDb = prepareForDb;
exports.processFromDb = processFromDb;
const case_conversion_1 = require("./case-conversion");
/**
 * Prepares data for storage in the database by converting to snake_case
 * @param data The data to prepare
 * @returns The data in snake_case
 */
function prepareForDb(data) {
    return (0, case_conversion_1.toSnakeCase)(data);
}
/**
 * Processes data from the database by converting to camelCase and validating with a schema
 * @param data The data from the database
 * @param zodSchema The zod schema to validate against
 * @returns The validated and transformed data
 */
function processFromDb(data, zodSchema) {
    const camelCaseData = (0, case_conversion_1.toCamelCase)(data);
    return zodSchema.parse(camelCaseData);
}

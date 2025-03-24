"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsSchema = exports.isValidUsername = exports.isCamelCase = exports.convertTimestampToISOString = void 0;
// shared/types/common.ts
const zod_1 = require("zod");
// Helper function to safely convert any timestamp format to ISO string
const convertTimestampToISOString = (val) => {
    if (val == null)
        return new Date().toISOString();
    if (typeof val === 'string') {
        try {
            return new Date(val).toISOString();
        }
        catch {
            return new Date().toISOString();
        }
    }
    if (val instanceof Date)
        return val.toISOString();
    // Check for Firestore Timestamp with toDate method
    if (typeof val === 'object' && val !== null && 'toDate' in val && typeof val.toDate === 'function') {
        try {
            const date = val.toDate?.();
            return date ? date.toISOString() : new Date().toISOString();
        }
        catch {
            return new Date().toISOString();
        }
    }
    // Check for raw timestamp object with seconds
    if (typeof val === 'object' && val !== null && 'seconds' in val && typeof val.seconds === 'number') {
        try {
            const seconds = val.seconds;
            return seconds !== undefined ? new Date(seconds * 1000).toISOString() : new Date().toISOString();
        }
        catch {
            return new Date().toISOString();
        }
    }
    return new Date().toISOString();
};
exports.convertTimestampToISOString = convertTimestampToISOString;
// Helper function to validate camelCase
const isCamelCase = (value) => {
    // Regex for camelCase: starts with lowercase letter, followed by any number of letters/numbers
    // No special characters or underscores, and no uppercase first letter
    return /^[a-z][a-zA-Z0-9]*$/.test(value);
};
exports.isCamelCase = isCamelCase;
// Helper function to validate username format
const isValidUsername = (value) => {
    // Must start with capital letter and only contain letters and numbers
    return /^[A-Z][a-zA-Z0-9]*$/.test(value);
};
exports.isValidUsername = isValidUsername;
// Shared schemas that are used by multiple entities
exports.MetricsSchema = zod_1.z.object({
    totalAttempts: zod_1.z.number().int().min(0),
    successfulAttempts: zod_1.z.number().int().min(0),
    successRate: zod_1.z.number().min(0).max(1),
    avgTimeAll: zod_1.z.number().min(0),
    avgTimeSuccessful: zod_1.z.number().min(0),
    avgRating: zod_1.z.number().min(0).max(5).optional(),
    totalCost: zod_1.z.number().min(0),
    avgCost: zod_1.z.number().min(0),
});

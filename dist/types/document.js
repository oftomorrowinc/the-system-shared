"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocument = exports.getDocumentValue = exports.DocumentSchema = void 0;
// shared/types/document.ts
const zod_1 = require("zod");
const common_1 = require("./common");
/**
 * Schema definition for Document type
 */
exports.DocumentSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    name: zod_1.z.string(),
    value: zod_1.z.any(), // This could store any value based on the associated schema
    projectId: zod_1.z.string(),
    schemaId: zod_1.z.string(),
    projectStep: zod_1.z.number().nullable(),
    todoId: zod_1.z.string().nullable(),
    userId: zod_1.z.string().nullable(),
    taskId: zod_1.z.string().nullable(),
    createdAt: zod_1.z.preprocess((val) => (0, common_1.convertTimestampToISOString)(val), zod_1.z.string().datetime()),
    updatedAt: zod_1.z.preprocess((val) => (0, common_1.convertTimestampToISOString)(val), zod_1.z.string().datetime()),
    deleted: zod_1.z.boolean().default(false),
});
/**
 * Utility functions for documents
 */
// Get document value with proper typing based on schema
const getDocumentValue = (document) => {
    return document.value;
};
exports.getDocumentValue = getDocumentValue;
// Create a new document object with default values
const createDocument = (name, value, projectId, schemaId, options = {}) => {
    const now = new Date().toISOString();
    return {
        name,
        value,
        projectId,
        schemaId,
        projectStep: options.projectStep ?? null,
        todoId: options.todoId ?? null,
        userId: options.userId ?? null,
        taskId: options.taskId ?? null,
        createdAt: now,
        updatedAt: now,
        deleted: false,
    };
};
exports.createDocument = createDocument;

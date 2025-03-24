"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodoStatusCounts = exports.isTodoNeedsApproval = exports.isTodoPending = exports.isTodoComplete = exports.TodoSchema = void 0;
// shared/types/todo.ts
const zod_1 = require("zod");
// Todo schema for workflow tasks
exports.TodoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    projectId: zod_1.z.string(),
    taskId: zod_1.z.string(),
    projectStep: zod_1.z.number(),
    workflowStep: zod_1.z.number().nullable(),
    name: zod_1.z.string(),
    status: zod_1.z.enum(['pending', 'in_progress', 'completed', 'blocked', 'approved', 'rejected']),
    assignedTo: zod_1.z.array(zod_1.z.string()).default([]),
    needsApproval: zod_1.z.boolean().default(false),
    inputValues: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    outputValues: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    deleted: zod_1.z.boolean().default(false),
});
// Todo utility functions
const isTodoComplete = (todo) => {
    return todo.status === 'completed' || todo.status === 'approved';
};
exports.isTodoComplete = isTodoComplete;
const isTodoPending = (todo) => {
    return todo.status === 'pending' || todo.status === 'in_progress' || todo.status === 'blocked';
};
exports.isTodoPending = isTodoPending;
const isTodoNeedsApproval = (todo) => {
    return todo.status === 'completed' && todo.needsApproval;
};
exports.isTodoNeedsApproval = isTodoNeedsApproval;
const getTodoStatusCounts = (todos) => {
    return {
        total: todos.length,
        pending: todos.filter((todo) => todo.status === 'pending').length,
        inProgress: todos.filter((todo) => todo.status === 'in_progress').length,
        completed: todos.filter((todo) => todo.status === 'completed').length,
        approved: todos.filter((todo) => todo.status === 'approved').length,
        blocked: todos.filter((todo) => todo.status === 'blocked').length,
        needsApproval: todos.filter((todo) => todo.status === 'completed' && todo.needsApproval).length,
    };
};
exports.getTodoStatusCounts = getTodoStatusCounts;

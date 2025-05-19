'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createMessage = exports.MessageSchema = exports.MessageTypeSchema = void 0;
// shared/types/message.ts
const zod_1 = require('zod');
const common_1 = require('./common');
// Message types
exports.MessageTypeSchema = zod_1.z.enum([
  'text',
  'file',
  'status_update',
  'member_update',
  'system',
]);
exports.MessageSchema = zod_1.z.object({
  id: zod_1.z.string().optional(),
  projectId: zod_1.z.string(),
  stepId: zod_1.z.string().nullable().optional(),
  todoId: zod_1.z.string().nullable().optional(),
  senderId: zod_1.z.string(),
  senderRole: zod_1.z.string(),
  content: zod_1.z.string(),
  type: exports.MessageTypeSchema,
  aiMessage: zod_1.z.boolean(),
  metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
  createdAt: zod_1.z.preprocess(
    val => (0, common_1.convertTimestampToISOString)(val),
    zod_1.z.string().datetime()
  ),
  updatedAt: zod_1.z.preprocess(
    val => (0, common_1.convertTimestampToISOString)(val),
    zod_1.z.string().datetime()
  ),
  deleted: zod_1.z.boolean().default(false),
});
const createMessage = (projectId, senderId, senderRole, content, type, options = {}) => {
  const now = new Date().toISOString();
  return {
    projectId,
    stepId: options.stepId ?? null,
    todoId: options.todoId ?? null,
    senderId,
    senderRole,
    content,
    type,
    aiMessage: options.aiMessage ?? false,
    metadata: options.metadata,
    createdAt: now,
    updatedAt: now,
    deleted: false,
  };
};
exports.createMessage = createMessage;

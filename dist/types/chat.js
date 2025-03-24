"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseMessageSchema = void 0;
// shared/types/chat.ts
const zod_1 = require("zod");
const common_1 = require("./common");
// Base message schema
exports.BaseMessageSchema = zod_1.z.object({
    senderId: zod_1.z.string(),
    content: zod_1.z.string(),
    timestamp: zod_1.z.preprocess(common_1.convertTimestampToISOString, zod_1.z.string().datetime()),
    readBy: zod_1.z.array(zod_1.z.string()),
    type: zod_1.z.enum(['text', 'notification', 'file']),
});

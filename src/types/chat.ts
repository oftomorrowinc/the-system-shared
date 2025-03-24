// shared/types/chat.ts
import { z } from 'zod';
import { convertTimestampToISOString } from './common';

// Base message schema
export const BaseMessageSchema = z.object({
  senderId: z.string(),
  content: z.string(),
  timestamp: z.preprocess(convertTimestampToISOString, z.string().datetime()),
  readBy: z.array(z.string()),
  type: z.enum(['text', 'notification', 'file']),
});

export type BaseMessage = z.infer<typeof BaseMessageSchema>;

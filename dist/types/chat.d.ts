import { z } from 'zod';
export declare const BaseMessageSchema: z.ZodObject<{
    senderId: z.ZodString;
    content: z.ZodString;
    timestamp: z.ZodEffects<z.ZodString, string, unknown>;
    readBy: z.ZodArray<z.ZodString, "many">;
    type: z.ZodEnum<["text", "notification", "file"]>;
}, "strip", z.ZodTypeAny, {
    type: "text" | "notification" | "file";
    senderId: string;
    content: string;
    timestamp: string;
    readBy: string[];
}, {
    type: "text" | "notification" | "file";
    senderId: string;
    content: string;
    readBy: string[];
    timestamp?: unknown;
}>;
export type BaseMessage = z.infer<typeof BaseMessageSchema>;

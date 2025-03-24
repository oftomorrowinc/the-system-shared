import { z } from 'zod';
export declare const MessageTypeSchema: z.ZodEnum<["text", "file", "status_update", "member_update", "system"]>;
export declare const MessageSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    projectId: z.ZodString;
    stepId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    todoId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    senderId: z.ZodString;
    senderRole: z.ZodString;
    content: z.ZodString;
    type: z.ZodEnum<["text", "file", "status_update", "member_update", "system"]>;
    aiMessage: z.ZodBoolean;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    createdAt: z.ZodEffects<z.ZodString, string, unknown>;
    updatedAt: z.ZodEffects<z.ZodString, string, unknown>;
    deleted: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "system" | "text" | "file" | "status_update" | "member_update";
    senderId: string;
    content: string;
    projectId: string;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
    senderRole: string;
    aiMessage: boolean;
    id?: string | undefined;
    todoId?: string | null | undefined;
    stepId?: string | null | undefined;
    metadata?: Record<string, any> | undefined;
}, {
    type: "system" | "text" | "file" | "status_update" | "member_update";
    senderId: string;
    content: string;
    projectId: string;
    senderRole: string;
    aiMessage: boolean;
    id?: string | undefined;
    todoId?: string | null | undefined;
    createdAt?: unknown;
    updatedAt?: unknown;
    deleted?: boolean | undefined;
    stepId?: string | null | undefined;
    metadata?: Record<string, any> | undefined;
}>;
export declare const createMessage: (projectId: string, senderId: string, senderRole: string, content: string, type: MessageType, options?: {
    stepId?: string | null;
    todoId?: string | null;
    aiMessage?: boolean;
    metadata?: Record<string, unknown>;
}) => Omit<Message, "id">;
export type Message = z.infer<typeof MessageSchema> & {
    id: string;
};
export type MessageType = z.infer<typeof MessageTypeSchema>;

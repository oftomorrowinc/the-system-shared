import { z } from 'zod';
import { EventEmitter } from 'events';
/**
 * Webhook event types
 */
export declare enum WebhookEventType {
    PROJECT_COMPLETED = "project_completed",
    PROJECT_FAILED = "project_failed",
    FEEDBACK_NEEDED = "feedback_needed"
}
/**
 * Webhook payload schema
 */
export declare const WebhookPayloadSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof WebhookEventType>;
    projectId: z.ZodString;
    timestamp: z.ZodString;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    type: WebhookEventType;
    timestamp: string;
    projectId: string;
    data?: Record<string, any> | undefined;
}, {
    type: WebhookEventType;
    timestamp: string;
    projectId: string;
    data?: Record<string, any> | undefined;
}>;
export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;
/**
 * Webhook response schema (always return success so the server knows we received it)
 */
export declare const WebhookResponseSchema: z.ZodObject<{
    status: z.ZodLiteral<"ok">;
}, "strip", z.ZodTypeAny, {
    status: "ok";
}, {
    status: "ok";
}>;
export type WebhookResponse = z.infer<typeof WebhookResponseSchema>;
/**
 * Configuration for the webhook handler
 */
export declare const WebhookHandlerConfigSchema: z.ZodObject<{
    path: z.ZodDefault<z.ZodString>;
    secret: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    path: string;
    secret?: string | undefined;
}, {
    path?: string | undefined;
    secret?: string | undefined;
}>;
export type WebhookHandlerConfig = z.infer<typeof WebhookHandlerConfigSchema>;
/**
 * Webhook handler class
 * This is a lightweight EventEmitter wrapper for handling webhook events
 */
export declare class WebhookHandler extends EventEmitter {
    private config;
    constructor(config?: Partial<WebhookHandlerConfig>);
    /**
     * Handle an incoming webhook request
     * @param body The request body
     * @param headers The request headers (for validation)
     * @returns A standardized webhook response
     */
    handleRequest(body: unknown, headers?: Record<string, string>): WebhookResponse;
    /**
     * Register a handler for project completed events
     */
    onProjectCompleted(handler: (payload: WebhookPayload) => void): this;
    /**
     * Register a handler for project failed events
     */
    onProjectFailed(handler: (payload: WebhookPayload) => void): this;
    /**
     * Register a handler for feedback needed events
     */
    onFeedbackNeeded(handler: (payload: WebhookPayload) => void): this;
    /**
     * Create a sample Express middleware for handling webhooks
     * This is provided as an example and can be adapted for different frameworks
     */
    createExpressMiddleware(): (req: any, res: any) => void;
    /**
     * Create a sample Next.js API route handler for webhooks
     * This is provided as an example and can be adapted for different frameworks
     */
    createNextApiHandler(): (req: any, res: any) => Promise<any>;
    /**
     * Create a webhook handler from environment variables
     */
    static fromEnv(): WebhookHandler;
}

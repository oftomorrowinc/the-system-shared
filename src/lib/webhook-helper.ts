// shared/lib/webhook-helper.ts
import { z } from 'zod';
import { EventEmitter } from 'events';

/**
 * Webhook event types
 */
export enum WebhookEventType {
  PROJECT_COMPLETED = 'project_completed',
  PROJECT_FAILED = 'project_failed',
  FEEDBACK_NEEDED = 'feedback_needed',
}

/**
 * Webhook payload schema
 */
export const WebhookPayloadSchema = z.object({
  type: z.nativeEnum(WebhookEventType),
  projectId: z.string(),
  timestamp: z.string().datetime(),
  data: z.record(z.string(), z.any()).optional(),
});

export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;

/**
 * Webhook response schema (always return success so the server knows we received it)
 */
export const WebhookResponseSchema = z.object({
  status: z.literal('ok'),
});

export type WebhookResponse = z.infer<typeof WebhookResponseSchema>;

/**
 * Configuration for the webhook handler
 */
export const WebhookHandlerConfigSchema = z.object({
  path: z.string().default('/api/webhook'),
  secret: z.string().optional(),
});

export type WebhookHandlerConfig = z.infer<typeof WebhookHandlerConfigSchema>;

/**
 * Webhook handler class
 * This is a lightweight EventEmitter wrapper for handling webhook events
 */
export class WebhookHandler extends EventEmitter {
  private config: WebhookHandlerConfig;

  constructor(config: Partial<WebhookHandlerConfig> = {}) {
    super();
    this.config = WebhookHandlerConfigSchema.parse(config);
  }

  /**
   * Handle an incoming webhook request
   * @param body The request body
   * @param headers The request headers (for validation)
   * @returns A standardized webhook response
   */
  handleRequest(body: unknown, headers: Record<string, string> = {}): WebhookResponse {
    try {
      // Validate webhook signature if secret is configured
      if (this.config.secret) {
        const signature = headers['x-webhook-signature'];
        if (!signature) {
          throw new Error('Missing webhook signature');
        }
        
        // TODO: Implement signature validation when server implements it
        // For now we'll just check that it exists
      }

      // Parse and validate the payload
      const payload = WebhookPayloadSchema.parse(body);
      
      // Emit the event
      this.emit(payload.type, payload);
      
      // For convenience, also emit a generic 'webhook' event
      this.emit('webhook', payload);
      
      return { status: 'ok' };
    } catch (error) {
      console.error('Error handling webhook:', error);
      // Even if we have an error, return success to prevent retries
      // Log the error internally instead
      return { status: 'ok' };
    }
  }

  /**
   * Register a handler for project completed events
   */
  onProjectCompleted(handler: (payload: WebhookPayload) => void): this {
    return this.on(WebhookEventType.PROJECT_COMPLETED, handler);
  }

  /**
   * Register a handler for project failed events
   */
  onProjectFailed(handler: (payload: WebhookPayload) => void): this {
    return this.on(WebhookEventType.PROJECT_FAILED, handler);
  }

  /**
   * Register a handler for feedback needed events
   */
  onFeedbackNeeded(handler: (payload: WebhookPayload) => void): this {
    return this.on(WebhookEventType.FEEDBACK_NEEDED, handler);
  }

  /**
   * Create a sample Express middleware for handling webhooks
   * This is provided as an example and can be adapted for different frameworks
   */
  createExpressMiddleware() {
    return (req: any, res: any) => {
      const response = this.handleRequest(req.body, req.headers);
      res.json(response);
    };
  }

  /**
   * Create a sample Next.js API route handler for webhooks
   * This is provided as an example and can be adapted for different frameworks
   */
  createNextApiHandler() {
    return async (req: any, res: any) => {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }
      
      const response = this.handleRequest(req.body, req.headers);
      res.status(200).json(response);
    };
  }

  /**
   * Create a webhook handler from environment variables
   */
  static fromEnv(): WebhookHandler {
    const env = typeof process !== 'undefined' ? process.env : 
               (typeof window !== 'undefined' ? (window as any).env : {});
    
    return new WebhookHandler({
      path: env.WEBHOOK_PATH || '/api/webhook',
      secret: env.WEBHOOK_SECRET,
    });
  }
}
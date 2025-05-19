import { z } from 'zod';
import { EventEmitter } from 'events';
/**
 * Webhook event types
 */
export declare enum WebhookEventType {
  PROJECT_COMPLETED = 'project_completed',
  PROJECT_FAILED = 'project_failed',
  FEEDBACK_NEEDED = 'feedback_needed',
}
/**
 * Webhook payload schema
 */
export declare const WebhookPayloadSchema: z.ZodObject<
  {
    type: z.ZodNativeEnum<typeof WebhookEventType>;
    projectId: z.ZodString;
    timestamp: z.ZodString;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    type: WebhookEventType;
    timestamp: string;
    projectId: string;
    data?: Record<string, any> | undefined;
  },
  {
    type: WebhookEventType;
    timestamp: string;
    projectId: string;
    data?: Record<string, any> | undefined;
  }
>;
export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;
/**
 * Webhook response schema (always return success so the server knows we received it)
 */
export declare const WebhookResponseSchema: z.ZodObject<
  {
    status: z.ZodLiteral<'ok'>;
  },
  'strip',
  z.ZodTypeAny,
  {
    status: 'ok';
  },
  {
    status: 'ok';
  }
>;
export type WebhookResponse = z.infer<typeof WebhookResponseSchema>;
/**
 * Configuration for the webhook handler
 */
export declare const WebhookHandlerConfigSchema: z.ZodObject<
  {
    path: z.ZodDefault<z.ZodString>;
    secret: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    path: string;
    secret?: string | undefined;
  },
  {
    path?: string | undefined;
    secret?: string | undefined;
  }
>;
export type WebhookHandlerConfig = z.infer<typeof WebhookHandlerConfigSchema>;
/**
 * Express-like Request interface for webhook handlers
 */
export interface WebhookRequest {
  body: any;
  headers: Record<string, string>;
}
/**
 * Express-like Response interface for webhook handlers
 */
export interface WebhookResponseObject {
  status(code: number): WebhookResponseObject;
  json(data: any): void;
  end(): void;
}
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
   * Create an Express middleware for handling webhooks
   * This can be used with any Express-compatible framework
   */
  createExpressMiddleware(): (req: WebhookRequest, res: WebhookResponseObject) => void;
  /**
   * Create a Next.js API route handler for webhooks
   */
  createNextApiHandler(): (req: any, res: any) => Promise<any>;
  /**
   * Create a webhook handler from environment variables
   */
  static fromEnv(): WebhookHandler;
}
/**
 * Setup an Express server with webhook handling
 * This is a convenience function for quickly setting up a webhook server
 *
 * @param options Configuration options for the webhook server
 * @returns An object containing the configured webhook handler and server setup functions
 */
export interface WebhookServerOptions {
  /** The path to listen for webhooks, defaults to '/api/webhook' */
  path?: string;
  /** Optional webhook secret for verification */
  secret?: string;
  /** Port to listen on, defaults to 3001 */
  port?: number;
  /** Base URL for the webhook, defaults to http://localhost:PORT */
  baseUrl?: string;
  /** Express app instance (if you already have one) */
  app?: any;
  /** Body parser middleware (if you want to use your own) */
  bodyParser?: any;
}
/**
 * A result object from setting up the webhook server
 */
export interface WebhookServerSetup {
  /** The configured webhook handler */
  webhookHandler: WebhookHandler;
  /** The full webhook URL (baseUrl + path) */
  webhookUrl: string;
  /** Start the server and return the server instance */
  start: () => Promise<any>;
}
/**
 * Quickly set up a webhook server with Express
 *
 * @example
 * ```
 * const { webhookHandler, webhookUrl, start } = setupWebhookServer({
 *   port: 3001,
 *   baseUrl: 'https://your-webhook-url.com'
 * });
 *
 * webhookHandler.onProjectCompleted((payload) => {
 *   console.log('Project completed:', payload.projectId);
 * });
 *
 * const server = await start();
 * console.log(`Webhook server listening at ${webhookUrl}`);
 *
 * // Later, when you're done:
 * server.close();
 * ```
 */
export declare function setupWebhookServer(
  options?: WebhookServerOptions
): Promise<WebhookServerSetup>;

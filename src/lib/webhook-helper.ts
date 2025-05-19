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
   * Create an Express middleware for handling webhooks
   * This can be used with any Express-compatible framework
   */
  createExpressMiddleware() {
    return (req: WebhookRequest, res: WebhookResponseObject) => {
      // Immediately respond with OK to follow webhook best practices
      const response = this.handleRequest(req.body, req.headers);
      res.status(200).json(response);
    };
  }

  /**
   * Create a Next.js API route handler for webhooks
   */
  createNextApiHandler() {
    return async (req: any, res: any) => {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      // Immediately respond with OK to follow webhook best practices
      const response = this.handleRequest(req.body, req.headers);
      res.status(200).json(response);
    };
  }

  /**
   * Create a webhook handler from environment variables
   */
  static fromEnv(): WebhookHandler {
    const env =
      typeof process !== 'undefined'
        ? process.env
        : typeof window !== 'undefined'
          ? (window as any).env
          : {};

    return new WebhookHandler({
      path: env.WEBHOOK_PATH || '/api/webhook',
      secret: env.WEBHOOK_SECRET,
    });
  }
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
export async function setupWebhookServer(
  options: WebhookServerOptions = {}
): Promise<WebhookServerSetup> {
  // Dynamic imports to avoid requiring Express as a dependency
  // Users will need to install express and body-parser themselves
  const getExpress = async () => {
    try {
      return await import('express');
    } catch {
      throw new Error(
        'Express is required for setupWebhookServer. Please install it with: npm install express'
      );
    }
  };

  const getBodyParser = async () => {
    try {
      return await import('body-parser');
    } catch {
      throw new Error(
        'body-parser is required for setupWebhookServer. Please install it with: npm install body-parser'
      );
    }
  };

  const path = options.path || '/api/webhook';
  const port = options.port || 3001;
  const baseUrl = options.baseUrl || `http://localhost:${port}`;

  // Ensure proper URL formatting
  const baseUrlWithoutTrailingSlash = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  const pathWithLeadingSlash = path.startsWith('/') ? path : `/${path}`;

  const webhookUrl = `${baseUrlWithoutTrailingSlash}${pathWithLeadingSlash}`;

  // Create the webhook handler
  const webhookHandler = new WebhookHandler({
    path,
    secret: options.secret,
  });

  return {
    webhookHandler,
    webhookUrl,
    start: async () => {
      const expressModule = await getExpress();
      const bodyParserModule = options.bodyParser || (await getBodyParser());

      const express = expressModule.default || expressModule;
      const bodyParser = bodyParserModule.default || bodyParserModule;

      // Use existing app or create a new one
      const app = options.app || express();

      // Add body parsing middleware
      app.use(bodyParser.json());

      // Add the webhook route
      app.post(pathWithLeadingSlash, webhookHandler.createExpressMiddleware());

      // Return a promise that resolves with the server
      return new Promise(resolve => {
        // Create a server object first
        const server = { close: () => {} };

        // Extend the server with what app.listen returns
        Object.assign(
          server,
          app.listen(port, () => {
            // Resolve with the pre-created server object
            resolve(server);
          })
        );
      });
    },
  };
}

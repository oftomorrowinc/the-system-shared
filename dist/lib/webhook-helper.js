'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.WebhookHandler =
  exports.WebhookHandlerConfigSchema =
  exports.WebhookResponseSchema =
  exports.WebhookPayloadSchema =
  exports.WebhookEventType =
    void 0;
exports.setupWebhookServer = setupWebhookServer;
// shared/lib/webhook-helper.ts
const zod_1 = require('zod');
const events_1 = require('events');
/**
 * Webhook event types
 */
var WebhookEventType;
(function (WebhookEventType) {
  WebhookEventType['PROJECT_COMPLETED'] = 'project_completed';
  WebhookEventType['PROJECT_FAILED'] = 'project_failed';
  WebhookEventType['FEEDBACK_NEEDED'] = 'feedback_needed';
})(WebhookEventType || (exports.WebhookEventType = WebhookEventType = {}));
/**
 * Webhook payload schema
 */
exports.WebhookPayloadSchema = zod_1.z.object({
  type: zod_1.z.nativeEnum(WebhookEventType),
  projectId: zod_1.z.string(),
  timestamp: zod_1.z.string().datetime(),
  data: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
});
/**
 * Webhook response schema (always return success so the server knows we received it)
 */
exports.WebhookResponseSchema = zod_1.z.object({
  status: zod_1.z.literal('ok'),
});
/**
 * Configuration for the webhook handler
 */
exports.WebhookHandlerConfigSchema = zod_1.z.object({
  path: zod_1.z.string().default('/api/webhook'),
  secret: zod_1.z.string().optional(),
});
/**
 * Webhook handler class
 * This is a lightweight EventEmitter wrapper for handling webhook events
 */
class WebhookHandler extends events_1.EventEmitter {
  config;
  constructor(config = {}) {
    super();
    this.config = exports.WebhookHandlerConfigSchema.parse(config);
  }
  /**
   * Handle an incoming webhook request
   * @param body The request body
   * @param headers The request headers (for validation)
   * @returns A standardized webhook response
   */
  handleRequest(body, headers = {}) {
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
      const payload = exports.WebhookPayloadSchema.parse(body);
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
  onProjectCompleted(handler) {
    return this.on(WebhookEventType.PROJECT_COMPLETED, handler);
  }
  /**
   * Register a handler for project failed events
   */
  onProjectFailed(handler) {
    return this.on(WebhookEventType.PROJECT_FAILED, handler);
  }
  /**
   * Register a handler for feedback needed events
   */
  onFeedbackNeeded(handler) {
    return this.on(WebhookEventType.FEEDBACK_NEEDED, handler);
  }
  /**
   * Create an Express middleware for handling webhooks
   * This can be used with any Express-compatible framework
   */
  createExpressMiddleware() {
    return (req, res) => {
      // Immediately respond with OK to follow webhook best practices
      const response = this.handleRequest(req.body, req.headers);
      res.status(200).json(response);
    };
  }
  /**
   * Create a Next.js API route handler for webhooks
   */
  createNextApiHandler() {
    return async (req, res) => {
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
  static fromEnv() {
    const env =
      typeof process !== 'undefined'
        ? process.env
        : typeof window !== 'undefined'
          ? window.env
          : {};
    return new WebhookHandler({
      path: env.WEBHOOK_PATH || '/api/webhook',
      secret: env.WEBHOOK_SECRET,
    });
  }
}
exports.WebhookHandler = WebhookHandler;
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
async function setupWebhookServer(options = {}) {
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

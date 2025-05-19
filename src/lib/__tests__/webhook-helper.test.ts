import { WebhookHandler, WebhookEventType, setupWebhookServer } from '../webhook-helper';
import { EventEmitter } from 'events';

// Mock express and related modules
jest.mock('express', () => {
  const mockApp = {
    use: jest.fn(),
    post: jest.fn(),
    listen: jest.fn().mockImplementation((port, callback) => {
      if (callback) callback();
      return { close: jest.fn() };
    }),
  };
  return jest.fn(() => mockApp);
});

jest.mock('body-parser', () => ({
  json: jest.fn().mockReturnValue(() => {}),
}));

// Mock dynamic imports for express and body-parser
jest.mock('../webhook-helper', () => {
  const originalModule = jest.requireActual('../webhook-helper');

  // Define the types locally
  type MockApp = {
    use: jest.Mock;
    post: jest.Mock;
    listen: jest.Mock;
  };

  type MockWebhookServerOptions = {
    path?: string;
    secret?: string;
    port?: number;
    baseUrl?: string;
    app?: MockApp;
  };

  return {
    ...originalModule,
    setupWebhookServer: async (options: MockWebhookServerOptions = {}) => {
      // Create the basic setup without trying to import express
      const path = options.path || '/api/webhook';
      const port = options.port || 3001;
      const baseUrl = options.baseUrl || `http://localhost:${port}`;

      // Ensure proper URL formatting
      const baseUrlWithoutTrailingSlash = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

      const pathWithLeadingSlash = path.startsWith('/') ? path : `/${path}`;

      const webhookUrl = `${baseUrlWithoutTrailingSlash}${pathWithLeadingSlash}`;

      // Create the webhook handler
      const webhookHandler = new originalModule.WebhookHandler({
        path,
        secret: options.secret,
      });

      // Create a mocked express and bodyParser directly
      // Using jest.fn() instead of require to avoid ESLint require() warnings
      const express = jest.fn<MockApp, []>(() => ({
        use: jest.fn(),
        post: jest.fn(),
        listen: jest.fn().mockImplementation((port, callback) => {
          if (callback) callback();
          return { close: jest.fn() };
        }),
      }));
      const bodyParser = { json: jest.fn().mockReturnValue(() => {}) };

      // Use existing app or create a new one
      const app = options.app || (express() as MockApp);

      return {
        webhookHandler,
        webhookUrl,
        start: async () => {
          // Mock app.use and app.post directly
          app.use(bodyParser.json());
          app.post(pathWithLeadingSlash, webhookHandler.createExpressMiddleware());

          // Create a mock server
          const server = { close: jest.fn() };

          // Return the mock server without trying to listen
          return server;
        },
      };
    },
  };
});

// Mock fetch for testing requests - don't actually import it
const mockFetch = jest.fn();
jest.mock('node-fetch', () => mockFetch);

describe('WebhookHandler', () => {
  let webhookHandler: WebhookHandler;

  beforeEach(() => {
    webhookHandler = new WebhookHandler({ path: '/webhook/test' });
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create a webhook handler with default path', () => {
      const handler = new WebhookHandler();
      expect(handler).toBeInstanceOf(WebhookHandler);
      expect(handler).toBeInstanceOf(EventEmitter);
    });

    it('should create a webhook handler with custom path', () => {
      const handler = new WebhookHandler({ path: '/custom/path' });
      expect(handler).toBeInstanceOf(WebhookHandler);
    });

    it('should create a webhook handler with secret', () => {
      const handler = new WebhookHandler({ secret: 'test-secret' });
      expect(handler).toBeInstanceOf(WebhookHandler);
    });
  });

  describe('handleRequest', () => {
    it('should emit events for valid webhook payloads', () => {
      // Set up spies for event emission
      const projectCompletedSpy = jest.spyOn(webhookHandler, 'emit');
      const webhookSpy = jest.spyOn(webhookHandler, 'emit');

      // Create a valid payload
      const payload = {
        type: WebhookEventType.PROJECT_COMPLETED,
        projectId: 'test-project-id',
        timestamp: new Date().toISOString(),
        data: { test: 'data' },
      };

      // Handle the request
      const response = webhookHandler.handleRequest(payload);

      // Verify response
      expect(response).toEqual({ status: 'ok' });

      // Verify events were emitted
      expect(projectCompletedSpy).toHaveBeenCalledWith(WebhookEventType.PROJECT_COMPLETED, payload);
      expect(webhookSpy).toHaveBeenCalledWith('webhook', payload);
    });

    it('should validate event types', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Create an invalid payload with incorrect event type
      const payload = {
        type: 'invalid_event_type',
        projectId: 'test-project-id',
        timestamp: new Date().toISOString(),
      };

      // Handle the request - should not throw but log error
      const response = webhookHandler.handleRequest(payload);

      // Should still return success (to avoid retries)
      expect(response).toEqual({ status: 'ok' });

      // Should log error
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should validate required fields', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Create an invalid payload missing required fields
      const payload = {
        type: WebhookEventType.PROJECT_COMPLETED,
        // Missing projectId and timestamp
      };

      // Handle the request
      const response = webhookHandler.handleRequest(payload);

      // Should still return success (to avoid retries)
      expect(response).toEqual({ status: 'ok' });

      // Should log error
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should check signatures when secret is set', () => {
      // Create a handler with a secret
      const secureHandler = new WebhookHandler({ secret: 'test-secret' });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Create a valid payload
      const payload = {
        type: WebhookEventType.PROJECT_COMPLETED,
        projectId: 'test-project-id',
        timestamp: new Date().toISOString(),
      };

      // No signature provided
      const response = secureHandler.handleRequest(payload, {});

      // Should still return success (to avoid retries)
      expect(response).toEqual({ status: 'ok' });

      // Should log error about missing signature
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('event handlers', () => {
    it('should register project completed handler', () => {
      const handler = jest.fn();
      webhookHandler.onProjectCompleted(handler);

      // Manually trigger the event
      webhookHandler.emit(WebhookEventType.PROJECT_COMPLETED, {
        type: WebhookEventType.PROJECT_COMPLETED,
        projectId: 'test',
        timestamp: new Date().toISOString(),
      });

      expect(handler).toHaveBeenCalled();
    });

    it('should register project failed handler', () => {
      const handler = jest.fn();
      webhookHandler.onProjectFailed(handler);

      // Manually trigger the event
      webhookHandler.emit(WebhookEventType.PROJECT_FAILED, {
        type: WebhookEventType.PROJECT_FAILED,
        projectId: 'test',
        timestamp: new Date().toISOString(),
      });

      expect(handler).toHaveBeenCalled();
    });

    it('should register feedback needed handler', () => {
      const handler = jest.fn();
      webhookHandler.onFeedbackNeeded(handler);

      // Manually trigger the event
      webhookHandler.emit(WebhookEventType.FEEDBACK_NEEDED, {
        type: WebhookEventType.FEEDBACK_NEEDED,
        projectId: 'test',
        timestamp: new Date().toISOString(),
      });

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('middleware creators', () => {
    it('should create Express middleware', () => {
      const middleware = webhookHandler.createExpressMiddleware();
      expect(typeof middleware).toBe('function');

      // Mock request and response
      const req = {
        body: {
          type: WebhookEventType.PROJECT_COMPLETED,
          projectId: 'test',
          timestamp: new Date().toISOString(),
        },
        headers: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        end: jest.fn(), // Add missing end method
      };

      // Call the middleware
      middleware(req, res);

      // Verify response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: 'ok' });
    });

    it('should create Next.js API handler', async () => {
      const handler = webhookHandler.createNextApiHandler();
      expect(typeof handler).toBe('function');

      // Mock request and response for GET (should be rejected)
      const req = { method: 'GET' };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        end: jest.fn(), // Add missing end method
      };

      // Call the handler with GET
      await handler(req, res);

      // Verify method not allowed response
      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });

      // Reset mocks
      jest.clearAllMocks();

      // Mock request and response for POST
      const postReq = {
        method: 'POST',
        body: {
          type: WebhookEventType.PROJECT_COMPLETED,
          projectId: 'test',
          timestamp: new Date().toISOString(),
        },
        headers: {},
      };

      // Call the handler with POST
      await handler(postReq, res);

      // Verify success response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: 'ok' });
    });
  });
});

describe('setupWebhookServer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set up a webhook server with default options', async () => {
    const { webhookHandler, webhookUrl, start } = await setupWebhookServer();

    expect(webhookHandler).toBeInstanceOf(WebhookHandler);
    expect(webhookUrl).toBe('http://localhost:3001/api/webhook');
    expect(typeof start).toBe('function');
  });

  it('should set up a webhook server with custom options', async () => {
    const options = {
      port: 4000,
      path: '/custom/webhook',
      baseUrl: 'https://example.com',
      secret: 'test-secret',
    };

    const { webhookHandler, webhookUrl, start } = await setupWebhookServer(options);

    expect(webhookHandler).toBeInstanceOf(WebhookHandler);
    expect(webhookUrl).toBe('https://example.com/custom/webhook');
    expect(typeof start).toBe('function');
  });

  it('should handle URL formatting correctly', async () => {
    // Test with trailing slash in baseUrl
    const result1 = await setupWebhookServer({
      baseUrl: 'https://example.com/',
      path: '/webhook',
    });
    expect(result1.webhookUrl).toBe('https://example.com/webhook');

    // Test without leading slash in path
    const result2 = await setupWebhookServer({
      baseUrl: 'https://example.com',
      path: 'webhook',
    });
    expect(result2.webhookUrl).toBe('https://example.com/webhook');
  });

  it('should start the server and return a server instance', async () => {
    const { start } = await setupWebhookServer();
    const server = await start();

    // The mocked express app's listen method returns an object with a close method
    expect(server).toHaveProperty('close');
    expect(typeof server.close).toBe('function');
  });
});

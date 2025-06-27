import { ApiClient, ProjectRequest } from '../api-client';
import { setupWebhookServer, WebhookEventType } from '../webhook-helper';
import { EventEmitter } from 'events';

// Mock fetch
global.fetch = jest.fn() as jest.Mock;

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();

  // Set up default fetch response
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({ projectId: 'test-project-id' }),
  });
});

// Mock setupWebhookServer
jest.mock('../webhook-helper', () => {
  const originalModule = jest.requireActual('../webhook-helper');

  // Create a mock server and webhook handler for testing
  const mockServer = { close: jest.fn() };
  const mockHandler = {
    onProjectCompleted: jest.fn(),
    onProjectFailed: jest.fn(),
    onFeedbackNeeded: jest.fn(),
    on: jest.fn(),
  };

  // Mock implementation of setupWebhookServer
  const mockSetupWebhookServer = jest.fn().mockResolvedValue({
    webhookHandler: mockHandler,
    webhookUrl: 'https://webhook.example.com/webhook/test',
    start: jest.fn().mockResolvedValue(mockServer),
  });

  return {
    ...originalModule,
    setupWebhookServer: mockSetupWebhookServer,
  };
});

describe('ApiClient webhook integration', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient({
      baseUrl: 'https://test-api.example.com/',
    });
  });

  describe('createProject with webhooks', () => {
    it('should create a project with configured webhook URL', async () => {
      const projectRequest: ProjectRequest = {
        name: 'Test Project',
        workflowId: 'test-workflow',
        workflowVersion: 1,
        organizationId: 'test-org',
        owners: ['test-user'],
        inputValues: [{ test: 'data' }],
      };

      // Create client with a webhook URL
      const clientWithWebhook = new ApiClient({
        baseUrl: 'https://test-api.example.com/',
        webhookUrl: 'https://webhook.example.com/path',
      });

      await clientWithWebhook.createProject(projectRequest);

      // Check that fetch was called with the webhook URL
      expect(global.fetch).toHaveBeenCalledTimes(1);

      const fetchArgs = (global.fetch as jest.Mock).mock.calls[0];
      const requestBody = JSON.parse(fetchArgs[1].body);

      expect(requestBody.webhookUrl).toBe('https://webhook.example.com/path');
    });

    it('should respect an explicitly provided webhook URL in the request', async () => {
      const projectRequest: ProjectRequest = {
        name: 'Test Project',
        workflowId: 'test-workflow',
        workflowVersion: 1,
        organizationId: 'test-org',
        owners: ['test-user'],
        inputValues: [{ test: 'data' }],
        webhookUrl: 'https://explicit-webhook.example.com/path',
      };

      // Create client with a webhook URL
      const clientWithWebhook = new ApiClient({
        baseUrl: 'https://test-api.example.com/',
        webhookUrl: 'https://default-webhook.example.com/path',
      });

      await clientWithWebhook.createProject(projectRequest);

      // Check that fetch was called with the explicit webhook URL
      expect(global.fetch).toHaveBeenCalledTimes(1);

      const fetchArgs = (global.fetch as jest.Mock).mock.calls[0];
      const requestBody = JSON.parse(fetchArgs[1].body);

      expect(requestBody.webhookUrl).toBe('https://explicit-webhook.example.com/path');
    });

    it('should handle empty webhook URL correctly', async () => {
      const projectRequest: ProjectRequest = {
        name: 'Test Project',
        workflowId: 'test-workflow',
        workflowVersion: 1,
        organizationId: 'test-org',
        owners: ['test-user'],
        inputValues: [{ test: 'data' }],
        webhookUrl: '', // Explicitly empty
      };

      await apiClient.createProject(projectRequest);

      // Check that fetch was called with no webhook URL
      expect(global.fetch).toHaveBeenCalledTimes(1);

      const fetchArgs = (global.fetch as jest.Mock).mock.calls[0];
      const requestBody = JSON.parse(fetchArgs[1].body);

      expect(requestBody.webhookUrl).toBeUndefined();
    });
  });

  describe('createProjectWithWebhook', () => {
    it('should set up a webhook server and create a project', async () => {
      const projectRequest: ProjectRequest = {
        name: 'Test Project',
        workflowId: 'test-workflow',
        workflowVersion: 1,
        organizationId: 'test-org',
        owners: ['test-user'],
        inputValues: [{ test: 'data' }],
      };

      const result = await apiClient.createProjectWithWebhook({
        projectRequest,
        webhookOptions: {
          port: 3001,
          path: '/webhook/test',
          baseUrl: 'https://webhook.example.com',
        },
        handlers: {
          onProjectCompleted: jest.fn(),
          onProjectFailed: jest.fn(),
          onFeedbackNeeded: jest.fn(),
          onWebhook: jest.fn(),
        },
      });

      // Check that setupWebhookServer was called
      expect(setupWebhookServer).toHaveBeenCalledTimes(1);

      // Check the returned values
      expect(result.projectId).toBe('test-project-id');
      expect(result.webhookUrl).toBe('https://webhook.example.com/webhook/test');
      expect(result.stop).toBeInstanceOf(Function);

      // Check that fetch was called with the webhook URL
      expect(global.fetch).toHaveBeenCalledTimes(1);

      const fetchArgs = (global.fetch as jest.Mock).mock.calls[0];
      const requestBody = JSON.parse(fetchArgs[1].body);

      expect(requestBody.webhookUrl).toBe('https://webhook.example.com/webhook/test');
    });

    it('should register the event handlers', async () => {
      const projectRequest: ProjectRequest = {
        name: 'Test Project',
        workflowId: 'test-workflow',
        workflowVersion: 1,
        organizationId: 'test-org',
        owners: ['test-user'],
        inputValues: [{ test: 'data' }],
      };

      const handlers = {
        onProjectCompleted: jest.fn(),
        onProjectFailed: jest.fn(),
        onFeedbackNeeded: jest.fn(),
        onWebhook: jest.fn(),
      };

      await apiClient.createProjectWithWebhook({
        projectRequest,
        webhookOptions: {
          port: 3001,
          path: '/webhook/test',
          baseUrl: 'https://webhook.example.com',
        },
        handlers,
      });

      // Get the webhook handler from the mocked result
      const { webhookHandler } = await (setupWebhookServer as jest.Mock).mock.results[0].value;

      // Check that handlers were registered
      expect(webhookHandler.onProjectCompleted).toHaveBeenCalledWith(handlers.onProjectCompleted);
      expect(webhookHandler.onProjectFailed).toHaveBeenCalledWith(handlers.onProjectFailed);
      expect(webhookHandler.onFeedbackNeeded).toHaveBeenCalledWith(handlers.onFeedbackNeeded);
      expect(webhookHandler.on).toHaveBeenCalledWith('webhook', handlers.onWebhook);
    });

    it('should set up auto-shutdown with timeout', async () => {
      // Mock setTimeout and clearTimeout
      jest.useFakeTimers();

      const projectRequest: ProjectRequest = {
        name: 'Test Project',
        workflowId: 'test-workflow',
        workflowVersion: 1,
        organizationId: 'test-org',
        owners: ['test-user'],
        inputValues: [{ test: 'data' }],
      };

      const result = await apiClient.createProjectWithWebhook({
        projectRequest,
        webhookOptions: {
          port: 3001,
          path: '/webhook/test',
          baseUrl: 'https://webhook.example.com',
        },
        handlers: {},
        timeout: 60000, // 1 minute
      });

      // Get server mock from the setupWebhookServer results
      const { start } = await (setupWebhookServer as jest.Mock).mock.results[0].value;
      const server = await start();

      // Fast-forward time
      jest.advanceTimersByTime(60000);

      // Check that server.close was called
      expect(server.close).toHaveBeenCalledTimes(1);

      // Clean up
      jest.useRealTimers();
    });

    it('should provide a stop function that cleans up resources', async () => {
      const projectRequest: ProjectRequest = {
        name: 'Test Project',
        workflowId: 'test-workflow',
        workflowVersion: 1,
        organizationId: 'test-org',
        owners: ['test-user'],
        inputValues: [{ test: 'data' }],
      };

      const result = await apiClient.createProjectWithWebhook({
        projectRequest,
        webhookOptions: {
          port: 3001,
          path: '/webhook/test',
          baseUrl: 'https://webhook.example.com',
        },
        handlers: {},
      });

      // Get server mock from the setupWebhookServer results
      const { start } = await (setupWebhookServer as jest.Mock).mock.results[0].value;
      const server = await start();

      // Call stop
      result.stop();

      // Check that server.close was called
      expect(server.close).toHaveBeenCalledTimes(1);
    });
  });
});

// shared/lib/api-client.ts
import { z } from 'zod';
import {
  WebhookHandler,
  WebhookServerOptions,
  setupWebhookServer,
  WebhookPayload,
} from './webhook-helper';

/**
 * Configuration for the API client
 */
export const ApiClientConfigSchema = z
  .object({
    baseUrl: z.string().url(),
    apiKey: z.string().optional(),
    webhookUrl: z.union([z.string().url(), z.literal('')]).optional(),
  })
  .transform(data => {
    // Create a shallow copy of the data
    const result = { ...data };

    // If webhookUrl is an empty string or undefined, remove it completely
    if (result.webhookUrl === '' || result.webhookUrl === undefined) {
      delete result.webhookUrl;
    }

    return result;
  });

export type ApiClientConfig = z.infer<typeof ApiClientConfigSchema>;

/**
 * Schema for translation/project request
 */
export const ProjectRequestSchema = z
  .object({
    name: z.string(),
    workflowId: z.string().optional(),
    workflowVersion: z.number().optional(),
    steps: z
      .array(
        z.object({
          taskId: z.string(),
          indentLevel: z.number().default(0),
        })
      )
      .optional(),
    organizationId: z.string(),
    owners: z.array(z.string()),
    inputValues: z.array(z.record(z.string(), z.any())),
    useStream: z.boolean().optional(),
    webhookUrl: z.union([z.string().url(), z.literal('')]).optional(),
  })
  .refine(
    data => {
      // Either workflowId/workflowVersion OR steps must be provided, but not both
      const hasWorkflow = data.workflowId && data.workflowVersion !== undefined;
      const hasSteps = data.steps && data.steps.length > 0;

      return (hasWorkflow && !hasSteps) || (!hasWorkflow && hasSteps);
    },
    {
      message:
        'Either workflowId and workflowVersion must be provided, or steps must be provided, but not both',
    }
  )
  .transform(data => {
    // Create a shallow copy of the data
    const result = { ...data };

    // If webhookUrl is an empty string or undefined, remove it completely
    if (result.webhookUrl === '' || result.webhookUrl === undefined) {
      delete result.webhookUrl;
    }

    return result;
  });

export type ProjectRequest = z.infer<typeof ProjectRequestSchema>;

/**
 * Project creation response
 */
export interface ProjectResponse {
  projectId: string;
}

/**
 * Handler functions for webhook events
 */
export interface WebhookHandlers {
  onProjectCompleted?: (payload: WebhookPayload) => void;
  onProjectFailed?: (payload: WebhookPayload) => void;
  onFeedbackNeeded?: (payload: WebhookPayload) => void;
  onWebhook?: (payload: WebhookPayload) => void;
}

/**
 * Configuration for creating a project with webhook
 */
export interface CreateProjectWithWebhookOptions {
  /** The project request data */
  projectRequest: ProjectRequest;
  /** Webhook server options */
  webhookOptions: WebhookServerOptions;
  /** Webhook event handlers */
  handlers: WebhookHandlers;
  /** How long to keep the webhook server running (ms) */
  timeout?: number;
}

/**
 * Result of creating a project with webhook
 */
export interface CreateProjectWithWebhookResult {
  /** The created project ID */
  projectId: string;
  /** The webhook server instance */
  server: any;
  /** The webhook handler instance */
  webhookHandler: WebhookHandler;
  /** The full webhook URL being used */
  webhookUrl: string;
  /** Stop the webhook server */
  stop: () => void;
}

/**
 * API client for interacting with the-system-server
 */
export class ApiClient {
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = ApiClientConfigSchema.parse(config);
  }

  /**
   * Create and execute a project based on a workflow
   * @param request The project request
   * @param onStreamData Optional callback for stream data (when useStream is true)
   * @returns A promise containing the projectId or stream results
   */
  async createProject(
    request: ProjectRequest,
    onStreamData?: (data: any) => void
  ): Promise<ProjectResponse | void> {
    // Create the final request with default webhookUrl if needed
    const finalRequest = {
      ...request,
      // Only add webhookUrl from config if it doesn't exist in the request and config has one
      webhookUrl: request.webhookUrl || this.config.webhookUrl,
    };

    // Let the schema's transform function handle empty/undefined webhookUrl values
    // This will completely remove the property if it's empty or undefined
    const validatedRequest = ProjectRequestSchema.parse(finalRequest);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    try {
      if (validatedRequest.useStream && onStreamData) {
        const response = await fetch(`${this.config.baseUrl}/createAndLaunchProject`, {
          method: 'POST',
          headers,
          body: JSON.stringify(validatedRequest),
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        if (!response.body) {
          throw new Error('Response has no body');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // Process the stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          try {
            // The stream may contain multiple items separated by newlines
            const parts = chunk.split('\n').filter(Boolean);
            for (const part of parts) {
              // Try to parse as JSON, but if it fails, pass the raw string
              try {
                const data = JSON.parse(part);
                onStreamData(data);
              } catch {
                // If not valid JSON, pass the raw string
                onStreamData({ text: part, type: 'raw' });
              }
            }
          } catch (e) {
            console.error('Error processing stream data:', e);
            // Pass any streaming errors to the callback
            if (e instanceof Error) {
              onStreamData({ error: e.message, type: 'error' });
            } else {
              onStreamData({ error: String(e), type: 'error' });
            }
          }
        }

        return;
      } else {
        // Regular non-streaming request
        const response = await fetch(`${this.config.baseUrl}/createAndLaunchProject`, {
          method: 'POST',
          headers,
          body: JSON.stringify(validatedRequest),
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return { projectId: data.projectId };
      }
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  /**
   * Get project results by project ID
   * @param projectId The ID of the project
   * @returns The project documents
   */
  async getProjectResults(projectId: string): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/getLatestDocumentValue`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ projectId: projectId }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting project results:', error);
      throw error;
    }
  }

  /**
   * Create a project with webhook integration
   * Sets up a webhook server and creates a project that will send updates to it
   *
   * @example
   * ```
   * const result = await apiClient.createProjectWithWebhook({
   *   projectRequest: {
   *     name: 'Test Project',
   *     workflowId: 'workflow-123',
   *     // ... other project properties
   *   },
   *   webhookOptions: {
   *     port: 3001,
   *     baseUrl: 'https://your-webhook-url.com' // or ngrok URL
   *   },
   *   handlers: {
   *     onProjectCompleted: (payload) => {
   *       console.log('Project completed:', payload.projectId);
   *       // Handle completion (fetch results, etc.)
   *     }
   *   },
   *   timeout: 5 * 60 * 1000 // 5 minutes
   * });
   *
   * // The webhook server is automatically started
   * console.log(`Project created with ID: ${result.projectId}`);
   *
   * // When you're done
   * result.stop();
   * ```
   */
  async createProjectWithWebhook(
    options: CreateProjectWithWebhookOptions
  ): Promise<CreateProjectWithWebhookResult> {
    // Set up the webhook server
    const { webhookHandler, webhookUrl, start } = await setupWebhookServer(options.webhookOptions);

    // Register the event handlers
    if (options.handlers.onProjectCompleted) {
      webhookHandler.onProjectCompleted(options.handlers.onProjectCompleted);
    }

    if (options.handlers.onProjectFailed) {
      webhookHandler.onProjectFailed(options.handlers.onProjectFailed);
    }

    if (options.handlers.onFeedbackNeeded) {
      webhookHandler.onFeedbackNeeded(options.handlers.onFeedbackNeeded);
    }

    if (options.handlers.onWebhook) {
      webhookHandler.on('webhook', options.handlers.onWebhook);
    }

    // Start the webhook server
    const server = await start();

    // Create the project with the webhook URL
    const projectRequest = {
      ...options.projectRequest,
      webhookUrl,
    };

    // Create the project
    const result = await this.createProject(projectRequest);

    if (!result || !('projectId' in result)) {
      throw new Error('Failed to create project');
    }

    const projectId = result.projectId;

    // Set up auto-shutdown if timeout is provided
    let shutdownTimer: NodeJS.Timeout | null = null;

    if (options.timeout) {
      shutdownTimer = setTimeout(() => {
        server.close();
      }, options.timeout);
    }

    // Return the project ID and a way to stop the server
    return {
      projectId,
      server,
      webhookHandler,
      webhookUrl,
      stop: () => {
        if (shutdownTimer) {
          clearTimeout(shutdownTimer);
        }
        server.close();
      },
    };
  }

  /**
   * Create a preconfigured client from environment variables
   * @returns A new ApiClient instance configured from environment
   */
  static fromEnv(): ApiClient {
    // For browsers and Node.js environments
    const env =
      typeof process !== 'undefined'
        ? process.env
        : typeof window !== 'undefined'
          ? (window as any).env
          : {};

    const baseUrl = env.API_BASE_URL;
    if (!baseUrl) {
      throw new Error('API_BASE_URL environment variable is not set');
    }

    return new ApiClient({
      baseUrl,
      apiKey: env.API_KEY,
      webhookUrl: env.WEBHOOK_URL,
    });
  }
}

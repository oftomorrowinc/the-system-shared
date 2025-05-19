import { z } from 'zod';
import { WebhookHandler, WebhookServerOptions, WebhookPayload } from './webhook-helper';
/**
 * Configuration for the API client
 */
export declare const ApiClientConfigSchema: z.ZodEffects<
  z.ZodObject<
    {
      baseUrl: z.ZodString;
      apiKey: z.ZodOptional<z.ZodString>;
      webhookUrl: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<''>]>>;
    },
    'strip',
    z.ZodTypeAny,
    {
      baseUrl: string;
      webhookUrl?: string | undefined;
      apiKey?: string | undefined;
    },
    {
      baseUrl: string;
      webhookUrl?: string | undefined;
      apiKey?: string | undefined;
    }
  >,
  {
    baseUrl: string;
    webhookUrl?: string | undefined;
    apiKey?: string | undefined;
  },
  {
    baseUrl: string;
    webhookUrl?: string | undefined;
    apiKey?: string | undefined;
  }
>;
export type ApiClientConfig = z.infer<typeof ApiClientConfigSchema>;
/**
 * Schema for translation/project request
 */
export declare const ProjectRequestSchema: z.ZodEffects<
  z.ZodObject<
    {
      name: z.ZodString;
      workflowId: z.ZodString;
      workflowVersion: z.ZodNumber;
      organizationId: z.ZodString;
      owners: z.ZodArray<z.ZodString, 'many'>;
      inputValue: z.ZodRecord<z.ZodString, z.ZodAny>;
      useStream: z.ZodOptional<z.ZodBoolean>;
      webhookUrl: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<''>]>>;
    },
    'strip',
    z.ZodTypeAny,
    {
      name: string;
      organizationId: string;
      workflowVersion: number;
      owners: string[];
      workflowId: string;
      inputValue: Record<string, any>;
      webhookUrl?: string | undefined;
      useStream?: boolean | undefined;
    },
    {
      name: string;
      organizationId: string;
      workflowVersion: number;
      owners: string[];
      workflowId: string;
      inputValue: Record<string, any>;
      webhookUrl?: string | undefined;
      useStream?: boolean | undefined;
    }
  >,
  {
    name: string;
    organizationId: string;
    workflowVersion: number;
    owners: string[];
    workflowId: string;
    inputValue: Record<string, any>;
    webhookUrl?: string | undefined;
    useStream?: boolean | undefined;
  },
  {
    name: string;
    organizationId: string;
    workflowVersion: number;
    owners: string[];
    workflowId: string;
    inputValue: Record<string, any>;
    webhookUrl?: string | undefined;
    useStream?: boolean | undefined;
  }
>;
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
export declare class ApiClient {
  private config;
  constructor(config: ApiClientConfig);
  /**
   * Create and execute a project based on a workflow
   * @param request The project request
   * @param onStreamData Optional callback for stream data (when useStream is true)
   * @returns A promise containing the projectId or stream results
   */
  createProject(
    request: ProjectRequest,
    onStreamData?: (data: any) => void
  ): Promise<ProjectResponse | void>;
  /**
   * Get project results by project ID
   * @param projectId The ID of the project
   * @returns The project documents
   */
  getProjectResults(projectId: string): Promise<any>;
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
  createProjectWithWebhook(
    options: CreateProjectWithWebhookOptions
  ): Promise<CreateProjectWithWebhookResult>;
  /**
   * Create a preconfigured client from environment variables
   * @returns A new ApiClient instance configured from environment
   */
  static fromEnv(): ApiClient;
}

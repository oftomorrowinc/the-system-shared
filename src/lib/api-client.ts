// shared/lib/api-client.ts
import { z } from 'zod';
import { Project, ProjectSchema } from '../types/project';

/**
 * Configuration for the API client
 */
export const ApiClientConfigSchema = z.object({
  baseUrl: z.string().url(),
  apiKey: z.string().optional(),
  webhookUrl: z.string().url().optional(),
});

export type ApiClientConfig = z.infer<typeof ApiClientConfigSchema>;

/**
 * Schema for translation/project request
 */
export const ProjectRequestSchema = z.object({
  name: z.string(),
  workflowId: z.string(),
  workflowVersion: z.number(),
  organizationId: z.string(),
  owners: z.array(z.string()),
  inputValue: z.record(z.string(), z.any()),
  useStream: z.boolean().optional(),
  webhookUrl: z.string().url().optional()
});

export type ProjectRequest = z.infer<typeof ProjectRequestSchema>;

/**
 * Project creation response
 */
export interface ProjectResponse {
  projectId: string;
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
    // Apply configured webhookUrl if not explicitly provided
    const finalRequest = {
      ...request,
      webhookUrl: request.webhookUrl === '' 
        ? undefined 
        : (request.webhookUrl || this.config.webhookUrl)
    };

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
              } catch (jsonError) {
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
   * Create a preconfigured client from environment variables
   * @returns A new ApiClient instance configured from environment
   */
  static fromEnv(): ApiClient {
    // For browsers and Node.js environments
    const env = typeof process !== 'undefined' ? process.env : 
               (typeof window !== 'undefined' ? (window as any).env : {});

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
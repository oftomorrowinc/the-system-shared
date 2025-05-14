"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = exports.ProjectRequestSchema = exports.ApiClientConfigSchema = void 0;
// shared/lib/api-client.ts
const zod_1 = require("zod");
/**
 * Configuration for the API client
 */
exports.ApiClientConfigSchema = zod_1.z.object({
    baseUrl: zod_1.z.string().url(),
    apiKey: zod_1.z.string().optional(),
    webhookUrl: zod_1.z.string().url().optional(),
});
/**
 * Schema for translation/project request
 */
exports.ProjectRequestSchema = zod_1.z.object({
    name: zod_1.z.string(),
    workflowId: zod_1.z.string(),
    workflowVersion: zod_1.z.number(),
    organizationId: zod_1.z.string(),
    owners: zod_1.z.array(zod_1.z.string()),
    inputValue: zod_1.z.record(zod_1.z.string(), zod_1.z.any()),
    useStream: zod_1.z.boolean().optional(),
    webhookUrl: zod_1.z.string().url().optional()
});
/**
 * API client for interacting with the-system-server
 */
class ApiClient {
    config;
    constructor(config) {
        this.config = exports.ApiClientConfigSchema.parse(config);
    }
    /**
     * Create and execute a project based on a workflow
     * @param request The project request
     * @param onStreamData Optional callback for stream data (when useStream is true)
     * @returns A promise containing the projectId or stream results
     */
    async createProject(request, onStreamData) {
        // Apply configured webhookUrl if not explicitly provided
        const finalRequest = {
            ...request,
            webhookUrl: request.webhookUrl === ''
                ? undefined
                : (request.webhookUrl || this.config.webhookUrl)
        };
        const validatedRequest = exports.ProjectRequestSchema.parse(finalRequest);
        const headers = {
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
                    if (done)
                        break;
                    const chunk = decoder.decode(value, { stream: true });
                    try {
                        // The stream may contain multiple items separated by newlines
                        const parts = chunk.split('\n').filter(Boolean);
                        for (const part of parts) {
                            // Try to parse as JSON, but if it fails, pass the raw string
                            try {
                                const data = JSON.parse(part);
                                onStreamData(data);
                            }
                            catch (jsonError) {
                                // If not valid JSON, pass the raw string
                                onStreamData({ text: part, type: 'raw' });
                            }
                        }
                    }
                    catch (e) {
                        console.error('Error processing stream data:', e);
                        // Pass any streaming errors to the callback
                        if (e instanceof Error) {
                            onStreamData({ error: e.message, type: 'error' });
                        }
                        else {
                            onStreamData({ error: String(e), type: 'error' });
                        }
                    }
                }
                return;
            }
            else {
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
        }
        catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    }
    /**
     * Get project results by project ID
     * @param projectId The ID of the project
     * @returns The project documents
     */
    async getProjectResults(projectId) {
        const headers = {
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
        }
        catch (error) {
            console.error('Error getting project results:', error);
            throw error;
        }
    }
    /**
     * Create a preconfigured client from environment variables
     * @returns A new ApiClient instance configured from environment
     */
    static fromEnv() {
        // For browsers and Node.js environments
        const env = typeof process !== 'undefined' ? process.env :
            (typeof window !== 'undefined' ? window.env : {});
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
exports.ApiClient = ApiClient;

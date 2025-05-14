import { z } from 'zod';
/**
 * Configuration for the API client
 */
export declare const ApiClientConfigSchema: z.ZodObject<{
    baseUrl: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
    webhookUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    baseUrl: string;
    webhookUrl?: string | undefined;
    apiKey?: string | undefined;
}, {
    baseUrl: string;
    webhookUrl?: string | undefined;
    apiKey?: string | undefined;
}>;
export type ApiClientConfig = z.infer<typeof ApiClientConfigSchema>;
/**
 * Schema for translation/project request
 */
export declare const ProjectRequestSchema: z.ZodObject<{
    name: z.ZodString;
    workflowId: z.ZodString;
    workflowVersion: z.ZodNumber;
    organizationId: z.ZodString;
    owners: z.ZodArray<z.ZodString, "many">;
    inputValue: z.ZodRecord<z.ZodString, z.ZodAny>;
    useStream: z.ZodOptional<z.ZodBoolean>;
    webhookUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    organizationId: string;
    workflowVersion: number;
    owners: string[];
    workflowId: string;
    inputValue: Record<string, any>;
    webhookUrl?: string | undefined;
    useStream?: boolean | undefined;
}, {
    name: string;
    organizationId: string;
    workflowVersion: number;
    owners: string[];
    workflowId: string;
    inputValue: Record<string, any>;
    webhookUrl?: string | undefined;
    useStream?: boolean | undefined;
}>;
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
export declare class ApiClient {
    private config;
    constructor(config: ApiClientConfig);
    /**
     * Create and execute a project based on a workflow
     * @param request The project request
     * @param onStreamData Optional callback for stream data (when useStream is true)
     * @returns A promise containing the projectId or stream results
     */
    createProject(request: ProjectRequest, onStreamData?: (data: any) => void): Promise<ProjectResponse | void>;
    /**
     * Get project results by project ID
     * @param projectId The ID of the project
     * @returns The project documents
     */
    getProjectResults(projectId: string): Promise<any>;
    /**
     * Create a preconfigured client from environment variables
     * @returns A new ApiClient instance configured from environment
     */
    static fromEnv(): ApiClient;
}

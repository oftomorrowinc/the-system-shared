import { z } from 'zod';
export declare const AgentConfigSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    tools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    maxTurns: z.ZodOptional<z.ZodNumber>;
    system: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    system: string;
    tools?: string[] | undefined;
    maxTurns?: number | undefined;
}, {
    name: string;
    description: string;
    system: string;
    tools?: string[] | undefined;
    maxTurns?: number | undefined;
}>;
export declare const AgentToolSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["agent", "tool"]>;
}, "strip", z.ZodTypeAny, {
    type: "agent" | "tool";
    name: string;
}, {
    type: "agent" | "tool";
    name: string;
}>;
export type AgentConfig = z.infer<typeof AgentConfigSchema>;
export type AgentTool = z.infer<typeof AgentToolSchema>;

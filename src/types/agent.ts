// shared/types/agent.ts
import { z } from 'zod';

// Agent configuration schema
export const AgentConfigSchema = z.object({
  name: z.string(),
  description: z.string(),
  tools: z.array(z.string()).optional(),
  maxTurns: z.number().positive().optional(),
  system: z.string(),
});

// Agent tool schema
export const AgentToolSchema = z.object({
  name: z.string(),
  type: z.enum(['agent', 'tool']),
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;
export type AgentTool = z.infer<typeof AgentToolSchema>;

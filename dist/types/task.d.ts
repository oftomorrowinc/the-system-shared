import { z } from 'zod';
import { WithRequired } from './common';
export declare const TaskSchema: z.ZodObject<
  {
    id: z.ZodString;
    name: z.ZodString;
    role: z.ZodString;
    visibility: z.ZodEnum<['public', 'private']>;
    organizationId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    description: z.ZodString;
    successCriteria: z.ZodArray<z.ZodString, 'many'>;
    processSteps: z.ZodArray<z.ZodString, 'many'>;
    inputSchemaIds: z.ZodArray<z.ZodString, 'many'>;
    outputSchemaId: z.ZodString;
    tools: z.ZodDefault<z.ZodArray<z.ZodString, 'many'>>;
    subTasks: z.ZodDefault<z.ZodArray<z.ZodString, 'many'>>;
    model: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    stopSequence: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>>;
    maxOutputTokens: z.ZodDefault<z.ZodNumber>;
    temperature: z.ZodDefault<z.ZodNumber>;
    topP: z.ZodDefault<z.ZodNumber>;
    topK: z.ZodDefault<z.ZodNumber>;
    metrics: z.ZodObject<
      {
        totalAttempts: z.ZodNumber;
        successfulAttempts: z.ZodNumber;
        successRate: z.ZodNumber;
        avgTimeAll: z.ZodNumber;
        avgTimeSuccessful: z.ZodNumber;
        avgRating: z.ZodOptional<z.ZodNumber>;
        totalCost: z.ZodNumber;
        avgCost: z.ZodNumber;
      },
      'strip',
      z.ZodTypeAny,
      {
        totalAttempts: number;
        successfulAttempts: number;
        successRate: number;
        avgTimeAll: number;
        avgTimeSuccessful: number;
        totalCost: number;
        avgCost: number;
        avgRating?: number | undefined;
      },
      {
        totalAttempts: number;
        successfulAttempts: number;
        successRate: number;
        avgTimeAll: number;
        avgTimeSuccessful: number;
        totalCost: number;
        avgCost: number;
        avgRating?: number | undefined;
      }
    >;
    version: z.ZodDefault<z.ZodNumber>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    deleted: z.ZodDefault<z.ZodBoolean>;
  },
  'strip',
  z.ZodTypeAny,
  {
    name: string;
    description: string;
    tools: string[];
    id: string;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
    role: string;
    visibility: 'private' | 'public';
    metrics: {
      totalAttempts: number;
      successfulAttempts: number;
      successRate: number;
      avgTimeAll: number;
      avgTimeSuccessful: number;
      totalCost: number;
      avgCost: number;
      avgRating?: number | undefined;
    };
    version: number;
    successCriteria: string[];
    processSteps: string[];
    inputSchemaIds: string[];
    outputSchemaId: string;
    subTasks: string[];
    maxOutputTokens: number;
    temperature: number;
    topP: number;
    topK: number;
    organizationId?: string | null | undefined;
    model?: string | null | undefined;
    stopSequence?: string[] | null | undefined;
  },
  {
    name: string;
    description: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    role: string;
    visibility: 'private' | 'public';
    metrics: {
      totalAttempts: number;
      successfulAttempts: number;
      successRate: number;
      avgTimeAll: number;
      avgTimeSuccessful: number;
      totalCost: number;
      avgCost: number;
      avgRating?: number | undefined;
    };
    successCriteria: string[];
    processSteps: string[];
    inputSchemaIds: string[];
    outputSchemaId: string;
    tools?: string[] | undefined;
    deleted?: boolean | undefined;
    organizationId?: string | null | undefined;
    version?: number | undefined;
    subTasks?: string[] | undefined;
    model?: string | null | undefined;
    stopSequence?: string[] | null | undefined;
    maxOutputTokens?: number | undefined;
    temperature?: number | undefined;
    topP?: number | undefined;
    topK?: number | undefined;
  }
>;
export type Task = WithRequired<z.infer<typeof TaskSchema>, 'description' | 'version' | 'deleted'>;

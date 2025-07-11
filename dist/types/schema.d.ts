import { z } from 'zod';
import { WithRequired } from './common';
export declare const SchemaSchema: z.ZodObject<
  {
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    schema: z.ZodString;
    version: z.ZodDefault<z.ZodNumber>;
    visibility: z.ZodEnum<['public', 'private']>;
    organizationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    examples: z.ZodDefault<z.ZodArray<z.ZodString, 'many'>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    deleted: z.ZodDefault<z.ZodBoolean>;
  },
  'strip',
  z.ZodTypeAny,
  {
    name: string;
    description: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
    visibility: 'private' | 'public';
    schema: string;
    version: number;
    examples: string[];
    organizationId?: string | null | undefined;
  },
  {
    name: string;
    description: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    visibility: 'private' | 'public';
    schema: string;
    deleted?: boolean | undefined;
    organizationId?: string | null | undefined;
    version?: number | undefined;
    examples?: string[] | undefined;
  }
>;
export type Schema = WithRequired<z.infer<typeof SchemaSchema>, 'version' | 'deleted'>;

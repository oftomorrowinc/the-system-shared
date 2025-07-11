import { z } from 'zod';
import { WithRequired } from './common';
export declare const ApiKeySchema: z.ZodObject<
  {
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    organizationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    deleted: z.ZodDefault<z.ZodBoolean>;
  },
  'strip',
  z.ZodTypeAny,
  {
    name: string;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
    description?: string | null | undefined;
    id?: string | undefined;
    organizationId?: string | null | undefined;
  },
  {
    name: string;
    createdAt: string;
    updatedAt: string;
    description?: string | null | undefined;
    id?: string | undefined;
    deleted?: boolean | undefined;
    organizationId?: string | null | undefined;
  }
>;
export type ApiKey = WithRequired<z.infer<typeof ApiKeySchema>, 'deleted'>;

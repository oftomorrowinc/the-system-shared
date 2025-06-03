import { z } from 'zod';
import { WithRequired } from './common';
export declare const MonthlyTokenRollupSchema: z.ZodObject<
  {
    id: z.ZodString;
    organizationId: z.ZodString;
    month: z.ZodString;
    year: z.ZodNumber;
    monthNumber: z.ZodNumber;
    totalTokensUsed: z.ZodDefault<z.ZodNumber>;
    isCurrentMonth: z.ZodDefault<z.ZodBoolean>;
    finalizedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
  },
  'strip',
  z.ZodTypeAny,
  {
    id: string;
    createdAt: string;
    updatedAt: string;
    organizationId: string;
    month: string;
    year: number;
    monthNumber: number;
    totalTokensUsed: number;
    isCurrentMonth: boolean;
    finalizedAt?: string | null | undefined;
  },
  {
    id: string;
    createdAt: string;
    updatedAt: string;
    organizationId: string;
    month: string;
    year: number;
    monthNumber: number;
    totalTokensUsed?: number | undefined;
    isCurrentMonth?: boolean | undefined;
    finalizedAt?: string | null | undefined;
  }
>;
export type MonthlyTokenRollup = WithRequired<
  z.infer<typeof MonthlyTokenRollupSchema>,
  'isCurrentMonth'
>;

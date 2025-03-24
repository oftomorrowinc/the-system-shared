import { z } from 'zod';
export type TimestampLike = {
    toDate?: () => Date;
    seconds?: number;
    nanoseconds?: number;
};
export declare const convertTimestampToISOString: (val: unknown) => string;
export declare const isCamelCase: (value: string) => boolean;
export declare const isValidUsername: (value: string) => boolean;
export type WithRequired<T, K extends keyof T> = T & {
    [P in K]-?: T[P];
};
export declare const MetricsSchema: z.ZodObject<{
    totalAttempts: z.ZodNumber;
    successfulAttempts: z.ZodNumber;
    successRate: z.ZodNumber;
    avgTimeAll: z.ZodNumber;
    avgTimeSuccessful: z.ZodNumber;
    avgRating: z.ZodOptional<z.ZodNumber>;
    totalCost: z.ZodNumber;
    avgCost: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    totalAttempts: number;
    successfulAttempts: number;
    successRate: number;
    avgTimeAll: number;
    avgTimeSuccessful: number;
    totalCost: number;
    avgCost: number;
    avgRating?: number | undefined;
}, {
    totalAttempts: number;
    successfulAttempts: number;
    successRate: number;
    avgTimeAll: number;
    avgTimeSuccessful: number;
    totalCost: number;
    avgCost: number;
    avgRating?: number | undefined;
}>;
export type Metrics = z.infer<typeof MetricsSchema>;

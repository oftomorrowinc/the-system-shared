// shared/types/common.ts
import { z } from 'zod';

// Helper type for Timestamp-like object (works with both Firebase and Firebase Admin)
export type TimestampLike = {
  toDate?: () => Date;
  seconds?: number;
  nanoseconds?: number;
};

// Helper function to safely convert any timestamp format to ISO string
export const convertTimestampToISOString = (val: unknown): string => {
  if (val == null) return new Date().toISOString();

  if (typeof val === 'string') {
    try {
      return new Date(val).toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  if (val instanceof Date) return val.toISOString();

  // Check for Firestore Timestamp with toDate method
  if (
    typeof val === 'object' &&
    val !== null &&
    'toDate' in val &&
    typeof (val as TimestampLike).toDate === 'function'
  ) {
    try {
      const date = (val as TimestampLike).toDate?.();
      return date ? date.toISOString() : new Date().toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  // Check for raw timestamp object with seconds
  if (
    typeof val === 'object' &&
    val !== null &&
    'seconds' in val &&
    typeof (val as TimestampLike).seconds === 'number'
  ) {
    try {
      const seconds = (val as TimestampLike).seconds;
      return seconds !== undefined
        ? new Date(seconds * 1000).toISOString()
        : new Date().toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  return new Date().toISOString();
};

// Helper function to validate camelCase
export const isCamelCase = (value: string) => {
  // Regex for camelCase: starts with lowercase letter, followed by any number of letters/numbers
  // No special characters or underscores, and no uppercase first letter
  return /^[a-z][a-zA-Z0-9]*$/.test(value);
};

// Helper function to validate username format
export const isValidUsername = (value: string) => {
  // Must start with capital letter and only contain letters and numbers
  return /^[A-Z][a-zA-Z0-9]*$/.test(value);
};

// Type utility for making certain properties required with defaults
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// Shared schemas that are used by multiple entities
export const MetricsSchema = z.object({
  totalAttempts: z.number().int().min(0),
  successfulAttempts: z.number().int().min(0),
  successRate: z.number().min(0).max(1),
  avgTimeAll: z.number().min(0),
  avgTimeSuccessful: z.number().min(0),
  avgRating: z.number().min(0).max(5).optional(),
  totalCost: z.number().min(0),
  avgCost: z.number().min(0),
});

export type Metrics = z.infer<typeof MetricsSchema>;

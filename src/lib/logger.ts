// For @the-system/shared library
// src/lib/logger.ts

import winston from 'winston';
// import type { Logger } from 'winston';

/**
 * Log levels for the application
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  DEBUG = 'debug',
  TRACE = 'silly'
}

/**
 * Configuration options for the logger
 */
export interface LoggerConfig {
  level: LogLevel;
  service?: string;
  silent?: boolean;
  enableConsole?: boolean;
  enableFile?: boolean;
  filePath?: string;
}

/**
 * Default configuration
 */
const defaultConfig: LoggerConfig = {
  level: LogLevel.INFO,
  service: 'the-system',
  silent: false,
  enableConsole: true,
  enableFile: false
};

/**
 * Determine the environment
 */
// const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;
const isProd = process.env.NODE_ENV === 'production';

/**
 * Creates a logger with the specified configuration
 */
export function createLogger(config: Partial<LoggerConfig> = {}) {
  // Merge with default config
  const mergedConfig = { ...defaultConfig, ...config };
  
  // Set up transports
  const transports: winston.transport[] = [];
  
  // Console transport
  if (mergedConfig.enableConsole) {
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(({ timestamp, level, message, ...rest }) => {
            const metadata = Object.keys(rest).length ? JSON.stringify(rest) : '';
            return `${timestamp} [${mergedConfig.service}] ${level}: ${message} ${metadata}`;
          })
        )
      })
    );
  }
  
  // File transport
  if (mergedConfig.enableFile && mergedConfig.filePath) {
    transports.push(
      new winston.transports.File({
        filename: mergedConfig.filePath,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        )
      })
    );
  }
  
  // Create the logger
  return winston.createLogger({
    level: mergedConfig.level,
    defaultMeta: { service: mergedConfig.service },
    transports,
    silent: mergedConfig.silent || (isTest && !process.env.ENABLE_LOGS)
  });
}

/**
 * Default environment-specific logger configuration
 */
const defaultEnvConfig: Partial<LoggerConfig> = {
  level: LogLevel.DEBUG,
  silent: isTest && !process.env.ENABLE_LOGS,
  enableConsole: !isTest || !!process.env.ENABLE_LOGS,
  enableFile: isProd,
  filePath: isProd ? 'logs/system.log' : undefined
};

/**
 * Create a global logger instance with environment defaults
 */
export const logger = createLogger(defaultEnvConfig);

/**
 * Reconfigure the logger at runtime
 */
export function configureLogger(config: Partial<LoggerConfig>) {
  const newLogger = createLogger({
    ...defaultEnvConfig,
    ...config
  });
  
  // Replace all methods on the exported logger
  // This is a hack to maintain the exported reference
  (Object.keys(newLogger) as Array<keyof typeof newLogger>).forEach(key => {
    if (typeof newLogger[key] === 'function') {
      (logger as any)[key] = newLogger[key].bind(newLogger);
    }
  });
}

// Export a default logger instance
export default logger;
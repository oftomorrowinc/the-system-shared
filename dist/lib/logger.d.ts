import winston from 'winston';
/**
 * Log levels for the application
 */
export declare enum LogLevel {
    ERROR = "error",
    WARN = "warn",
    INFO = "info",
    HTTP = "http",
    DEBUG = "debug",
    TRACE = "silly"
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
 * Creates a logger with the specified configuration
 */
export declare function createLogger(config?: Partial<LoggerConfig>): winston.Logger;
/**
 * Create a global logger instance with environment defaults
 */
export declare const logger: winston.Logger;
/**
 * Reconfigure the logger at runtime
 */
export declare function configureLogger(config: Partial<LoggerConfig>): void;
export default logger;

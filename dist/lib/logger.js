"use strict";
// For @the-system/shared library
// src/lib/logger.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.LogLevel = void 0;
exports.createLogger = createLogger;
exports.configureLogger = configureLogger;
const winston_1 = __importDefault(require("winston"));
// import type { Logger } from 'winston';
/**
 * Log levels for the application
 */
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "error";
    LogLevel["WARN"] = "warn";
    LogLevel["INFO"] = "info";
    LogLevel["HTTP"] = "http";
    LogLevel["DEBUG"] = "debug";
    LogLevel["TRACE"] = "silly";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
/**
 * Default configuration
 */
const defaultConfig = {
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
function createLogger(config = {}) {
    // Merge with default config
    const mergedConfig = { ...defaultConfig, ...config };
    // Set up transports
    const transports = [];
    // Console transport
    if (mergedConfig.enableConsole) {
        transports.push(new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp(), winston_1.default.format.printf(({ timestamp, level, message, ...rest }) => {
                const metadata = Object.keys(rest).length ? JSON.stringify(rest) : '';
                return `${timestamp} [${mergedConfig.service}] ${level}: ${message} ${metadata}`;
            }))
        }));
    }
    // File transport
    if (mergedConfig.enableFile && mergedConfig.filePath) {
        transports.push(new winston_1.default.transports.File({
            filename: mergedConfig.filePath,
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json())
        }));
    }
    // Create the logger
    return winston_1.default.createLogger({
        level: mergedConfig.level,
        defaultMeta: { service: mergedConfig.service },
        transports,
        silent: mergedConfig.silent || (isTest && !process.env.ENABLE_LOGS)
    });
}
/**
 * Default environment-specific logger configuration
 */
const defaultEnvConfig = {
    level: LogLevel.DEBUG,
    silent: isTest && !process.env.ENABLE_LOGS,
    enableConsole: !isTest || !!process.env.ENABLE_LOGS,
    enableFile: isProd,
    filePath: isProd ? 'logs/system.log' : undefined
};
/**
 * Create a global logger instance with environment defaults
 */
exports.logger = createLogger(defaultEnvConfig);
/**
 * Reconfigure the logger at runtime
 */
function configureLogger(config) {
    const newLogger = createLogger({
        ...defaultEnvConfig,
        ...config
    });
    // Replace all methods on the exported logger
    // This is a hack to maintain the exported reference
    Object.keys(newLogger).forEach(key => {
        if (typeof newLogger[key] === 'function') {
            exports.logger[key] = newLogger[key].bind(newLogger);
        }
    });
}
// Export a default logger instance
exports.default = exports.logger;

import winston from 'winston'
import { config } from 'dotenv'

// Load environment variables
config()

/**
 * Centralized logging utility
 * Provides structured logging with different levels and formats
 */

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

// Tell winston that you want to link the colors
winston.addColors(colors)

// Define the format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
)

// Define the format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

// Define which transports the logger must use
const transports = [
  // Console transport
  new winston.transports.Console({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: consoleFormat,
  }),
]

// Add file transports in production
if (process.env.NODE_ENV === 'production') {
  // Error log file
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  )

  // Combined log file
  transports.push(
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  )
}

// Create the logger
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  levels,
  transports,
  exitOnError: false,
})

/**
 * Security logging utilities
 * Logs security-related events for monitoring and auditing
 */
export class SecurityLogger {
  /**
   * Logs authentication events
   */
  static logAuth(event: string, userId?: string, details?: any): void {
    logger.info('Authentication event', {
      event,
      userId,
      details,
      timestamp: new Date().toISOString(),
      type: 'security',
      category: 'authentication',
    })
  }

  /**
   * Logs authorization events
   */
  static logAuthz(event: string, userId?: string, resource?: string, details?: any): void {
    logger.warn('Authorization event', {
      event,
      userId,
      resource,
      details,
      timestamp: new Date().toISOString(),
      type: 'security',
      category: 'authorization',
    })
  }

  /**
   * Logs payment events
   */
  static logPayment(event: string, orderId?: string, amount?: number, details?: any): void {
    logger.info('Payment event', {
      event,
      orderId,
      amount,
      details,
      timestamp: new Date().toISOString(),
      type: 'security',
      category: 'payment',
    })
  }

  /**
   * Logs webhook events
   */
  static logWebhook(event: string, source: string, orderId?: string, details?: any): void {
    logger.info('Webhook event', {
      event,
      source,
      orderId,
      details,
      timestamp: new Date().toISOString(),
      type: 'security',
      category: 'webhook',
    })
  }

  /**
   * Logs fraud detection events
   */
  static logFraud(event: string, details?: any): void {
    logger.error('Fraud detection event', {
      event,
      details,
      timestamp: new Date().toISOString(),
      type: 'security',
      category: 'fraud',
    })
  }

  /**
   * Logs data access events
   */
  static logDataAccess(event: string, userId?: string, resource?: string, details?: any): void {
    logger.info('Data access event', {
      event,
      userId,
      resource,
      details,
      timestamp: new Date().toISOString(),
      type: 'security',
      category: 'data_access',
    })
  }
}

/**
 * Business logging utilities
 * Logs business-related events for monitoring and analytics
 */
export class BusinessLogger {
  /**
   * Logs deal events
   */
  static logDeal(event: string, dealId?: string, details?: any): void {
    logger.info('Deal event', {
      event,
      dealId,
      details,
      timestamp: new Date().toISOString(),
      type: 'business',
      category: 'deal',
    })
  }

  /**
   * Logs order events
   */
  static logOrder(event: string, orderId?: string, customerId?: string, details?: any): void {
    logger.info('Order event', {
      event,
      orderId,
      customerId,
      details,
      timestamp: new Date().toISOString(),
      type: 'business',
      category: 'order',
    })
  }

  /**
   * Logs coupon events
   */
  static logCoupon(event: string, couponId?: string, orderId?: string, details?: any): void {
    logger.info('Coupon event', {
      event,
      couponId,
      orderId,
      details,
      timestamp: new Date().toISOString(),
      type: 'business',
      category: 'coupon',
    })
  }

  /**
   * Logs redemption events
   */
  static logRedemption(event: string, redemptionId?: string, couponId?: string, details?: any): void {
    logger.info('Redemption event', {
      event,
      redemptionId,
      couponId,
      details,
      timestamp: new Date().toISOString(),
      type: 'business',
      category: 'redemption',
    })
  }

  /**
   * Logs customer events
   */
  static logCustomer(event: string, customerId?: string, details?: any): void {
    logger.info('Customer event', {
      event,
      customerId,
      details,
      timestamp: new Date().toISOString(),
      type: 'business',
      category: 'customer',
    })
  }
}

/**
 * Performance logging utilities
 * Logs performance-related events for monitoring and optimization
 */
export class PerformanceLogger {
  /**
   * Logs API performance
   */
  static logApiPerformance(
    endpoint: string,
    method: string,
    duration: number,
    statusCode: number,
    details?: any
  ): void {
    const level = duration > 1000 ? 'warn' : 'info'
    logger[level]('API performance', {
      endpoint,
      method,
      duration: `${duration}ms`,
      statusCode,
      details,
      timestamp: new Date().toISOString(),
      type: 'performance',
      category: 'api',
    })
  }

  /**
   * Logs database performance
   */
  static logDatabasePerformance(
    operation: string,
    duration: number,
    table?: string,
    details?: any
  ): void {
    const level = duration > 1000 ? 'warn' : 'info'
    logger[level]('Database performance', {
      operation,
      duration: `${duration}ms`,
      table,
      details,
      timestamp: new Date().toISOString(),
      type: 'performance',
      category: 'database',
    })
  }

  /**
   * Logs external service performance
   */
  static logExternalServicePerformance(
    service: string,
    operation: string,
    duration: number,
    statusCode?: number,
    details?: any
  ): void {
    const level = duration > 5000 ? 'warn' : 'info'
    logger[level]('External service performance', {
      service,
      operation,
      duration: `${duration}ms`,
      statusCode,
      details,
      timestamp: new Date().toISOString(),
      type: 'performance',
      category: 'external_service',
    })
  }
}

/**
 * Error logging utilities
 * Logs errors with proper context and stack traces
 */
export class ErrorLogger {
  /**
   * Logs application errors
   */
  static logError(error: Error, context?: any): void {
    logger.error('Application error', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      type: 'error',
      category: 'application',
    })
  }

  /**
   * Logs validation errors
   */
  static logValidationError(field: string, value: any, rule: string, context?: any): void {
    logger.warn('Validation error', {
      field,
      value,
      rule,
      context,
      timestamp: new Date().toISOString(),
      type: 'error',
      category: 'validation',
    })
  }

  /**
   * Logs database errors
   */
  static logDatabaseError(error: Error, operation: string, table?: string, context?: any): void {
    logger.error('Database error', {
      message: error.message,
      stack: error.stack,
      operation,
      table,
      context,
      timestamp: new Date().toISOString(),
      type: 'error',
      category: 'database',
    })
  }

  /**
   * Logs external service errors
   */
  static logExternalServiceError(
    error: Error,
    service: string,
    operation: string,
    context?: any
  ): void {
    logger.error('External service error', {
      message: error.message,
      stack: error.stack,
      service,
      operation,
      context,
      timestamp: new Date().toISOString(),
      type: 'error',
      category: 'external_service',
    })
  }
}

// Export the main logger and utility classes
export { SecurityLogger, BusinessLogger, PerformanceLogger, ErrorLogger }

import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import { logger } from './logger'

/**
 * Server-side validation framework
 * Provides comprehensive input validation and sanitization
 */

/**
 * Common validation schemas
 */
export const commonSchemas = {
  // Email validation
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),

  // Phone number validation (E.164 format)
  phone: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be in E.164 format (e.g., +6281234567890)',
      'any.required': 'Phone number is required',
    }),

  // Indonesian phone number validation
  indonesianPhone: Joi.string()
    .pattern(/^\+62[0-9]{8,13}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be a valid Indonesian number (+62xxxxxxxxx)',
      'any.required': 'Phone number is required',
    }),

  // Currency amount validation
  currencyAmount: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.positive': 'Amount must be positive',
      'number.precision': 'Amount can have maximum 2 decimal places',
      'any.required': 'Amount is required',
    }),

  // IDR amount validation
  idrAmount: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.integer': 'IDR amount must be a whole number',
      'number.positive': 'IDR amount must be positive',
      'any.required': 'Amount is required',
    }),

  // Date validation
  date: Joi.date()
    .iso()
    .required()
    .messages({
      'date.format': 'Date must be in ISO format',
      'any.required': 'Date is required',
    }),

  // Future date validation
  futureDate: Joi.date()
    .iso()
    .greater('now')
    .required()
    .messages({
      'date.format': 'Date must be in ISO format',
      'date.greater': 'Date must be in the future',
      'any.required': 'Date is required',
    }),

  // Slug validation
  slug: Joi.string()
    .pattern(/^[a-z0-9-]+$/)
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
      'string.min': 'Slug must be at least 3 characters long',
      'string.max': 'Slug must be less than 100 characters',
      'any.required': 'Slug is required',
    }),

  // Password validation
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required',
    }),

  // UUID validation
  uuid: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Must be a valid UUID',
      'any.required': 'ID is required',
    }),

  // Pagination validation
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('asc', 'desc').default('desc'),
    sortBy: Joi.string().max(50).default('createdAt'),
  }),
}

/**
 * Deal validation schemas
 */
export const dealSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    slug: commonSchemas.slug,
    description: Joi.string().min(10).required(),
    shortDescription: Joi.string().min(10).max(500).required(),
    pricingType: Joi.string().valid('fixed_price', 'percentage_discount', 'fixed_discount').required(),
    
    // Fixed price fields
    originalPrice: Joi.when('pricingType', {
      is: 'fixed_price',
      then: commonSchemas.idrAmount,
      otherwise: Joi.number().optional(),
    }),
    discountPrice: Joi.when('pricingType', {
      is: 'fixed_price',
      then: commonSchemas.idrAmount,
      otherwise: Joi.number().optional(),
    }),
    
    // Percentage discount fields
    discountPercentage: Joi.when('pricingType', {
      is: 'percentage_discount',
      then: Joi.number().min(1).max(100).required(),
      otherwise: Joi.number().optional(),
    }),
    maxDiscountAmount: Joi.when('pricingType', {
      is: 'percentage_discount',
      then: commonSchemas.idrAmount.optional(),
      otherwise: Joi.number().optional(),
    }),
    
    // Fixed discount fields
    discountAmount: Joi.when('pricingType', {
      is: 'fixed_discount',
      then: commonSchemas.idrAmount,
      otherwise: Joi.number().optional(),
    }),
    
    // Minimum order requirements
    minimumOrderAmount: commonSchemas.idrAmount,
    minimumOrderItems: Joi.number().integer().min(1).default(1),
    
    // Timing
    startDate: commonSchemas.futureDate,
    endDate: commonSchemas.futureDate,
    timezone: Joi.string().default('Asia/Jakarta'),
    
    // Inventory
    maxCoupons: Joi.number().integer().min(1).optional(),
    
    // Status
    status: Joi.string().valid('draft', 'active', 'expired', 'sold_out', 'cancelled').default('draft'),
    isVisible: Joi.boolean().default(false),
    isActive: Joi.boolean().default(false),
    
    // Relationships
    merchant: commonSchemas.uuid,
    category: commonSchemas.uuid,
    
    // Content
    termsAndConditions: Joi.string().min(10).required(),
    highlights: Joi.array().items(Joi.string().max(100)).min(1).required(),
    
    // SEO
    metaTitle: Joi.string().max(60).optional(),
    metaDescription: Joi.string().max(160).optional(),
  }).custom((value, helpers) => {
    // Custom validation for date range
    if (value.startDate && value.endDate) {
      const startDate = new Date(value.startDate)
      const endDate = new Date(value.endDate)
      
      if (startDate >= endDate) {
        return helpers.error('date.range', { message: 'End date must be after start date' })
      }
    }
    
    // Custom validation for pricing
    if (value.pricingType === 'fixed_price') {
      if (value.originalPrice && value.discountPrice && value.discountPrice >= value.originalPrice) {
        return helpers.error('pricing.fixed', { message: 'Discount price must be less than original price' })
      }
    }
    
    return value
  }),

  update: Joi.object({
    title: Joi.string().min(3).max(200).optional(),
    slug: commonSchemas.slug.optional(),
    description: Joi.string().min(10).optional(),
    shortDescription: Joi.string().min(10).max(500).optional(),
    pricingType: Joi.string().valid('fixed_price', 'percentage_discount', 'fixed_discount').optional(),
    
    // All other fields are optional for updates
    originalPrice: commonSchemas.idrAmount.optional(),
    discountPrice: commonSchemas.idrAmount.optional(),
    discountPercentage: Joi.number().min(1).max(100).optional(),
    maxDiscountAmount: commonSchemas.idrAmount.optional(),
    discountAmount: commonSchemas.idrAmount.optional(),
    minimumOrderAmount: commonSchemas.idrAmount.optional(),
    minimumOrderItems: Joi.number().integer().min(1).optional(),
    startDate: commonSchemas.date.optional(),
    endDate: commonSchemas.date.optional(),
    timezone: Joi.string().optional(),
    maxCoupons: Joi.number().integer().min(1).optional(),
    status: Joi.string().valid('draft', 'active', 'expired', 'sold_out', 'cancelled').optional(),
    isVisible: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
    merchant: commonSchemas.uuid.optional(),
    category: commonSchemas.uuid.optional(),
    termsAndConditions: Joi.string().min(10).optional(),
    highlights: Joi.array().items(Joi.string().max(100)).min(1).optional(),
    metaTitle: Joi.string().max(60).optional(),
    metaDescription: Joi.string().max(160).optional(),
  }),
}

/**
 * Order validation schemas
 */
export const orderSchemas = {
  create: Joi.object({
    dealId: commonSchemas.uuid,
    customerId: commonSchemas.uuid,
    orderAmount: commonSchemas.idrAmount,
    quantity: Joi.number().integer().min(1).max(10).required(),
    customerEmail: commonSchemas.email,
    customerPhone: commonSchemas.indonesianPhone,
    customerName: Joi.string().min(2).max(100).required(),
  }),
}

/**
 * Customer validation schemas
 */
export const customerSchemas = {
  create: Joi.object({
    email: commonSchemas.email,
    phone: commonSchemas.indonesianPhone,
    name: Joi.string().min(2).max(100).required(),
    whatsappNumber: commonSchemas.indonesianPhone.optional(),
    isSubscribedToNotifications: Joi.boolean().default(true),
    notificationPreferences: Joi.object({
      email: Joi.boolean().default(true),
      whatsapp: Joi.boolean().default(true),
      sms: Joi.boolean().default(false),
    }).optional(),
  }),
  
  update: Joi.object({
    email: commonSchemas.email.optional(),
    phone: commonSchemas.indonesianPhone.optional(),
    name: Joi.string().min(2).max(100).optional(),
    whatsappNumber: commonSchemas.indonesianPhone.optional(),
    isSubscribedToNotifications: Joi.boolean().optional(),
    notificationPreferences: Joi.object({
      email: Joi.boolean().optional(),
      whatsapp: Joi.boolean().optional(),
      sms: Joi.boolean().optional(),
    }).optional(),
  }),
}

/**
 * Validation middleware factory
 */
export function validateRequest(schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[property]
    
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    })
    
    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value,
      }))
      
      logger.warn('Validation error', {
        errors: errorDetails,
        path: req.path,
        method: req.method,
        ip: req.ip,
      })
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorDetails,
      })
    }
    
    // Replace the original data with validated and sanitized data
    req[property] = value
    next()
  }
}

/**
 * Sanitization utilities
 */
export class Sanitizer {
  /**
   * Sanitizes string input
   */
  static sanitizeString(input: string): string {
    if (typeof input !== 'string') return ''
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .substring(0, 1000) // Limit length
  }
  
  /**
   * Sanitizes email input
   */
  static sanitizeEmail(email: string): string {
    if (typeof email !== 'string') return ''
    
    return email
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9@._-]/g, '') // Keep only valid email characters
  }
  
  /**
   * Sanitizes phone number input
   */
  static sanitizePhone(phone: string): string {
    if (typeof phone !== 'string') return ''
    
    // Remove all non-digit characters except +
    let sanitized = phone.replace(/[^\d+]/g, '')
    
    // Ensure it starts with +
    if (!sanitized.startsWith('+')) {
      sanitized = '+' + sanitized
    }
    
    return sanitized
  }
  
  /**
   * Sanitizes numeric input
   */
  static sanitizeNumber(input: any): number {
    if (typeof input === 'number') return input
    if (typeof input === 'string') {
      const parsed = parseFloat(input)
      return isNaN(parsed) ? 0 : parsed
    }
    return 0
  }
  
  /**
   * Sanitizes object input
   */
  static sanitizeObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) return {}
    
    const sanitized: any = {}
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value)
      } else if (typeof value === 'number') {
        sanitized[key] = this.sanitizeNumber(value)
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value)
      } else {
        sanitized[key] = value
      }
    }
    
    return sanitized
  }
}

/**
 * Input validation utilities
 */
export class InputValidator {
  /**
   * Validates and sanitizes input data
   */
  static validateAndSanitize<T>(data: any, schema: Joi.ObjectSchema): T {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    })
    
    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value,
      }))
      
      logger.warn('Input validation failed', {
        errors: errorDetails,
      })
      
      throw new Error(`Validation failed: ${errorDetails.map(e => e.message).join(', ')}`)
    }
    
    return value as T
  }
  
  /**
   * Validates required fields
   */
  static validateRequired(data: any, requiredFields: string[]): void {
    const missingFields = requiredFields.filter(field => {
      const value = data[field]
      return value === undefined || value === null || value === ''
    })
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }
  }
  
  /**
   * Validates data types
   */
  static validateTypes(data: any, typeMap: Record<string, string>): void {
    for (const [field, expectedType] of Object.entries(typeMap)) {
      const value = data[field]
      const actualType = typeof value
      
      if (value !== undefined && actualType !== expectedType) {
        throw new Error(`Field '${field}' must be of type ${expectedType}, got ${actualType}`)
      }
    }
  }
}

// Export all schemas and utilities
export {
  Joi,
  Sanitizer,
  InputValidator,
}

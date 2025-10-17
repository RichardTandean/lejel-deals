import { CollectionBeforeChangeHook, CollectionAfterChangeHook } from 'payload/types'
import { logger } from '@/utilities/logger'
import { v4 as uuidv4 } from 'uuid'

/**
 * Before change hook for customers
 * Validates data and sets computed fields
 */
export const beforeChange: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  try {
    // Normalize email
    if (data.email) {
      data.email = data.email.toLowerCase().trim()
    }

    // Normalize phone numbers
    if (data.phone) {
      data.phone = data.phone.replace(/[^\d+]/g, '')
      if (!data.phone.startsWith('+')) {
        data.phone = '+' + data.phone
      }
    }

    if (data.whatsappNumber) {
      data.whatsappNumber = data.whatsappNumber.replace(/[^\d+]/g, '')
      if (!data.whatsappNumber.startsWith('+')) {
        data.whatsappNumber = '+' + data.whatsappNumber
      }
    }

    // Normalize name
    if (data.name) {
      data.name = data.name.trim()
    }

    // Generate verification token for new customers
    if (operation === 'create' && !data.verificationToken) {
      data.verificationToken = uuidv4()
      data.verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    }

    // Set last login time
    if (operation === 'update' && req.user?.id === data.id) {
      data.lastLoginAt = new Date()
    }

    // Validate date of birth
    if (data.dateOfBirth) {
      const birthDate = new Date(data.dateOfBirth)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      
      if (age < 13) {
        throw new Error('Customer must be at least 13 years old')
      }
      
      if (age > 120) {
        throw new Error('Invalid date of birth')
      }
    }

    logger.info('Customer beforeChange hook completed', {
      customerId: data.id,
      operation,
      email: data.email,
    })

    return data
  } catch (error) {
    logger.error('Error in customer beforeChange hook', {
      error: error instanceof Error ? error.message : 'Unknown error',
      customerId: data.id,
      operation,
    })
    throw error
  }
}

/**
 * After change hook for customers
 * Handles post-processing and notifications
 */
export const afterChange: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  try {
    // Log customer changes for audit
    logger.info('Customer changed', {
      customerId: doc.id,
      operation,
      email: doc.email,
      isActive: doc.isActive,
      isVerified: doc.isVerified,
      userId: req.user?.id,
    })

    // Handle new customer registration
    if (operation === 'create') {
      logger.info('New customer registered', {
        customerId: doc.id,
        email: doc.email,
        name: doc.name,
        phone: doc.phone,
      })
      
      // TODO: Send welcome email
      // TODO: Send verification email if not verified
    }

    // Handle verification
    if (operation === 'update' && doc.isVerified) {
      logger.info('Customer verified', {
        customerId: doc.id,
        email: doc.email,
      })
    }

    // Handle activation/deactivation
    if (operation === 'update') {
      if (doc.isActive) {
        logger.info('Customer activated', {
          customerId: doc.id,
          email: doc.email,
        })
      } else {
        logger.info('Customer deactivated', {
          customerId: doc.id,
          email: doc.email,
        })
      }
    }

    return doc
  } catch (error) {
    logger.error('Error in customer afterChange hook', {
      error: error instanceof Error ? error.message : 'Unknown error',
      customerId: doc.id,
      operation,
    })
    // Don't throw error here as it would prevent the change from being saved
  }
}

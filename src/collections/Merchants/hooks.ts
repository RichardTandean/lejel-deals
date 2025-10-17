import { CollectionBeforeChangeHook, CollectionAfterChangeHook } from 'payload/types'
import { logger } from '@/utilities/logger'

/**
 * Before change hook for merchants
 * Validates data and sets computed fields
 */
export const beforeChange: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  try {
    // Normalize slug
    if (data.slug) {
      data.slug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-')
    }

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

    if (data.whatsapp) {
      data.whatsapp = data.whatsapp.replace(/[^\d+]/g, '')
      if (!data.whatsapp.startsWith('+')) {
        data.whatsapp = '+' + data.whatsapp
      }
    }

    // Set verification date if being verified
    if (data.isVerified && !data.verificationDate) {
      data.verificationDate = new Date()
    }

    // Validate operating hours format
    if (data.operatingHours) {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      
      for (const day of days) {
        const dayHours = data.operatingHours[day]
        if (dayHours && !dayHours.closed) {
          // Validate time format (HH:MM)
          if (dayHours.open && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(dayHours.open)) {
            throw new Error(`Invalid time format for ${day} opening hours. Use HH:MM format.`)
          }
          if (dayHours.close && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(dayHours.close)) {
            throw new Error(`Invalid time format for ${day} closing hours. Use HH:MM format.`)
          }
        }
      }
    }

    logger.info('Merchant beforeChange hook completed', {
      merchantId: data.id,
      operation,
      businessName: data.businessName,
    })

    return data
  } catch (error) {
    logger.error('Error in merchant beforeChange hook', {
      error: error instanceof Error ? error.message : 'Unknown error',
      merchantId: data.id,
      operation,
    })
    throw error
  }
}

/**
 * After change hook for merchants
 * Handles post-processing and notifications
 */
export const afterChange: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  try {
    // Log merchant changes for audit
    logger.info('Merchant changed', {
      merchantId: doc.id,
      operation,
      businessName: doc.businessName,
      isActive: doc.isActive,
      isVerified: doc.isVerified,
      userId: req.user?.id,
    })

    // Handle verification
    if (operation === 'update' && doc.isVerified) {
      logger.info('Merchant verified', {
        merchantId: doc.id,
        businessName: doc.businessName,
        verificationDate: doc.verificationDate,
      })
    }

    // Handle activation/deactivation
    if (operation === 'update') {
      if (doc.isActive) {
        logger.info('Merchant activated', {
          merchantId: doc.id,
          businessName: doc.businessName,
        })
      } else {
        logger.info('Merchant deactivated', {
          merchantId: doc.id,
          businessName: doc.businessName,
        })
      }
    }

    return doc
  } catch (error) {
    logger.error('Error in merchant afterChange hook', {
      error: error instanceof Error ? error.message : 'Unknown error',
      merchantId: doc.id,
      operation,
    })
    // Don't throw error here as it would prevent the change from being saved
  }
}

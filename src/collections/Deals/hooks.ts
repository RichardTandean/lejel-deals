import { CollectionBeforeChangeHook, CollectionAfterChangeHook } from 'payload/types'
import { Deal } from '@/payload-types'
import { calculateDealPrice, isDealActive } from './validation'
import { logger } from '@/utilities/logger'

/**
 * Before change hook for deals
 * Validates data and calculates computed fields
 */
export const beforeChange: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  try {
    // Calculate computed fields
    if (data.pricingType === 'fixed_price' && data.originalPrice && data.discountPrice) {
      data.savings = data.originalPrice - data.discountPrice
      data.finalPrice = data.discountPrice
    } else if (data.pricingType === 'percentage_discount' && data.discountPercentage) {
      // For percentage discounts, we can't calculate final price without order amount
      // This will be calculated during order processing
      data.savings = 0
      data.finalPrice = 0
    } else if (data.pricingType === 'fixed_discount' && data.discountAmount) {
      // For fixed discounts, we can't calculate final price without order amount
      // This will be calculated during order processing
      data.savings = data.discountAmount
      data.finalPrice = 0
    }

    // Set inventory cap flag
    data.isInventoryCapped = Boolean(data.maxCoupons && data.maxCoupons > 0)

    // Auto-update status based on dates
    if (data.startDate && data.endDate) {
      const now = new Date()
      const startDate = new Date(data.startDate)
      const endDate = new Date(data.endDate)

      if (data.status === 'draft' && startDate <= now && endDate > now) {
        data.status = 'active'
        data.isActive = true
        data.isVisible = true
      } else if (endDate <= now && data.status === 'active') {
        data.status = 'expired'
        data.isActive = false
      }
    }

    // Validate deal data
    if (operation === 'create' || operation === 'update') {
      // Additional validation can be added here
      if (data.slug) {
        data.slug = data.slug.toLowerCase().trim()
      }
    }

    logger.info('Deal beforeChange hook completed', {
      dealId: data.id,
      operation,
      pricingType: data.pricingType,
      status: data.status,
    })

    return data
  } catch (error) {
    logger.error('Error in deal beforeChange hook', {
      error: error instanceof Error ? error.message : 'Unknown error',
      dealId: data.id,
      operation,
    })
    throw error
  }
}

/**
 * After change hook for deals
 * Handles post-processing and notifications
 */
export const afterChange: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  try {
    // Log deal changes for audit
    logger.info('Deal changed', {
      dealId: doc.id,
      operation,
      status: doc.status,
      pricingType: doc.pricingType,
      title: doc.title,
      userId: req.user?.id,
    })

    // Handle status changes
    if (operation === 'update') {
      // If deal became active, we might want to send notifications
      if (doc.status === 'active' && doc.isVisible) {
        // TODO: Send notifications to subscribed customers
        logger.info('Deal became active', {
          dealId: doc.id,
          title: doc.title,
        })
      }

      // If deal became expired, we might want to clean up
      if (doc.status === 'expired') {
        logger.info('Deal expired', {
          dealId: doc.id,
          title: doc.title,
        })
      }

      // If deal became sold out, we might want to notify
      if (doc.status === 'sold_out') {
        logger.info('Deal sold out', {
          dealId: doc.id,
          title: doc.title,
        })
      }
    }

    // Update search index if needed
    // TODO: Update search index for the deal

    return doc
  } catch (error) {
    logger.error('Error in deal afterChange hook', {
      error: error instanceof Error ? error.message : 'Unknown error',
      dealId: doc.id,
      operation,
    })
    // Don't throw error here as it would prevent the change from being saved
  }
}

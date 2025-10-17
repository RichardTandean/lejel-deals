import { CollectionBeforeChangeHook, CollectionAfterChangeHook } from 'payload/types'
import { logger } from '@/utilities/logger'
import { v4 as uuidv4 } from 'uuid'

/**
 * Before change hook for orders
 * Validates data and sets computed fields
 */
export const beforeChange: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  try {
    // Generate order number for new orders
    if (operation === 'create' && !data.orderNumber) {
      const timestamp = Date.now().toString().slice(-8)
      const random = Math.random().toString(36).substring(2, 6).toUpperCase()
      data.orderNumber = `LD-${timestamp}-${random}`
    }

    // Set expiration time for pending orders (24 hours)
    if (operation === 'create' && data.paymentStatus === 'pending' && !data.expiresAt) {
      data.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    }

    // Set paid time when payment status changes to paid
    if (operation === 'update' && data.paymentStatus === 'paid' && !data.paidAt) {
      data.paidAt = new Date()
    }

    // Validate order amount
    if (data.orderAmount && data.totalAmount) {
      if (data.totalAmount > data.orderAmount) {
        throw new Error('Total amount cannot be greater than order amount')
      }
    }

    // Calculate discount and savings
    if (data.orderAmount && data.totalAmount) {
      data.discountApplied = data.orderAmount - data.totalAmount
      data.savings = data.discountApplied
    }

    // Validate quantity
    if (data.quantity && (data.quantity < 1 || data.quantity > 10)) {
      throw new Error('Quantity must be between 1 and 10')
    }

    // Validate customer data
    if (data.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customerEmail)) {
      throw new Error('Invalid customer email format')
    }

    if (data.customerPhone && !/^\+62[0-9]{8,13}$/.test(data.customerPhone)) {
      throw new Error('Invalid customer phone format')
    }

    logger.info('Order beforeChange hook completed', {
      orderId: data.id,
      operation,
      orderNumber: data.orderNumber,
      paymentStatus: data.paymentStatus,
    })

    return data
  } catch (error) {
    logger.error('Error in order beforeChange hook', {
      error: error instanceof Error ? error.message : 'Unknown error',
      orderId: data.id,
      operation,
    })
    throw error
  }
}

/**
 * After change hook for orders
 * Handles post-processing and notifications
 */
export const afterChange: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  try {
    // Log order changes for audit
    logger.info('Order changed', {
      orderId: doc.id,
      operation,
      orderNumber: doc.orderNumber,
      paymentStatus: doc.paymentStatus,
      totalAmount: doc.totalAmount,
      userId: req.user?.id,
    })

    // Handle new order creation
    if (operation === 'create') {
      logger.info('New order created', {
        orderId: doc.id,
        orderNumber: doc.orderNumber,
        customer: doc.customer,
        deal: doc.deal,
        totalAmount: doc.totalAmount,
      })
      
      // TODO: Send order confirmation email
      // TODO: Update deal inventory
      // TODO: Update customer statistics
    }

    // Handle payment status changes
    if (operation === 'update') {
      if (doc.paymentStatus === 'paid') {
        logger.info('Order paid', {
          orderId: doc.id,
          orderNumber: doc.orderNumber,
          totalAmount: doc.totalAmount,
          paidAt: doc.paidAt,
        })
        
        // TODO: Generate coupons
        // TODO: Send payment confirmation email
        // TODO: Update deal sold count
        // TODO: Update customer statistics
      }
      
      if (doc.paymentStatus === 'failed') {
        logger.info('Order payment failed', {
          orderId: doc.id,
          orderNumber: doc.orderNumber,
          totalAmount: doc.totalAmount,
        })
        
        // TODO: Send payment failure notification
        // TODO: Release reserved inventory
      }
      
      if (doc.paymentStatus === 'refunded') {
        logger.info('Order refunded', {
          orderId: doc.id,
          orderNumber: doc.orderNumber,
          totalAmount: doc.totalAmount,
        })
        
        // TODO: Void coupons
        // TODO: Send refund notification
        // TODO: Update statistics
      }
      
      if (doc.paymentStatus === 'expired') {
        logger.info('Order expired', {
          orderId: doc.id,
          orderNumber: doc.orderNumber,
          totalAmount: doc.totalAmount,
        })
        
        // TODO: Release reserved inventory
        // TODO: Send expiration notification
      }
    }

    return doc
  } catch (error) {
    logger.error('Error in order afterChange hook', {
      error: error instanceof Error ? error.message : 'Unknown error',
      orderId: doc.id,
      operation,
    })
    // Don't throw error here as it would prevent the change from being saved
  }
}

import { FieldHook } from 'payload/types'
import { Deal } from '@/payload-types'

/**
 * Validates deal data based on pricing type
 * Ensures data integrity and prevents invalid configurations
 */
export const validateDealData: FieldHook = ({ data, operation }) => {
  if (operation === 'create' || operation === 'update') {
    const errors: string[] = []

    // Validate pricing type specific fields
    if (data.pricingType === 'fixed_price') {
      if (!data.originalPrice || data.originalPrice <= 0) {
        errors.push('Original price is required for fixed price deals')
      }
      if (!data.discountPrice || data.discountPrice <= 0) {
        errors.push('Discount price is required for fixed price deals')
      }
      if (data.originalPrice && data.discountPrice && data.discountPrice >= data.originalPrice) {
        errors.push('Discount price must be less than original price')
      }
    }

    if (data.pricingType === 'percentage_discount') {
      if (!data.discountPercentage || data.discountPercentage <= 0 || data.discountPercentage > 100) {
        errors.push('Discount percentage must be between 1 and 100')
      }
      if (data.maxDiscountAmount && data.maxDiscountAmount <= 0) {
        errors.push('Max discount amount must be greater than 0')
      }
    }

    if (data.pricingType === 'fixed_discount') {
      if (!data.discountAmount || data.discountAmount <= 0) {
        errors.push('Discount amount is required for fixed discount deals')
      }
    }

    // Validate minimum order requirements
    if (data.minimumOrderAmount && data.minimumOrderAmount < 0) {
      errors.push('Minimum order amount cannot be negative')
    }

    if (data.minimumOrderItems && data.minimumOrderItems < 1) {
      errors.push('Minimum order items must be at least 1')
    }

    // Validate date range
    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate)
      const endDate = new Date(data.endDate)
      
      if (startDate >= endDate) {
        errors.push('End date must be after start date')
      }

      // Check if deal is not too far in the future (max 1 year)
      const maxFutureDate = new Date()
      maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1)
      
      if (startDate > maxFutureDate) {
        errors.push('Deal cannot start more than 1 year in the future')
      }
    }

    // Validate inventory
    if (data.maxCoupons && data.maxCoupons < 1) {
      errors.push('Max coupons must be at least 1')
    }

    if (data.soldCoupons && data.soldCoupons < 0) {
      errors.push('Sold coupons cannot be negative')
    }

    if (data.maxCoupons && data.soldCoupons && data.soldCoupons > data.maxCoupons) {
      errors.push('Sold coupons cannot exceed max coupons')
    }

    // Validate currency
    if (data.currency && data.currency.length !== 3) {
      errors.push('Currency must be a 3-letter code')
    }

    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(', ')}`)
    }
  }

  return data
}

/**
 * Calculates deal pricing based on order amount
 * Server-side validation to prevent client manipulation
 */
export function calculateDealPrice(deal: Deal, orderAmount: number): {
  isValid: boolean
  finalPrice: number
  discountApplied: number
  savings: number
  errorMessage?: string
} {
  // Validate minimum order requirement
  if (orderAmount < (deal.minimumOrderAmount || 0)) {
    return {
      isValid: false,
      finalPrice: orderAmount,
      discountApplied: 0,
      savings: 0,
      errorMessage: `Minimum order amount of ${deal.currency} ${(deal.minimumOrderAmount || 0).toLocaleString()} required`,
    }
  }

  // Validate minimum order items (if applicable)
  if (deal.minimumOrderItems && deal.minimumOrderItems > 1) {
    // This would need to be passed from the order context
    // For now, we'll assume it's validated elsewhere
  }

  let discountApplied = 0
  let finalPrice = orderAmount

  try {
    switch (deal.pricingType) {
      case 'fixed_price':
        if (!deal.discountPrice) {
          throw new Error('Discount price not set for fixed price deal')
        }
        finalPrice = deal.discountPrice
        discountApplied = Math.max(0, orderAmount - deal.discountPrice)
        break

      case 'percentage_discount':
        if (!deal.discountPercentage) {
          throw new Error('Discount percentage not set for percentage discount deal')
        }
        discountApplied = orderAmount * (deal.discountPercentage / 100)
        
        // Apply discount cap if set
        if (deal.maxDiscountAmount && discountApplied > deal.maxDiscountAmount) {
          discountApplied = deal.maxDiscountAmount
        }
        
        finalPrice = Math.max(0, orderAmount - discountApplied)
        break

      case 'fixed_discount':
        if (!deal.discountAmount) {
          throw new Error('Discount amount not set for fixed discount deal')
        }
        discountApplied = deal.discountAmount
        finalPrice = Math.max(0, orderAmount - discountApplied)
        break

      default:
        throw new Error(`Invalid pricing type: ${deal.pricingType}`)
    }

    return {
      isValid: true,
      finalPrice: Math.round(finalPrice * 100) / 100, // Round to 2 decimal places
      discountApplied: Math.round(discountApplied * 100) / 100,
      savings: Math.round(discountApplied * 100) / 100,
    }
  } catch (error) {
    return {
      isValid: false,
      finalPrice: orderAmount,
      discountApplied: 0,
      savings: 0,
      errorMessage: error instanceof Error ? error.message : 'Unknown pricing error',
    }
  }
}

/**
 * Validates if a deal is currently active
 * Server-side validation to prevent expired deal purchases
 */
export function isDealActive(deal: Deal): boolean {
  const now = new Date()
  const startDate = new Date(deal.startDate)
  const endDate = new Date(deal.endDate)

  return (
    deal.status === 'active' &&
    deal.isVisible === true &&
    deal.isActive === true &&
    startDate <= now &&
    endDate > now
  )
}

/**
 * Validates if a deal has available inventory
 * Prevents overselling
 */
export function isDealAvailable(deal: Deal): boolean {
  if (!deal.isInventoryCapped) {
    return true
  }

  if (!deal.maxCoupons) {
    return true
  }

  return (deal.soldCoupons || 0) < deal.maxCoupons
}

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { calculateDealPrice, isDealActive, isDealAvailable } from '../validation'
import { TestDataFactory, TestAssertions } from '@/utilities/testing'

describe('Deal Validation', () => {
  let mockDeal: any

  beforeEach(() => {
    mockDeal = TestDataFactory.createDeal()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('calculateDealPrice', () => {
    it('should calculate fixed price deal correctly', () => {
      const deal = { ...mockDeal, pricingType: 'fixed_price', originalPrice: 100000, discountPrice: 50000 }
      const orderAmount = 100000

      const result = calculateDealPrice(deal, orderAmount)

      expect(result.isValid).toBe(true)
      expect(result.finalPrice).toBe(50000)
      expect(result.discountApplied).toBe(50000)
      expect(result.savings).toBe(50000)
    })

    it('should calculate percentage discount deal correctly', () => {
      const deal = { 
        ...mockDeal, 
        pricingType: 'percentage_discount', 
        discountPercentage: 20, 
        minimumOrderAmount: 100000 
      }
      const orderAmount = 150000

      const result = calculateDealPrice(deal, orderAmount)

      expect(result.isValid).toBe(true)
      expect(result.finalPrice).toBe(120000)
      expect(result.discountApplied).toBe(30000)
      expect(result.savings).toBe(30000)
    })

    it('should apply discount cap for percentage discount', () => {
      const deal = { 
        ...mockDeal, 
        pricingType: 'percentage_discount', 
        discountPercentage: 50, 
        maxDiscountAmount: 50000,
        minimumOrderAmount: 100000 
      }
      const orderAmount = 200000

      const result = calculateDealPrice(deal, orderAmount)

      expect(result.isValid).toBe(true)
      expect(result.finalPrice).toBe(150000)
      expect(result.discountApplied).toBe(50000) // Capped at maxDiscountAmount
      expect(result.savings).toBe(50000)
    })

    it('should calculate fixed discount deal correctly', () => {
      const deal = { 
        ...mockDeal, 
        pricingType: 'fixed_discount', 
        discountAmount: 50000, 
        minimumOrderAmount: 100000 
      }
      const orderAmount = 150000

      const result = calculateDealPrice(deal, orderAmount)

      expect(result.isValid).toBe(true)
      expect(result.finalPrice).toBe(100000)
      expect(result.discountApplied).toBe(50000)
      expect(result.savings).toBe(50000)
    })

    it('should reject order below minimum amount', () => {
      const deal = { 
        ...mockDeal, 
        pricingType: 'fixed_discount', 
        discountAmount: 50000, 
        minimumOrderAmount: 100000 
      }
      const orderAmount = 50000

      const result = calculateDealPrice(deal, orderAmount)

      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toContain('Minimum order amount')
    })

    it('should handle invalid pricing type', () => {
      const deal = { ...mockDeal, pricingType: 'invalid_type' }
      const orderAmount = 100000

      const result = calculateDealPrice(deal, orderAmount)

      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toContain('Invalid pricing type')
    })

    it('should ensure final price is never negative', () => {
      const deal = { 
        ...mockDeal, 
        pricingType: 'fixed_discount', 
        discountAmount: 200000, 
        minimumOrderAmount: 100000 
      }
      const orderAmount = 100000

      const result = calculateDealPrice(deal, orderAmount)

      expect(result.isValid).toBe(true)
      expect(result.finalPrice).toBe(0) // Should not go negative
    })
  })

  describe('isDealActive', () => {
    it('should return true for active deal', () => {
      const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
      const deal = { ...mockDeal, status: 'active', isVisible: true, isActive: true, startDate, endDate }

      const result = isDealActive(deal)

      expect(result).toBe(true)
    })

    it('should return false for draft deal', () => {
      const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
      const deal = { ...mockDeal, status: 'draft', isVisible: true, isActive: true, startDate, endDate }

      const result = isDealActive(deal)

      expect(result).toBe(false)
    })

    it('should return false for invisible deal', () => {
      const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
      const deal = { ...mockDeal, status: 'active', isVisible: false, isActive: true, startDate, endDate }

      const result = isDealActive(deal)

      expect(result).toBe(false)
    })

    it('should return false for inactive deal', () => {
      const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
      const deal = { ...mockDeal, status: 'active', isVisible: true, isActive: false, startDate, endDate }

      const result = isDealActive(deal)

      expect(result).toBe(false)
    })

    it('should return false for expired deal', () => {
      const startDate = new Date(Date.now() - 48 * 60 * 60 * 1000) // 2 days ago
      const endDate = new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      const deal = { ...mockDeal, status: 'active', isVisible: true, isActive: true, startDate, endDate }

      const result = isDealActive(deal)

      expect(result).toBe(false)
    })

    it('should return false for future deal', () => {
      const startDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
      const endDate = new Date(Date.now() + 48 * 60 * 60 * 1000) // Day after tomorrow
      const deal = { ...mockDeal, status: 'active', isVisible: true, isActive: true, startDate, endDate }

      const result = isDealActive(deal)

      expect(result).toBe(false)
    })
  })

  describe('isDealAvailable', () => {
    it('should return true for unlimited inventory deal', () => {
      const deal = { ...mockDeal, isInventoryCapped: false }

      const result = isDealAvailable(deal)

      expect(result).toBe(true)
    })

    it('should return true for deal with available inventory', () => {
      const deal = { 
        ...mockDeal, 
        isInventoryCapped: true, 
        maxCoupons: 100, 
        soldCoupons: 50 
      }

      const result = isDealAvailable(deal)

      expect(result).toBe(true)
    })

    it('should return false for sold out deal', () => {
      const deal = { 
        ...mockDeal, 
        isInventoryCapped: true, 
        maxCoupons: 100, 
        soldCoupons: 100 
      }

      const result = isDealAvailable(deal)

      expect(result).toBe(false)
    })

    it('should return true for deal without maxCoupons set', () => {
      const deal = { 
        ...mockDeal, 
        isInventoryCapped: true, 
        maxCoupons: null, 
        soldCoupons: 50 
      }

      const result = isDealAvailable(deal)

      expect(result).toBe(true)
    })
  })
})

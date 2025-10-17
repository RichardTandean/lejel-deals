import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { PayloadRequest } from 'payload/types'
import { logger } from './logger'

/**
 * Testing utilities and helpers
 * Provides comprehensive testing framework for the application
 */

/**
 * Test data factories
 * Creates consistent test data for different scenarios
 */
export class TestDataFactory {
  /**
   * Creates a test deal
   */
  static createDeal(overrides: any = {}): any {
    return {
      title: 'Test Deal',
      slug: 'test-deal',
      description: 'This is a test deal description',
      shortDescription: 'Test deal short description',
      pricingType: 'fixed_price',
      originalPrice: 100000,
      discountPrice: 50000,
      minimumOrderAmount: 0,
      minimumOrderItems: 1,
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
      timezone: 'Asia/Jakarta',
      status: 'draft',
      isVisible: false,
      isActive: false,
      merchant: 'test-merchant-id',
      category: 'test-category-id',
      termsAndConditions: 'Test terms and conditions',
      highlights: ['Test highlight 1', 'Test highlight 2'],
      currency: 'IDR',
      discountDisplay: '50% OFF',
      discountDescription: '50% off test deal',
      ...overrides,
    }
  }

  /**
   * Creates a test order
   */
  static createOrder(overrides: any = {}): any {
    return {
      orderNumber: 'LD-TEST-001',
      customer: 'test-customer-id',
      deal: 'test-deal-id',
      quantity: 1,
      orderAmount: 100000,
      totalAmount: 50000,
      paymentStatus: 'pending',
      paymentMethod: 'credit_card',
      customerEmail: 'test@example.com',
      customerPhone: '+6281234567890',
      customerName: 'Test Customer',
      ...overrides,
    }
  }

  /**
   * Creates a test customer
   */
  static createCustomer(overrides: any = {}): any {
    return {
      email: 'test@example.com',
      phone: '+6281234567890',
      name: 'Test Customer',
      whatsappNumber: '+6281234567890',
      isSubscribedToNotifications: true,
      notificationPreferences: {
        email: true,
        whatsapp: true,
        sms: false,
      },
      ...overrides,
    }
  }

  /**
   * Creates a test merchant
   */
  static createMerchant(overrides: any = {}): any {
    return {
      businessName: 'Test Restaurant',
      slug: 'test-restaurant',
      contactPerson: 'Test Owner',
      email: 'owner@testrestaurant.com',
      phone: '+6281234567890',
      businessType: 'restaurant',
      description: 'Test restaurant description',
      address: 'Test Address',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      isActive: true,
      isVerified: true,
      ...overrides,
    }
  }

  /**
   * Creates a test coupon
   */
  static createCoupon(overrides: any = {}): any {
    return {
      couponCode: 'TEST-ABC123-XYZ789',
      order: 'test-order-id',
      deal: 'test-deal-id',
      customer: 'test-customer-id',
      merchant: 'test-merchant-id',
      status: 'issued',
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isSingleUse: true,
      isTransferable: false,
      ...overrides,
    }
  }
}

/**
 * Mock utilities
 * Provides mock implementations for testing
 */
export class MockUtils {
  /**
   * Creates a mock PayloadRequest
   */
  static createMockRequest(overrides: any = {}): PayloadRequest {
    return {
      user: null,
      payload: {
        find: jest.fn(),
        findByID: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findOne: jest.fn(),
        count: jest.fn(),
        db: {
          transaction: jest.fn(),
        },
      },
      headers: {},
      query: {},
      body: {},
      params: {},
      ...overrides,
    }
  }

  /**
   * Creates a mock user
   */
  static createMockUser(overrides: any = {}): any {
    return {
      id: 'test-user-id',
      email: 'test@example.com',
      role: 'customer',
      ...overrides,
    }
  }

  /**
   * Creates a mock logger
   */
  static createMockLogger(): any {
    return {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    }
  }
}

/**
 * Test assertions
 * Provides custom assertions for testing
 */
export class TestAssertions {
  /**
   * Asserts that a deal is valid
   */
  static assertValidDeal(deal: any): void {
    expect(deal).toBeDefined()
    expect(deal.title).toBeDefined()
    expect(deal.slug).toBeDefined()
    expect(deal.pricingType).toBeDefined()
    expect(deal.startDate).toBeDefined()
    expect(deal.endDate).toBeDefined()
    expect(deal.merchant).toBeDefined()
    expect(deal.category).toBeDefined()
  }

  /**
   * Asserts that an order is valid
   */
  static assertValidOrder(order: any): void {
    expect(order).toBeDefined()
    expect(order.orderNumber).toBeDefined()
    expect(order.customer).toBeDefined()
    expect(order.deal).toBeDefined()
    expect(order.quantity).toBeGreaterThan(0)
    expect(order.totalAmount).toBeGreaterThan(0)
    expect(order.paymentStatus).toBeDefined()
  }

  /**
   * Asserts that a coupon is valid
   */
  static assertValidCoupon(coupon: any): void {
    expect(coupon).toBeDefined()
    expect(coupon.couponCode).toBeDefined()
    expect(coupon.order).toBeDefined()
    expect(coupon.deal).toBeDefined()
    expect(coupon.customer).toBeDefined()
    expect(coupon.merchant).toBeDefined()
    expect(coupon.status).toBeDefined()
  }

  /**
   * Asserts that a date is in the future
   */
  static assertFutureDate(date: Date): void {
    expect(date).toBeInstanceOf(Date)
    expect(date.getTime()).toBeGreaterThan(Date.now())
  }

  /**
   * Asserts that a date is in the past
   */
  static assertPastDate(date: Date): void {
    expect(date).toBeInstanceOf(Date)
    expect(date.getTime()).toBeLessThan(Date.now())
  }

  /**
   * Asserts that a string is a valid email
   */
  static assertValidEmail(email: string): void {
    expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  }

  /**
   * Asserts that a string is a valid phone number
   */
  static assertValidPhone(phone: string): void {
    expect(phone).toMatch(/^\+[1-9]\d{1,14}$/)
  }

  /**
   * Asserts that a number is positive
   */
  static assertPositiveNumber(number: number): void {
    expect(number).toBeGreaterThan(0)
  }

  /**
   * Asserts that a number is non-negative
   */
  static assertNonNegativeNumber(number: number): void {
    expect(number).toBeGreaterThanOrEqual(0)
  }
}

/**
 * Test helpers
 * Provides utility functions for testing
 */
export class TestHelpers {
  /**
   * Waits for a specified amount of time
   */
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Creates a test database transaction
   */
  static async withTestTransaction<T>(
    operation: (trx: any) => Promise<T>
  ): Promise<T> {
    // Mock transaction implementation
    return await operation({})
  }

  /**
   * Cleans up test data
   */
  static async cleanupTestData(collection: string, ids: string[]): Promise<void> {
    // Mock cleanup implementation
    logger.debug('Cleaning up test data', { collection, ids })
  }

  /**
   * Sets up test environment
   */
  static async setupTestEnvironment(): Promise<void> {
    // Mock setup implementation
    logger.debug('Setting up test environment')
  }

  /**
   * Tears down test environment
   */
  static async teardownTestEnvironment(): Promise<void> {
    // Mock teardown implementation
    logger.debug('Tearing down test environment')
  }
}

/**
 * Test scenarios
 * Provides common test scenarios for different use cases
 */
export class TestScenarios {
  /**
   * Creates a complete deal flow test scenario
   */
  static createDealFlowScenario(): any {
    return {
      deal: TestDataFactory.createDeal(),
      merchant: TestDataFactory.createMerchant(),
      customer: TestDataFactory.createCustomer(),
      order: TestDataFactory.createOrder(),
      coupon: TestDataFactory.createCoupon(),
    }
  }

  /**
   * Creates a payment flow test scenario
   */
  static createPaymentFlowScenario(): any {
    return {
      order: TestDataFactory.createOrder({
        paymentStatus: 'pending',
        paymentMethod: 'credit_card',
      }),
      customer: TestDataFactory.createCustomer(),
      deal: TestDataFactory.createDeal(),
    }
  }

  /**
   * Creates a redemption flow test scenario
   */
  static createRedemptionFlowScenario(): any {
    return {
      coupon: TestDataFactory.createCoupon({
        status: 'issued',
      }),
      order: TestDataFactory.createOrder({
        paymentStatus: 'paid',
      }),
      customer: TestDataFactory.createCustomer(),
      merchant: TestDataFactory.createMerchant(),
    }
  }
}

/**
 * Performance testing utilities
 */
export class PerformanceTestUtils {
  /**
   * Measures execution time of a function
   */
  static async measureExecutionTime<T>(
    operation: () => Promise<T>
  ): Promise<{ result: T; duration: number }> {
    const startTime = Date.now()
    const result = await operation()
    const duration = Date.now() - startTime
    
    return { result, duration }
  }

  /**
   * Runs a function multiple times and measures performance
   */
  static async runPerformanceTest(
    operation: () => Promise<any>,
    iterations: number = 100
  ): Promise<{ averageDuration: number; minDuration: number; maxDuration: number }> {
    const durations: number[] = []
    
    for (let i = 0; i < iterations; i++) {
      const { duration } = await this.measureExecutionTime(operation)
      durations.push(duration)
    }
    
    const averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length
    const minDuration = Math.min(...durations)
    const maxDuration = Math.max(...durations)
    
    return { averageDuration, minDuration, maxDuration }
  }
}

/**
 * Security testing utilities
 */
export class SecurityTestUtils {
  /**
   * Tests for SQL injection vulnerabilities
   */
  static getSQLInjectionTestCases(): string[] {
    return [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "' UNION SELECT * FROM users --",
      "'; INSERT INTO users VALUES ('hacker', 'password'); --",
    ]
  }

  /**
   * Tests for XSS vulnerabilities
   */
  static getXSSAttackTestCases(): string[] {
    return [
      "<script>alert('XSS')</script>",
      "javascript:alert('XSS')",
      "<img src=x onerror=alert('XSS')>",
      "<svg onload=alert('XSS')>",
    ]
  }

  /**
   * Tests for authentication bypass
   */
  static getAuthBypassTestCases(): any[] {
    return [
      { user: null, expectedAccess: false },
      { user: { role: 'customer' }, expectedAccess: false },
      { user: { role: 'admin' }, expectedAccess: true },
    ]
  }
}

// Export all utilities
export {
  TestDataFactory,
  MockUtils,
  TestAssertions,
  TestHelpers,
  TestScenarios,
  PerformanceTestUtils,
  SecurityTestUtils,
}

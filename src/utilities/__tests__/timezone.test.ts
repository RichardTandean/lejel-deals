import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { TimezoneManager, DealTimingManager, timezoneUtils } from '../timezone'

describe('Timezone Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('TimezoneManager', () => {
    describe('isValidTimezone', () => {
      it('should return true for valid timezone', () => {
        const result = TimezoneManager.isValidTimezone('Asia/Jakarta')
        expect(result).toBe(true)
      })

      it('should return true for UTC timezone', () => {
        const result = TimezoneManager.isValidTimezone('UTC')
        expect(result).toBe(true)
      })

      it('should return false for invalid timezone', () => {
        const result = TimezoneManager.isValidTimezone('Invalid/Timezone')
        expect(result).toBe(false)
      })

      it('should return false for empty string', () => {
        const result = TimezoneManager.isValidTimezone('')
        expect(result).toBe(false)
      })
    })

    describe('toTimezone', () => {
      it('should convert date to Jakarta timezone', () => {
        const date = new Date('2024-01-01T00:00:00Z') // UTC midnight
        const result = TimezoneManager.toTimezone(date, 'Asia/Jakarta')
        
        expect(result).toBeInstanceOf(Date)
        expect(result.getTime()).toBeDefined()
      })

      it('should throw error for invalid timezone', () => {
        const date = new Date()
        expect(() => {
          TimezoneManager.toTimezone(date, 'Invalid/Timezone')
        }).toThrow('Invalid timezone')
      })
    })

    describe('nowInTimezone', () => {
      it('should return current time in Jakarta timezone', () => {
        const result = TimezoneManager.nowInTimezone('Asia/Jakarta')
        
        expect(result).toBeInstanceOf(Date)
        expect(result.getTime()).toBeDefined()
      })

      it('should throw error for invalid timezone', () => {
        expect(() => {
          TimezoneManager.nowInTimezone('Invalid/Timezone')
        }).toThrow('Invalid timezone')
      })
    })

    describe('formatForTimezone', () => {
      it('should format date for Jakarta timezone', () => {
        const date = new Date('2024-01-01T00:00:00Z')
        const result = TimezoneManager.formatForTimezone(date, 'Asia/Jakarta')
        
        expect(typeof result).toBe('string')
        expect(result).toContain('2024')
      })

      it('should format date with custom options', () => {
        const date = new Date('2024-01-01T00:00:00Z')
        const options = { year: 'numeric', month: 'short', day: 'numeric' }
        const result = TimezoneManager.formatForTimezone(date, 'Asia/Jakarta', options)
        
        expect(typeof result).toBe('string')
        expect(result).toContain('2024')
      })
    })
  })

  describe('DealTimingManager', () => {
    describe('isDealActive', () => {
      it('should return true for active deal', () => {
        const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
        const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
        
        const result = DealTimingManager.isDealActive(startDate, endDate)
        
        expect(result).toBe(true)
      })

      it('should return false for expired deal', () => {
        const startDate = new Date(Date.now() - 48 * 60 * 60 * 1000) // 2 days ago
        const endDate = new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
        
        const result = DealTimingManager.isDealActive(startDate, endDate)
        
        expect(result).toBe(false)
      })

      it('should return false for future deal', () => {
        const startDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
        const endDate = new Date(Date.now() + 48 * 60 * 60 * 1000) // Day after tomorrow
        
        const result = DealTimingManager.isDealActive(startDate, endDate)
        
        expect(result).toBe(false)
      })
    })

    describe('getTimeRemaining', () => {
      it('should return time remaining for active deal', () => {
        const endDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
        
        const result = DealTimingManager.getTimeRemaining(endDate)
        
        expect(result.total).toBeGreaterThan(0)
        expect(result.days).toBeGreaterThanOrEqual(0)
        expect(result.hours).toBeGreaterThanOrEqual(0)
        expect(result.minutes).toBeGreaterThanOrEqual(0)
        expect(result.seconds).toBeGreaterThanOrEqual(0)
      })

      it('should return zero for expired deal', () => {
        const endDate = new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
        
        const result = DealTimingManager.getTimeRemaining(endDate)
        
        expect(result.total).toBe(0)
        expect(result.days).toBe(0)
        expect(result.hours).toBe(0)
        expect(result.minutes).toBe(0)
        expect(result.seconds).toBe(0)
      })
    })

    describe('isDealExpired', () => {
      it('should return true for expired deal', () => {
        const endDate = new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
        
        const result = DealTimingManager.isDealExpired(endDate)
        
        expect(result).toBe(true)
      })

      it('should return false for active deal', () => {
        const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
        
        const result = DealTimingManager.isDealExpired(endDate)
        
        expect(result).toBe(false)
      })
    })

    describe('getTimeUntilStart', () => {
      it('should return time until start for future deal', () => {
        const startDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
        
        const result = DealTimingManager.getTimeUntilStart(startDate)
        
        expect(result.total).toBeGreaterThan(0)
        expect(result.days).toBeGreaterThanOrEqual(0)
        expect(result.hours).toBeGreaterThanOrEqual(0)
        expect(result.minutes).toBeGreaterThanOrEqual(0)
        expect(result.seconds).toBeGreaterThanOrEqual(0)
      })

      it('should return zero for started deal', () => {
        const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
        
        const result = DealTimingManager.getTimeUntilStart(startDate)
        
        expect(result.total).toBe(0)
        expect(result.days).toBe(0)
        expect(result.hours).toBe(0)
        expect(result.minutes).toBe(0)
        expect(result.seconds).toBe(0)
      })
    })

    describe('formatDateRange', () => {
      it('should format date range correctly', () => {
        const startDate = new Date('2024-01-01T00:00:00Z')
        const endDate = new Date('2024-01-07T23:59:59Z')
        
        const result = DealTimingManager.formatDateRange(startDate, endDate)
        
        expect(typeof result).toBe('string')
        expect(result).toContain('2024')
      })
    })
  })

  describe('timezoneUtils', () => {
    describe('utcToJakarta', () => {
      it('should convert UTC date to Jakarta time', () => {
        const date = new Date('2024-01-01T00:00:00Z')
        const result = timezoneUtils.utcToJakarta(date)
        
        expect(result).toBeInstanceOf(Date)
      })
    })

    describe('jakartaToUTC', () => {
      it('should convert Jakarta date to UTC', () => {
        const date = new Date('2024-01-01T00:00:00+07:00')
        const result = timezoneUtils.jakartaToUTC(date)
        
        expect(result).toBeInstanceOf(Date)
      })
    })

    describe('nowJakarta', () => {
      it('should return current time in Jakarta', () => {
        const result = timezoneUtils.nowJakarta()
        
        expect(result).toBeInstanceOf(Date)
      })
    })

    describe('formatJakarta', () => {
      it('should format date for Jakarta display', () => {
        const date = new Date('2024-01-01T00:00:00Z')
        const result = timezoneUtils.formatJakarta(date)
        
        expect(typeof result).toBe('string')
      })
    })

    describe('isDealActive', () => {
      it('should check if deal is active in Jakarta time', () => {
        const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
        
        const result = timezoneUtils.isDealActive(startDate, endDate)
        
        expect(typeof result).toBe('boolean')
      })
    })

    describe('getTimeRemaining', () => {
      it('should get time remaining until deal expires', () => {
        const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
        
        const result = timezoneUtils.getTimeRemaining(endDate)
        
        expect(result.total).toBeGreaterThanOrEqual(0)
        expect(result.days).toBeGreaterThanOrEqual(0)
        expect(result.hours).toBeGreaterThanOrEqual(0)
        expect(result.minutes).toBeGreaterThanOrEqual(0)
        expect(result.seconds).toBeGreaterThanOrEqual(0)
      })
    })
  })
})

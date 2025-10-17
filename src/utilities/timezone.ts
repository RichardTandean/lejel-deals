import { logger } from './logger'

/**
 * Timezone handling utilities
 * Ensures consistent time handling across the application
 * All times are stored in UTC and displayed in Asia/Jakarta
 */

export const DEFAULT_TIMEZONE = 'Asia/Jakarta'
export const UTC_TIMEZONE = 'UTC'

/**
 * Timezone validation and conversion utilities
 */
export class TimezoneManager {
  /**
   * Validates if a timezone is valid
   */
  static isValidTimezone(timezone: string): boolean {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone })
      return true
    } catch {
      return false
    }
  }

  /**
   * Converts a date to a specific timezone
   */
  static toTimezone(date: Date, timezone: string): Date {
    if (!this.isValidTimezone(timezone)) {
      throw new Error(`Invalid timezone: ${timezone}`)
    }

    try {
      // Get the date in the target timezone
      const dateInTimezone = new Date(date.toLocaleString('en-US', { timeZone: timezone }))
      return dateInTimezone
    } catch (error) {
      logger.error('Error converting date to timezone', {
        date: date.toISOString(),
        timezone,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }

  /**
   * Converts a date from a specific timezone to UTC
   */
  static fromTimezoneToUTC(date: Date, timezone: string): Date {
    if (!this.isValidTimezone(timezone)) {
      throw new Error(`Invalid timezone: ${timezone}`)
    }

    try {
      // Create a date in the source timezone
      const utcDate = new Date(date.toLocaleString('en-US', { timeZone: UTC_TIMEZONE }))
      return utcDate
    } catch (error) {
      logger.error('Error converting date from timezone to UTC', {
        date: date.toISOString(),
        timezone,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }

  /**
   * Gets the current time in a specific timezone
   */
  static nowInTimezone(timezone: string): Date {
    if (!this.isValidTimezone(timezone)) {
      throw new Error(`Invalid timezone: ${timezone}`)
    }

    const now = new Date()
    return this.toTimezone(now, timezone)
  }

  /**
   * Gets the current time in Jakarta timezone
   */
  static nowInJakarta(): Date {
    return this.nowInTimezone(DEFAULT_TIMEZONE)
  }

  /**
   * Formats a date for display in a specific timezone
   */
  static formatForTimezone(
    date: Date,
    timezone: string,
    options: Intl.DateTimeFormatOptions = {}
  ): string {
    if (!this.isValidTimezone(timezone)) {
      throw new Error(`Invalid timezone: ${timezone}`)
    }

    try {
      return date.toLocaleString('en-US', {
        timeZone: timezone,
        ...options,
      })
    } catch (error) {
      logger.error('Error formatting date for timezone', {
        date: date.toISOString(),
        timezone,
        options,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }

  /**
   * Formats a date for display in Jakarta timezone
   */
  static formatForJakarta(
    date: Date,
    options: Intl.DateTimeFormatOptions = {}
  ): string {
    return this.formatForTimezone(date, DEFAULT_TIMEZONE, options)
  }

  /**
   * Gets timezone offset in minutes
   */
  static getTimezoneOffset(timezone: string): number {
    if (!this.isValidTimezone(timezone)) {
      throw new Error(`Invalid timezone: ${timezone}`)
    }

    try {
      const now = new Date()
      const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000))
      const targetTime = new Date(utc.toLocaleString('en-US', { timeZone: timezone }))
      const offset = (targetTime.getTime() - utc.getTime()) / 60000
      return offset
    } catch (error) {
      logger.error('Error getting timezone offset', {
        timezone,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }
}

/**
 * Deal timing utilities
 * Handles deal-specific timing logic
 */
export class DealTimingManager {
  /**
   * Checks if a deal is currently active based on Jakarta time
   */
  static isDealActive(startDate: Date, endDate: Date): boolean {
    try {
      const now = this.nowInJakarta()
      const start = this.toTimezone(startDate, DEFAULT_TIMEZONE)
      const end = this.toTimezone(endDate, DEFAULT_TIMEZONE)

      return start <= now && end > now
    } catch (error) {
      logger.error('Error checking if deal is active', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      return false
    }
  }

  /**
   * Gets the time remaining until a deal expires
   */
  static getTimeRemaining(endDate: Date): {
    total: number
    days: number
    hours: number
    minutes: number
    seconds: number
  } {
    try {
      const now = this.nowInJakarta()
      const end = this.toTimezone(endDate, DEFAULT_TIMEZONE)
      const diff = end.getTime() - now.getTime()

      if (diff <= 0) {
        return {
          total: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        }
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      return {
        total: diff,
        days,
        hours,
        minutes,
        seconds,
      }
    } catch (error) {
      logger.error('Error calculating time remaining', {
        endDate: endDate.toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      return {
        total: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      }
    }
  }

  /**
   * Checks if a deal has expired
   */
  static isDealExpired(endDate: Date): boolean {
    try {
      const now = this.nowInJakarta()
      const end = this.toTimezone(endDate, DEFAULT_TIMEZONE)
      return end <= now
    } catch (error) {
      logger.error('Error checking if deal is expired', {
        endDate: endDate.toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      return true // Assume expired if there's an error
    }
  }

  /**
   * Gets the time until a deal starts
   */
  static getTimeUntilStart(startDate: Date): {
    total: number
    days: number
    hours: number
    minutes: number
    seconds: number
  } {
    try {
      const now = this.nowInJakarta()
      const start = this.toTimezone(startDate, DEFAULT_TIMEZONE)
      const diff = start.getTime() - now.getTime()

      if (diff <= 0) {
        return {
          total: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        }
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      return {
        total: diff,
        days,
        hours,
        minutes,
        seconds,
      }
    } catch (error) {
      logger.error('Error calculating time until start', {
        startDate: startDate.toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      return {
        total: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      }
    }
  }

  /**
   * Formats a date range for display
   */
  static formatDateRange(startDate: Date, endDate: Date): string {
    try {
      const start = this.formatForJakarta(startDate, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      const end = this.formatForJakarta(endDate, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })

      return `${start} - ${end}`
    } catch (error) {
      logger.error('Error formatting date range', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      return 'Invalid date range'
    }
  }
}

/**
 * Utility functions for common timezone operations
 */
export const timezoneUtils = {
  /**
   * Converts UTC date to Jakarta time
   */
  utcToJakarta: (date: Date): Date => {
    return TimezoneManager.toTimezone(date, DEFAULT_TIMEZONE)
  },

  /**
   * Converts Jakarta date to UTC
   */
  jakartaToUTC: (date: Date): Date => {
    return TimezoneManager.fromTimezoneToUTC(date, DEFAULT_TIMEZONE)
  },

  /**
   * Gets current time in Jakarta
   */
  nowJakarta: (): Date => {
    return TimezoneManager.nowInJakarta()
  },

  /**
   * Formats date for Jakarta display
   */
  formatJakarta: (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    return TimezoneManager.formatForJakarta(date, options)
  },

  /**
   * Checks if deal is active in Jakarta time
   */
  isDealActive: (startDate: Date, endDate: Date): boolean => {
    return DealTimingManager.isDealActive(startDate, endDate)
  },

  /**
   * Gets time remaining until deal expires
   */
  getTimeRemaining: (endDate: Date) => {
    return DealTimingManager.getTimeRemaining(endDate)
  },
}

// Export the main classes
export { TimezoneManager, DealTimingManager }

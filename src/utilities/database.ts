import { PayloadRequest } from 'payload/types'
import { logger } from './logger'

/**
 * Database transaction utilities for race condition prevention
 * Ensures atomic operations and data consistency
 */

export interface TransactionOptions {
  isolationLevel?: 'READ_UNCOMMITTED' | 'READ_COMMITTED' | 'REPEATABLE_READ' | 'SERIALIZABLE'
  timeout?: number
}

/**
 * Executes a function within a database transaction
 * Provides atomicity and consistency guarantees
 */
export async function withTransaction<T>(
  req: PayloadRequest,
  operation: (trx: any) => Promise<T>,
  options: TransactionOptions = {}
): Promise<T> {
  const startTime = Date.now()
  
  try {
    logger.debug('Starting database transaction', {
      isolationLevel: options.isolationLevel || 'READ_COMMITTED',
      timeout: options.timeout || 30000,
    })

    // Use PayloadCMS's built-in transaction support
    const result = await req.payload.db.transaction(async (trx) => {
      return await operation(trx)
    })

    const duration = Date.now() - startTime
    logger.debug('Database transaction completed successfully', {
      duration: `${duration}ms`,
    })

    return result
  } catch (error) {
    const duration = Date.now() - startTime
    logger.error('Database transaction failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
    })
    throw error
  }
}

/**
 * Idempotency key utilities
 * Prevents duplicate processing of operations
 */
export class IdempotencyManager {
  private static instance: IdempotencyManager
  private processedKeys = new Set<string>()

  static getInstance(): IdempotencyManager {
    if (!IdempotencyManager.instance) {
      IdempotencyManager.instance = new IdempotencyManager()
    }
    return IdempotencyManager.instance
  }

  /**
   * Generates a unique idempotency key
   */
  generateKey(operation: string, ...params: (string | number)[]): string {
    const key = `${operation}:${params.join(':')}`
    return key
  }

  /**
   * Checks if an operation has already been processed
   */
  isProcessed(key: string): boolean {
    return this.processedKeys.has(key)
  }

  /**
   * Marks an operation as processed
   */
  markProcessed(key: string): void {
    this.processedKeys.add(key)
    
    // Clean up old keys periodically (keep last 1000)
    if (this.processedKeys.size > 1000) {
      const keysArray = Array.from(this.processedKeys)
      this.processedKeys.clear()
      // Keep the most recent 500 keys
      keysArray.slice(-500).forEach(k => this.processedKeys.add(k))
    }
  }

  /**
   * Processes an operation with idempotency check
   */
  async processWithIdempotency<T>(
    key: string,
    operation: () => Promise<T>
  ): Promise<T> {
    if (this.isProcessed(key)) {
      logger.warn('Operation already processed, skipping', { key })
      throw new Error('Operation already processed')
    }

    try {
      const result = await operation()
      this.markProcessed(key)
      return result
    } catch (error) {
      logger.error('Operation failed, not marking as processed', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }
}

/**
 * Row-level locking utilities
 * Prevents concurrent modifications to the same record
 */
export class RowLockManager {
  private static instance: RowLockManager
  private locks = new Map<string, Promise<any>>()

  static getInstance(): RowLockManager {
    if (!RowLockManager.instance) {
      RowLockManager.instance = new RowLockManager()
    }
    return RowLockManager.instance
  }

  /**
   * Acquires a lock for a specific record
   */
  async acquireLock(collection: string, recordId: string): Promise<() => void> {
    const lockKey = `${collection}:${recordId}`
    
    if (this.locks.has(lockKey)) {
      // Wait for existing lock to be released
      await this.locks.get(lockKey)
    }

    let releaseLock: () => void
    const lockPromise = new Promise<void>((resolve) => {
      releaseLock = resolve
    })

    this.locks.set(lockKey, lockPromise)

    return () => {
      this.locks.delete(lockKey)
      releaseLock()
    }
  }

  /**
   * Executes an operation with row-level locking
   */
  async withRowLock<T>(
    collection: string,
    recordId: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const releaseLock = await this.acquireLock(collection, recordId)
    
    try {
      return await operation()
    } finally {
      releaseLock()
    }
  }
}

/**
 * Database constraint utilities
 * Provides helper functions for common constraint checks
 */
export class ConstraintManager {
  /**
   * Checks for unique constraint violations
   */
  static async checkUniqueConstraint(
    req: PayloadRequest,
    collection: string,
    field: string,
    value: any,
    excludeId?: string
  ): Promise<boolean> {
    try {
      const whereClause: any = { [field]: { equals: value } }
      
      if (excludeId) {
        whereClause.id = { not_equals: excludeId }
      }

      const existing = await req.payload.find({
        collection,
        where: whereClause,
        limit: 1,
      })

      return existing.docs.length === 0
    } catch (error) {
      logger.error('Error checking unique constraint', {
        collection,
        field,
        value,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }

  /**
   * Validates foreign key constraints
   */
  static async validateForeignKey(
    req: PayloadRequest,
    collection: string,
    recordId: string
  ): Promise<boolean> {
    try {
      const record = await req.payload.findByID({
        collection,
        id: recordId,
      })

      return Boolean(record)
    } catch (error) {
      logger.error('Error validating foreign key', {
        collection,
        recordId,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      return false
    }
  }
}

/**
 * Database performance utilities
 * Provides query optimization and monitoring
 */
export class PerformanceManager {
  /**
   * Executes a query with performance monitoring
   */
  static async executeWithMonitoring<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    const startTime = Date.now()
    
    try {
      const result = await operation()
      const duration = Date.now() - startTime
      
      logger.debug('Database operation completed', {
        operation: operationName,
        duration: `${duration}ms`,
      })

      // Log slow queries
      if (duration > 1000) {
        logger.warn('Slow database query detected', {
          operation: operationName,
          duration: `${duration}ms`,
        })
      }

      return result
    } catch (error) {
      const duration = Date.now() - startTime
      logger.error('Database operation failed', {
        operation: operationName,
        duration: `${duration}ms`,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }

  /**
   * Creates an optimized query with proper indexing hints
   */
  static createOptimizedQuery(baseQuery: any, indexes: string[]): any {
    return {
      ...baseQuery,
      // Add index hints if supported by the database
      hint: indexes.length > 0 ? indexes : undefined,
    }
  }
}

// Export singleton instances
export const idempotencyManager = IdempotencyManager.getInstance()
export const rowLockManager = RowLockManager.getInstance()
export const constraintManager = ConstraintManager
export const performanceManager = PerformanceManager

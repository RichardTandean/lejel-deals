import { Access, FieldAccess } from 'payload/types'
import { User } from '@/payload-types'
import { logger } from '@/utilities/logger'

/**
 * Access control utilities
 * Provides role-based access control for collections and fields
 */

/**
 * User roles
 */
export enum UserRole {
  ADMIN = 'admin',
  MERCHANT = 'merchant',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

/**
 * Permission levels
 */
export enum Permission {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  PUBLISH = 'publish',
  UNPUBLISH = 'unpublish',
}

/**
 * Resource types
 */
export enum Resource {
  DEALS = 'deals',
  ORDERS = 'orders',
  COUPONS = 'coupons',
  REDEMPTIONS = 'redemptions',
  CUSTOMERS = 'customers',
  MERCHANTS = 'merchants',
  STAFF = 'staff',
  MEDIA = 'media',
  CATEGORIES = 'categories',
}

/**
 * Access control matrix
 * Defines what each role can do with each resource
 */
const ACCESS_MATRIX: Record<UserRole, Record<Resource, Permission[]>> = {
  [UserRole.ADMIN]: {
    [Resource.DEALS]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE, Permission.PUBLISH, Permission.UNPUBLISH],
    [Resource.ORDERS]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE],
    [Resource.COUPONS]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE],
    [Resource.REDEMPTIONS]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE],
    [Resource.CUSTOMERS]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE],
    [Resource.MERCHANTS]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE],
    [Resource.STAFF]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE],
    [Resource.MEDIA]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE],
    [Resource.CATEGORIES]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE],
  },
  [UserRole.MERCHANT]: {
    [Resource.DEALS]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.PUBLISH, Permission.UNPUBLISH],
    [Resource.ORDERS]: [Permission.READ],
    [Resource.COUPONS]: [Permission.READ],
    [Resource.REDEMPTIONS]: [Permission.READ, Permission.CREATE, Permission.UPDATE],
    [Resource.CUSTOMERS]: [Permission.READ],
    [Resource.MERCHANTS]: [Permission.READ, Permission.UPDATE],
    [Resource.STAFF]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE],
    [Resource.MEDIA]: [Permission.READ, Permission.CREATE, Permission.UPDATE],
    [Resource.CATEGORIES]: [Permission.READ],
  },
  [UserRole.STAFF]: {
    [Resource.DEALS]: [Permission.READ],
    [Resource.ORDERS]: [Permission.READ],
    [Resource.COUPONS]: [Permission.READ],
    [Resource.REDEMPTIONS]: [Permission.READ, Permission.CREATE, Permission.UPDATE],
    [Resource.CUSTOMERS]: [Permission.READ],
    [Resource.MERCHANTS]: [Permission.READ],
    [Resource.STAFF]: [Permission.READ],
    [Resource.MEDIA]: [Permission.READ],
    [Resource.CATEGORIES]: [Permission.READ],
  },
  [UserRole.CUSTOMER]: {
    [Resource.DEALS]: [Permission.READ],
    [Resource.ORDERS]: [Permission.READ, Permission.CREATE],
    [Resource.COUPONS]: [Permission.READ],
    [Resource.REDEMPTIONS]: [],
    [Resource.CUSTOMERS]: [Permission.READ, Permission.UPDATE],
    [Resource.MERCHANTS]: [Permission.READ],
    [Resource.STAFF]: [],
    [Resource.MEDIA]: [Permission.READ],
    [Resource.CATEGORIES]: [Permission.READ],
  },
}

/**
 * Checks if a user has permission for a resource
 */
export function hasPermission(
  user: User | null,
  resource: Resource,
  permission: Permission
): boolean {
  if (!user) {
    // Public access - only read access to certain resources
    const publicResources = [Resource.DEALS, Resource.MERCHANTS, Resource.CATEGORIES, Resource.MEDIA]
    return publicResources.includes(resource) && permission === Permission.READ
  }

  const userRole = user.role as UserRole
  const permissions = ACCESS_MATRIX[userRole]?.[resource] || []
  
  return permissions.includes(permission)
}

/**
 * Checks if a user can access a specific record
 */
export function canAccessRecord(
  user: User | null,
  resource: Resource,
  record: any,
  permission: Permission
): boolean {
  if (!hasPermission(user, resource, permission)) {
    return false
  }

  // Additional record-level access checks
  if (user && user.role === UserRole.MERCHANT) {
    // Merchants can only access their own records
    if (resource === Resource.DEALS && record.merchant !== user.id) {
      return false
    }
    if (resource === Resource.ORDERS && record.merchant !== user.id) {
      return false
    }
    if (resource === Resource.COUPONS && record.merchant !== user.id) {
      return false
    }
    if (resource === Resource.REDEMPTIONS && record.merchant !== user.id) {
      return false
    }
  }

  if (user && user.role === UserRole.CUSTOMER) {
    // Customers can only access their own records
    if (resource === Resource.ORDERS && record.customer !== user.id) {
      return false
    }
    if (resource === Resource.COUPONS && record.customer !== user.id) {
      return false
    }
  }

  return true
}

/**
 * Logs access attempts for security monitoring
 */
function logAccessAttempt(
  user: User | null,
  resource: Resource,
  permission: Permission,
  allowed: boolean,
  recordId?: string
): void {
  logger.info('Access attempt', {
    userId: user?.id,
    userRole: user?.role,
    resource,
    permission,
    allowed,
    recordId,
    timestamp: new Date().toISOString(),
    type: 'security',
    category: 'access_control',
  })
}

/**
 * Basic access control functions
 */

// Admin access
export const isAdmin: Access = ({ req: { user } }) => {
  const allowed = hasPermission(user, Resource.DEALS, Permission.READ)
  logAccessAttempt(user, Resource.DEALS, Permission.READ, allowed)
  return allowed
}

// Authenticated user access
export const isAuthenticated: Access = ({ req: { user } }) => {
  const allowed = Boolean(user)
  logAccessAttempt(user, Resource.DEALS, Permission.READ, allowed)
  return allowed
}

// Public access (read-only)
export const anyone: Access = ({ req: { user } }) => {
  const allowed = hasPermission(user, Resource.DEALS, Permission.READ)
  logAccessAttempt(user, Resource.DEALS, Permission.READ, allowed)
  return allowed
}

// Merchant access
export const isMerchant: Access = ({ req: { user } }) => {
  const allowed = user?.role === UserRole.MERCHANT
  logAccessAttempt(user, Resource.DEALS, Permission.READ, allowed)
  return allowed
}

// Staff access
export const isStaff: Access = ({ req: { user } }) => {
  const allowed = user?.role === UserRole.STAFF || user?.role === UserRole.MERCHANT
  logAccessAttempt(user, Resource.DEALS, Permission.READ, allowed)
  return allowed
}

// Customer access
export const isCustomer: Access = ({ req: { user } }) => {
  const allowed = user?.role === UserRole.CUSTOMER
  logAccessAttempt(user, Resource.DEALS, Permission.READ, allowed)
  return allowed
}

/**
 * Field-level access control
 */

// Admin only fields
export const adminOnly: FieldAccess = ({ req: { user } }) => {
  return user?.role === UserRole.ADMIN
}

// Merchant and admin fields
export const merchantAndAdmin: FieldAccess = ({ req: { user } }) => {
  return user?.role === UserRole.ADMIN || user?.role === UserRole.MERCHANT
}

// Staff and above fields
export const staffAndAbove: FieldAccess = ({ req: { user } }) => {
  return user?.role === UserRole.ADMIN || user?.role === UserRole.MERCHANT || user?.role === UserRole.STAFF
}

// Customer and above fields
export const customerAndAbove: FieldAccess = ({ req: { user } }) => {
  return Boolean(user)
}

// Read-only fields
export const readOnly: FieldAccess = () => {
  return false
}

/**
 * Collection-specific access control
 */

// Deals collection access
export const dealsAccess = {
  read: anyone,
  create: isAdmin,
  update: isAdmin,
  delete: isAdmin,
}

// Orders collection access
export const ordersAccess = {
  read: isAuthenticated,
  create: isAuthenticated,
  update: isAdmin,
  delete: isAdmin,
}

// Coupons collection access
export const couponsAccess = {
  read: isAuthenticated,
  create: isAdmin,
  update: isAdmin,
  delete: isAdmin,
}

// Redemptions collection access
export const redemptionsAccess = {
  read: staffAndAbove,
  create: staffAndAbove,
  update: staffAndAbove,
  delete: isAdmin,
}

// Customers collection access
export const customersAccess = {
  read: isAuthenticated,
  create: isAuthenticated,
  update: isAuthenticated,
  delete: isAdmin,
}

// Merchants collection access
export const merchantsAccess = {
  read: anyone,
  create: isAdmin,
  update: merchantAndAdmin,
  delete: isAdmin,
}

// Staff collection access
export const staffAccess = {
  read: merchantAndAdmin,
  create: merchantAndAdmin,
  update: merchantAndAdmin,
  delete: isAdmin,
}

// Media collection access
export const mediaAccess = {
  read: anyone,
  create: isAuthenticated,
  update: isAuthenticated,
  delete: isAdmin,
}

// Categories collection access
export const categoriesAccess = {
  read: anyone,
  create: isAdmin,
  update: isAdmin,
  delete: isAdmin,
}

/**
 * Utility functions for access control
 */

// Check if user can perform action
export function canPerformAction(
  user: User | null,
  resource: Resource,
  permission: Permission,
  record?: any
): boolean {
  const hasBasicPermission = hasPermission(user, resource, permission)
  
  if (!hasBasicPermission) {
    return false
  }
  
  if (record) {
    return canAccessRecord(user, resource, record, permission)
  }
  
  return true
}

// Get user's accessible resources
export function getAccessibleResources(user: User | null): Resource[] {
  if (!user) {
    return [Resource.DEALS, Resource.MERCHANTS, Resource.CATEGORIES, Resource.MEDIA]
  }
  
  const userRole = user.role as UserRole
  const permissions = ACCESS_MATRIX[userRole] || {}
  
  return Object.keys(permissions) as Resource[]
}

// Get user's permissions for a resource
export function getResourcePermissions(user: User | null, resource: Resource): Permission[] {
  if (!user) {
    const publicResources = [Resource.DEALS, Resource.MERCHANTS, Resource.CATEGORIES, Resource.MEDIA]
    return publicResources.includes(resource) ? [Permission.READ] : []
  }
  
  const userRole = user.role as UserRole
  return ACCESS_MATRIX[userRole]?.[resource] || []
}

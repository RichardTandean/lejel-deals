import { Field } from 'payload/types'

/**
 * Role-based field visibility utilities
 * Controls which fields are visible to different user types
 */

export type UserRole = 'admin' | 'merchant' | 'staff' | 'customer'

export interface FieldVisibilityConfig {
  admin?: boolean
  merchant?: boolean
  staff?: boolean
  customer?: boolean
}

/**
 * Creates a field with role-based visibility
 */
export const createRoleBasedField = (
  field: Field,
  visibility: FieldVisibilityConfig
): Field => {
  return {
    ...field,
    admin: {
      ...field.admin,
      condition: (data, siblingData, { user }) => {
        // Check if user has permission to see this field
        const userRole = user?.role as UserRole || 'customer'
        
        // If visibility is not defined for this role, default to false
        if (visibility[userRole] === undefined) {
          return false
        }
        
        return visibility[userRole] === true
      },
    },
  }
}

/**
 * Field visibility presets for common use cases
 */
export const fieldVisibility = {
  // Admin only fields
  adminOnly: {
    admin: true,
    merchant: false,
    staff: false,
    customer: false,
  },
  
  // Admin and merchant fields
  adminMerchant: {
    admin: true,
    merchant: true,
    staff: false,
    customer: false,
  },
  
  // Admin, merchant, and staff fields
  adminMerchantStaff: {
    admin: true,
    merchant: true,
    staff: true,
    customer: false,
  },
  
  // All roles can see
  allRoles: {
    admin: true,
    merchant: true,
    staff: true,
    customer: true,
  },
  
  // Customer and merchant fields
  customerMerchant: {
    admin: true,
    merchant: true,
    staff: false,
    customer: true,
  },
  
  // Read-only for customers, editable for others
  customerReadOnly: {
    admin: true,
    merchant: true,
    staff: true,
    customer: true,
  },
}

/**
 * Collection-specific field visibility configurations
 */
export const collectionFieldVisibility = {
  // Deals collection
  deals: {
    // Admin and merchant can edit all fields
    title: fieldVisibility.adminMerchant,
    description: fieldVisibility.adminMerchant,
    pricingType: fieldVisibility.adminMerchant,
    originalPrice: fieldVisibility.adminMerchant,
    discountPrice: fieldVisibility.adminMerchant,
    discountPercentage: fieldVisibility.adminMerchant,
    discountAmount: fieldVisibility.adminMerchant,
    minimumOrderAmount: fieldVisibility.adminMerchant,
    minimumOrderItems: fieldVisibility.adminMerchant,
    maxDiscountAmount: fieldVisibility.adminMerchant,
    maxCoupons: fieldVisibility.adminMerchant,
    soldCoupons: fieldVisibility.adminMerchant,
    isInventoryCapped: fieldVisibility.adminMerchant,
    startDate: fieldVisibility.adminMerchant,
    endDate: fieldVisibility.adminMerchant,
    isActive: fieldVisibility.adminMerchant,
    isVerified: fieldVisibility.adminOnly,
    merchant: fieldVisibility.adminMerchant,
    category: fieldVisibility.adminMerchant,
    images: fieldVisibility.adminMerchant,
    terms: fieldVisibility.adminMerchant,
    seo: fieldVisibility.adminMerchant,
    
    // Customers can only see public fields
    slug: fieldVisibility.allRoles,
    status: fieldVisibility.allRoles,
  },
  
  // Merchants collection
  merchants: {
    // Admin can edit all fields
    businessName: fieldVisibility.adminMerchant,
    slug: fieldVisibility.adminMerchant,
    contactPerson: fieldVisibility.adminMerchant,
    email: fieldVisibility.adminMerchant,
    phone: fieldVisibility.adminMerchant,
    whatsapp: fieldVisibility.adminMerchant,
    businessType: fieldVisibility.adminMerchant,
    description: fieldVisibility.adminMerchant,
    establishedYear: fieldVisibility.adminMerchant,
    address: fieldVisibility.adminMerchant,
    city: fieldVisibility.adminMerchant,
    province: fieldVisibility.adminMerchant,
    postalCode: fieldVisibility.adminMerchant,
    coordinates: fieldVisibility.adminMerchant,
    logo: fieldVisibility.adminMerchant,
    coverImage: fieldVisibility.adminMerchant,
    brandColors: fieldVisibility.adminMerchant,
    operatingHours: fieldVisibility.adminMerchant,
    isActive: fieldVisibility.adminOnly,
    isVerified: fieldVisibility.adminOnly,
    verificationDate: fieldVisibility.adminOnly,
    commissionRate: fieldVisibility.adminOnly,
    bankAccount: fieldVisibility.adminMerchant,
    
    // Public fields
    businessName: fieldVisibility.allRoles,
    description: fieldVisibility.allRoles,
    businessType: fieldVisibility.allRoles,
    address: fieldVisibility.allRoles,
    city: fieldVisibility.allRoles,
    province: fieldVisibility.allRoles,
    logo: fieldVisibility.allRoles,
    coverImage: fieldVisibility.allRoles,
    brandColors: fieldVisibility.allRoles,
    operatingHours: fieldVisibility.allRoles,
  },
  
  // Customers collection
  customers: {
    // Admin can edit all fields
    email: fieldVisibility.adminMerchant,
    phone: fieldVisibility.adminMerchant,
    name: fieldVisibility.adminMerchant,
    whatsappNumber: fieldVisibility.adminMerchant,
    isSubscribedToNotifications: fieldVisibility.adminMerchant,
    notificationPreferences: fieldVisibility.adminMerchant,
    dateOfBirth: fieldVisibility.adminMerchant,
    gender: fieldVisibility.adminMerchant,
    profilePicture: fieldVisibility.adminMerchant,
    totalOrders: fieldVisibility.adminMerchant,
    totalSpent: fieldVisibility.adminMerchant,
    lastOrderAt: fieldVisibility.adminMerchant,
    isActive: fieldVisibility.adminOnly,
    isVerified: fieldVisibility.adminOnly,
    verificationToken: fieldVisibility.adminOnly,
    verificationExpires: fieldVisibility.adminOnly,
    lastLoginAt: fieldVisibility.adminOnly,
    
    // Customers can edit their own profile
    name: fieldVisibility.customerReadOnly,
    email: fieldVisibility.customerReadOnly,
    phone: fieldVisibility.customerReadOnly,
    whatsappNumber: fieldVisibility.customerReadOnly,
    isSubscribedToNotifications: fieldVisibility.customerReadOnly,
    notificationPreferences: fieldVisibility.customerReadOnly,
    dateOfBirth: fieldVisibility.customerReadOnly,
    gender: fieldVisibility.customerReadOnly,
    profilePicture: fieldVisibility.customerReadOnly,
  },
  
  // Orders collection
  orders: {
    // Admin can edit all fields
    orderNumber: fieldVisibility.adminMerchant,
    customer: fieldVisibility.adminMerchant,
    deal: fieldVisibility.adminMerchant,
    dealSnapshot: fieldVisibility.adminMerchant,
    quantity: fieldVisibility.adminMerchant,
    orderAmount: fieldVisibility.adminMerchant,
    unitPrice: fieldVisibility.adminMerchant,
    subtotal: fieldVisibility.adminMerchant,
    tax: fieldVisibility.adminMerchant,
    totalAmount: fieldVisibility.adminMerchant,
    discountApplied: fieldVisibility.adminMerchant,
    savings: fieldVisibility.adminMerchant,
    paymentStatus: fieldVisibility.adminMerchant,
    paymentMethod: fieldVisibility.adminMerchant,
    paymentReference: fieldVisibility.adminMerchant,
    customerEmail: fieldVisibility.adminMerchant,
    customerPhone: fieldVisibility.adminMerchant,
    customerName: fieldVisibility.adminMerchant,
    paidAt: fieldVisibility.adminMerchant,
    expiresAt: fieldVisibility.adminMerchant,
    notes: fieldVisibility.adminMerchant,
    
    // Customers can view their own orders
    orderNumber: fieldVisibility.customerReadOnly,
    dealSnapshot: fieldVisibility.customerReadOnly,
    quantity: fieldVisibility.customerReadOnly,
    orderAmount: fieldVisibility.customerReadOnly,
    unitPrice: fieldVisibility.customerReadOnly,
    subtotal: fieldVisibility.customerReadOnly,
    tax: fieldVisibility.customerReadOnly,
    totalAmount: fieldVisibility.customerReadOnly,
    discountApplied: fieldVisibility.customerReadOnly,
    savings: fieldVisibility.customerReadOnly,
    paymentStatus: fieldVisibility.customerReadOnly,
    paymentMethod: fieldVisibility.customerReadOnly,
    customerEmail: fieldVisibility.customerReadOnly,
    customerPhone: fieldVisibility.customerReadOnly,
    customerName: fieldVisibility.customerReadOnly,
    paidAt: fieldVisibility.customerReadOnly,
    expiresAt: fieldVisibility.customerReadOnly,
  },
}

/**
 * Applies role-based visibility to a collection's fields
 */
export const applyFieldVisibility = (
  fields: Field[],
  collectionName: keyof typeof collectionFieldVisibility
): Field[] => {
  const visibilityConfig = collectionFieldVisibility[collectionName]
  
  return fields.map(field => {
    const fieldVisibility = visibilityConfig[field.name as keyof typeof visibilityConfig]
    
    if (fieldVisibility) {
      return createRoleBasedField(field, fieldVisibility)
    }
    
    return field
  })
}

/**
 * Gets the appropriate fields for a user role
 */
export const getFieldsForRole = (
  fields: Field[],
  userRole: UserRole
): Field[] => {
  return fields.filter(field => {
    // If field has no visibility config, show to all roles
    if (!field.admin?.condition) {
      return true
    }
    
    // Check if field should be visible for this role
    const visibility = fieldVisibility.allRoles
    return visibility[userRole] === true
  })
}

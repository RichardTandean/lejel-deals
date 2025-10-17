# Lejel Deals Platform - Database Schema

## 🗄️ Database Overview

**Database**: PostgreSQL  
**ORM**: Prisma  
**CMS**: PayloadCMS 3.60  
**Timezone**: UTC (stored), Asia/Jakarta (displayed)

## 📊 Collections Schema

### 1. Deals Collection
**Purpose**: Time-limited promotional offers

```typescript
interface Deal {
  id: string
  title: string                    // "50% Off Premium Menu"
  slug: string                    // "50-off-premium-menu"
  description: string             // Rich text description
  shortDescription: string        // Brief summary for cards
  
  // Pricing
  pricingType: PricingType        // "fixed_price" | "percentage_discount" | "fixed_discount"
  
  // Fixed Price (for fixed_price type)
  originalPrice: number           // 100000 (IDR) - original menu price
  discountPrice: number           // 50000 (IDR) - discounted price customer pays
  
  // Percentage Discount (for percentage_discount type)
  discountPercentage: number      // 20 (for 20% off)
  maxDiscountAmount: number       // 50000 (max discount cap, optional)
  
  // Fixed Discount (for fixed_discount type)
  discountAmount: number          // 100000 (fixed discount amount)
  
  // Minimum Order Requirements
  minimumOrderAmount: number      // 200000 (minimum order to get discount)
  minimumOrderItems: number      // 2 (minimum items, optional)
  
  // Calculated Fields
  savings: number                 // Calculated savings amount
  finalPrice: number             // Final price after discount
  currency: string               // "IDR"
  
  // Discount Display
  discountDisplay: string         // "50% OFF" | "Save IDR 100,000" | "Buy 1 Get 1"
  discountDescription: string     // "20% off orders above IDR 100,000"
  
  // Timing
  startDate: Date                // UTC timestamp
  endDate: Date                  // UTC timestamp
  timezone: string               // "Asia/Jakarta"
  
  // Inventory
  maxCoupons: number             // 100 (optional, null = unlimited)
  soldCoupons: number            // 45 (current sales)
  isInventoryCapped: boolean     // true if maxCoupons set
  
  // Status
  status: DealStatus             // "draft" | "active" | "expired" | "sold_out"
  isVisible: boolean             // Show in public listings
  isActive: boolean              // Quick toggle for admin
  
  // Relationships
  merchant: string               // Merchant ID
  category: string               // Category ID
  images: Media[]                // Deal images
  
  // Content
  termsAndConditions: string     // Rich text
  highlights: string[]           // ["Free parking", "Valid for 2 people"]
  
  // SEO
  metaTitle: string
  metaDescription: string
  
  // Audit
  createdAt: Date
  updatedAt: Date
  publishedAt: Date
  createdBy: string              // User ID
  updatedBy: string              // User ID
}

type DealStatus = "draft" | "active" | "expired" | "sold_out" | "cancelled"
type PricingType = "fixed_price" | "percentage_discount" | "fixed_discount"

// Pricing Type Examples:
// 1. Fixed Price: Customer pays fixed amount regardless of order value
//    - originalPrice: 200000, discountPrice: 100000
//    - Customer pays IDR 100,000 for any order
//
// 2. Percentage Discount: Percentage off total order with optional minimum
//    - discountPercentage: 20, minimumOrderAmount: 100000
//    - 20% off orders above IDR 100,000
//
// 3. Fixed Discount: Fixed amount off total order with minimum requirement
//    - discountAmount: 100000, minimumOrderAmount: 200000
//    - IDR 100,000 off orders above IDR 200,000
```

### 2. Merchants Collection
**Purpose**: Restaurant and business partners

```typescript
interface Merchant {
  id: string
  businessName: string           // "Restaurant ABC"
  slug: string                  // "restaurant-abc"
  
  // Contact Information
  contactPerson: string          // "John Doe"
  email: string                 // "contact@restaurant-abc.com"
  phone: string                 // "+6281234567890"
  whatsapp: string              // "+6281234567890"
  
  // Business Details
  businessType: string          // "restaurant" | "cafe" | "lifestyle"
  description: string           // Business description
  establishedYear: number       // 2020
  
  // Location
  address: string               // Full address
  city: string                  // "Jakarta"
  province: string              // "DKI Jakarta"
  postalCode: string            // "12345"
  coordinates: {
    lat: number
    lng: number
  }
  
  // Branding
  logo: Media                   // Business logo
  coverImage: Media             // Cover photo
  brandColors: {
    primary: string             // "#FF6B6B"
    secondary: string           // "#4ECDC4"
  }
  
  // Business Information
  operatingHours: {
    monday: { open: string, close: string, closed: boolean }
    tuesday: { open: string, close: string, closed: boolean }
    // ... other days
  }
  
  // Status
  isActive: boolean             // Active merchant
  isVerified: boolean           // Verified business
  verificationDate: Date        // When verified
  
  // Financial
  commissionRate: number        // 0.1 (10% - future use)
  bankAccount: {
    bankName: string
    accountNumber: string
    accountHolder: string
  }
  
  // Relationships
  deals: Deal[]                 // Merchant's deals
  staff: Staff[]                // Merchant staff
  
  // Audit
  createdAt: Date
  updatedAt: Date
  createdBy: string
}
```

### 3. Orders Collection
**Purpose**: Payment transactions and order management

```typescript
interface Order {
  id: string
  orderNumber: string           // "LD-2024-001234" (unique)
  
  // Customer Information
  customer: string              // Customer ID
  customerEmail: string         // "customer@email.com"
  customerPhone: string         // "+6281234567890"
  customerName: string          // "John Doe"
  
  // Deal Information
  deal: string                  // Deal ID
  dealSnapshot: {
    title: string
    pricingType: PricingType
    originalPrice: number
    discountPrice: number
    discountPercentage: number
    discountAmount: number
    minimumOrderAmount: number
    merchantName: string
  }
  
  // Order Details
  quantity: number              // 2
  unitPrice: number             // 50000
  subtotal: number              // 100000
  tax: number                   // 0 (if applicable)
  totalAmount: number           // 100000
  
  // Payment Information
  paymentStatus: PaymentStatus  // "pending" | "paid" | "failed" | "refunded"
  paymentMethod: string         // "credit_card" | "bank_transfer" | "e_wallet"
  paymentReference: string      // Midtrans order ID
  
  // Midtrans Integration
  midtransOrderId: string       // "LD-2024-001234"
  midtransTransactionId: string // "12345678-1234-1234-1234-123456789012"
  midtransPaymentType: string   // "credit_card"
  midtransBank: string          // "bca" (if applicable)
  
  // Timing
  createdAt: Date
  paidAt: Date                 // When payment completed
  expiresAt: Date              // Order expiration (if not paid)
  
  // Relationships
  coupons: Coupon[]            // Generated coupons
  
  // Audit
  updatedAt: Date
  createdBy: string
}

type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "expired"
```

### 4. Coupons Collection
**Purpose**: QR codes and coupon management

```typescript
interface Coupon {
  id: string
  couponCode: string            // "LD-ABC123-XYZ789" (unique)
  qrCode: string                // Base64 QR code image
  
  // Relationships
  order: string                 // Order ID
  deal: string                  // Deal ID
  customer: string              // Customer ID
  merchant: string              // Merchant ID (from deal)
  
  // Status
  status: CouponStatus          // "issued" | "redeemed" | "expired" | "refunded"
  
  // Timing
  issuedAt: Date               // When coupon created
  expiresAt: Date              // When coupon expires (same as deal end)
  redeemedAt: Date             // When redeemed (if applicable)
  
  // Redemption Details
  redemptionLocation: string    // "Main Branch"
  redemptionNotes: string       // Staff notes
  redeemedBy: string           // Staff ID who redeemed
  
  // Security
  isSingleUse: boolean         // true (always true)
  isTransferable: boolean      // false (always false)
  
  // Audit
  createdAt: Date
  updatedAt: Date
}

type CouponStatus = "issued" | "redeemed" | "expired" | "refunded"
```

### 5. Redemptions Collection
**Purpose**: Coupon redemption tracking

```typescript
interface Redemption {
  id: string
  coupon: string                // Coupon ID
  order: string                 // Order ID (for reference)
  deal: string                  // Deal ID (for reference)
  merchant: string              // Merchant ID
  
  // Redemption Details
  redeemedAt: Date             // When redeemed
  redeemedBy: string           // Staff ID
  redemptionLocation: string   // "Main Branch"
  redemptionNotes: string      // Staff notes
  
  // Verification
  staffPin: string             // Staff PIN used
  verificationPhoto: Media     // Optional photo
  deviceInfo: {
    userAgent: string
    ipAddress: string
    location: string
  }
  
  // Audit
  createdAt: Date
  createdBy: string
}
```

### 6. Customers Collection
**Purpose**: Customer account management

```typescript
interface Customer {
  id: string
  email: string                 // "customer@email.com" (unique, normalized)
  phone: string                 // "+6281234567890" (E.164 format)
  name: string                  // "John Doe"
  
  // Preferences
  whatsappNumber: string        // "+6281234567890"
  isSubscribedToNotifications: boolean
  notificationPreferences: {
    email: boolean
    whatsapp: boolean
    sms: boolean
  }
  
  // Profile
  dateOfBirth: Date            // Optional
  gender: string               // "male" | "female" | "other" | "prefer_not_to_say"
  profilePicture: Media        // Optional
  
  // Statistics
  totalOrders: number          // 5
  totalSpent: number           // 500000
  lastOrderAt: Date           // Last order date
  
  // Relationships
  orders: Order[]              // Customer's orders
  coupons: Coupon[]            // Customer's coupons
  
  // Status
  isActive: boolean            // Active customer
  isVerified: boolean          // Email/phone verified
  
  // Audit
  createdAt: Date
  updatedAt: Date
  lastLoginAt: Date
}
```

### 7. Staff Collection
**Purpose**: Merchant staff management

```typescript
interface Staff {
  id: string
  merchant: string             // Merchant ID
  
  // Personal Information
  name: string                 // "Jane Smith"
  email: string                // "jane@restaurant-abc.com"
  phone: string                // "+6281234567890"
  
  // Authentication
  pin: string                  // "1234" (hashed)
  role: StaffRole              // "cashier" | "manager" | "admin"
  isActive: boolean            // Active staff member
  
  // Permissions
  canVerifyCoupons: boolean    // true
  canViewAnalytics: boolean    // false (for cashiers)
  canManageDeals: boolean      // false (for cashiers)
  
  // Statistics
  totalRedemptions: number     // 150
  lastRedemptionAt: Date      // Last redemption
  
  // Audit
  createdAt: Date
  updatedAt: Date
  lastLoginAt: Date
  createdBy: string
}

type StaffRole = "cashier" | "manager" | "admin"
```

### 8. WebhookLogs Collection
**Purpose**: Payment webhook audit trail

```typescript
interface WebhookLog {
  id: string
  source: string               // "midtrans"
  eventType: string            // "payment.success"
  
  // Request Details
  orderId: string              // "LD-2024-001234"
  transactionId: string        // Midtrans transaction ID
  status: string               // "success" | "failed" | "pending"
  
  // Payload
  rawPayload: string           // Raw webhook payload
  signature: string            // Webhook signature
  headers: Record<string, string> // Request headers
  
  // Processing
  processedAt: Date            // When processed
  processingTime: number       // Processing time in ms
  isProcessed: boolean         // Successfully processed
  errorMessage: string         // Error if failed
  
  // Security
  ipAddress: string            // Source IP
  userAgent: string            // Request user agent
  
  // Audit
  createdAt: Date
}
```

### 9. Categories Collection
**Purpose**: Deal categorization

```typescript
interface Category {
  id: string
  name: string                 // "Restaurant"
  slug: string                 // "restaurant"
  description: string          // Category description
  
  // Display
  icon: string                 // Icon name
  color: string                // "#FF6B6B"
  image: Media                 // Category image
  
  // Hierarchy
  parent: string               // Parent category ID (optional)
  children: string[]           // Child category IDs
  
  // Status
  isActive: boolean            // Active category
  sortOrder: number            // Display order
  
  // Relationships
  deals: Deal[]                // Deals in this category
  
  // Audit
  createdAt: Date
  updatedAt: Date
}
```

### 10. Media Collection
**Purpose**: File and image management

```typescript
interface Media {
  id: string
  filename: string             // "deal-image.jpg"
  alt: string                  // "Deal image"
  
  // File Information
  mimeType: string             // "image/jpeg"
  filesize: number             // 1024000 (bytes)
  width: number                // 1920
  height: number               // 1080
  
  // URLs
  url: string                  // Public URL
  thumbnailUrl: string         // Thumbnail URL
  
  // Relationships
  createdBy: string            // User ID
  
  // Audit
  createdAt: Date
  updatedAt: Date
}
```

## 💰 Pricing Logic Implementation

### Pricing Type Examples

#### 1. Fixed Price Deal
```typescript
// Example: "Pay IDR 100,000 for any order"
{
  pricingType: "fixed_price",
  originalPrice: 200000,        // Original menu price
  discountPrice: 100000,        // Fixed price customer pays
  minimumOrderAmount: 0,        // No minimum required
  discountDisplay: "Pay IDR 100,000",
  discountDescription: "Fixed price for any order"
}
```

#### 2. Percentage Discount Deal
```typescript
// Example: "20% off orders above IDR 100,000"
{
  pricingType: "percentage_discount",
  discountPercentage: 20,        // 20% discount
  minimumOrderAmount: 100000,    // Minimum order required
  maxDiscountAmount: 50000,       // Optional: cap discount at IDR 50,000
  discountDisplay: "20% OFF",
  discountDescription: "20% off orders above IDR 100,000"
}

// Calculation Logic:
// Order Amount: IDR 150,000
// Discount: 150,000 * 20% = IDR 30,000
// Final Price: IDR 150,000 - IDR 30,000 = IDR 120,000
```

#### 3. Fixed Discount Deal
```typescript
// Example: "IDR 100,000 off orders above IDR 200,000"
{
  pricingType: "fixed_discount",
  discountAmount: 100000,        // Fixed discount amount
  minimumOrderAmount: 200000,    // Minimum order required
  discountDisplay: "Save IDR 100,000",
  discountDescription: "IDR 100,000 off orders above IDR 200,000"
}

// Calculation Logic:
// Order Amount: IDR 250,000
// Discount: IDR 100,000 (fixed)
// Final Price: IDR 250,000 - IDR 100,000 = IDR 150,000
```

### Pricing Calculation Functions

```typescript
// Server-side pricing calculation
function calculateDealPrice(deal: Deal, orderAmount: number): {
  isValid: boolean,
  finalPrice: number,
  discountApplied: number,
  savings: number
} {
  // Check minimum order requirement
  if (orderAmount < deal.minimumOrderAmount) {
    return {
      isValid: false,
      finalPrice: orderAmount,
      discountApplied: 0,
      savings: 0
    };
  }

  let discountApplied = 0;
  let finalPrice = orderAmount;

  switch (deal.pricingType) {
    case "fixed_price":
      finalPrice = deal.discountPrice;
      discountApplied = orderAmount - deal.discountPrice;
      break;

    case "percentage_discount":
      discountApplied = orderAmount * (deal.discountPercentage / 100);
      // Apply discount cap if set
      if (deal.maxDiscountAmount && discountApplied > deal.maxDiscountAmount) {
        discountApplied = deal.maxDiscountAmount;
      }
      finalPrice = orderAmount - discountApplied;
      break;

    case "fixed_discount":
      discountApplied = deal.discountAmount;
      finalPrice = orderAmount - discountApplied;
      break;
  }

  return {
    isValid: true,
    finalPrice: Math.max(0, finalPrice), // Ensure non-negative
    discountApplied,
    savings: discountApplied
  };
}
```

### Order Processing Logic

```typescript
// Order creation with pricing validation
async function createOrder(dealId: string, customerId: string, orderAmount: number) {
  const deal = await payload.findByID({
    collection: 'deals',
    id: dealId
  });

  // Calculate pricing
  const pricing = calculateDealPrice(deal, orderAmount);
  
  if (!pricing.isValid) {
    throw new Error(`Minimum order amount of IDR ${deal.minimumOrderAmount} required`);
  }

  // Create order with calculated pricing
  const order = await payload.create({
    collection: 'orders',
    data: {
      customer: customerId,
      deal: dealId,
      dealSnapshot: {
        title: deal.title,
        pricingType: deal.pricingType,
        originalPrice: deal.originalPrice,
        discountPrice: deal.discountPrice,
        discountPercentage: deal.discountPercentage,
        discountAmount: deal.discountAmount,
        minimumOrderAmount: deal.minimumOrderAmount,
        merchantName: deal.merchant.businessName
      },
      subtotal: orderAmount,
      totalAmount: pricing.finalPrice,
      // ... other order fields
    }
  });

  return order;
}
```

## 🔗 Relationships

### Primary Relationships
```
Merchants (1) ──→ (Many) Deals
Deals (1) ──→ (Many) Orders
Orders (1) ──→ (Many) Coupons
Coupons (1) ──→ (1) Redemptions
Merchants (1) ──→ (Many) Staff
Customers (1) ──→ (Many) Orders
Categories (1) ──→ (Many) Deals
```

### Unique Constraints
```sql
-- Prevent duplicate orders
UNIQUE(midtransOrderId)
UNIQUE(orderNumber)

-- Prevent duplicate coupons
UNIQUE(couponCode)

-- Prevent duplicate redemptions
UNIQUE(coupon)

-- Prevent duplicate customers
UNIQUE(email)
UNIQUE(phone)

-- Prevent duplicate staff
UNIQUE(merchant, email)
```

### Indexes for Performance
```sql
-- Deal queries
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_merchant ON deals(merchant);
CREATE INDEX idx_deals_dates ON deals(startDate, endDate);

-- Order queries
CREATE INDEX idx_orders_customer ON orders(customer);
CREATE INDEX idx_orders_deal ON orders(deal);
CREATE INDEX idx_orders_payment_status ON orders(paymentStatus);

-- Coupon queries
CREATE INDEX idx_coupons_order ON coupons(order);
CREATE INDEX idx_coupons_status ON coupons(status);
CREATE INDEX idx_coupons_merchant ON coupons(merchant);

-- Redemption queries
CREATE INDEX idx_redemptions_coupon ON redemptions(coupon);
CREATE INDEX idx_redemptions_merchant ON redemptions(merchant);
CREATE INDEX idx_redemptions_date ON redemptions(redeemedAt);
```

## 🔒 Security Considerations

### Data Encryption
- **Sensitive Data**: Customer PII encrypted at rest
- **Payment Data**: Never store card details
- **Staff Pins**: Hashed with bcrypt
- **API Keys**: Encrypted in environment variables

### Access Control
- **Public**: Read-only access to active deals
- **Customers**: Own orders and coupons only
- **Staff**: Merchant-specific data only
- **Admins**: Full access with audit logging

### Audit Trail
- **All Changes**: Logged with user and timestamp
- **Payment Events**: Complete webhook audit
- **Security Events**: Failed login attempts, unauthorized access
- **Data Retention**: 7 years for financial data, 2 years for other data

---

*Last Updated: December 2024*
*Version: 1.0*

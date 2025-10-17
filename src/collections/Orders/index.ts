import { CollectionConfig } from 'payload/types'
import { isAuthenticated, isAdmin } from '@/access'
import { beforeChange, afterChange } from './hooks'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'deal', 'totalAmount', 'paymentStatus', 'createdAt'],
    group: 'Business',
  },
  access: {
    read: isAuthenticated,
    create: isAuthenticated,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      index: true,
    },
    {
      name: 'deal',
      type: 'relationship',
      relationTo: 'deals',
      required: true,
      index: true,
    },
    {
      name: 'dealSnapshot',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'pricingType',
          type: 'select',
          options: [
            { label: 'Fixed Price', value: 'fixed_price' },
            { label: 'Percentage Discount', value: 'percentage_discount' },
            { label: 'Fixed Discount', value: 'fixed_discount' },
          ],
          required: true,
        },
        {
          name: 'originalPrice',
          type: 'number',
          min: 0,
        },
        {
          name: 'discountPrice',
          type: 'number',
          min: 0,
        },
        {
          name: 'discountPercentage',
          type: 'number',
          min: 0,
          max: 100,
        },
        {
          name: 'discountAmount',
          type: 'number',
          min: 0,
        },
        {
          name: 'minimumOrderAmount',
          type: 'number',
          min: 0,
        },
        {
          name: 'merchantName',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
      defaultValue: 1,
    },
    {
      name: 'orderAmount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Original order amount before discount',
      },
    },
    {
      name: 'unitPrice',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Price per unit after discount',
      },
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Subtotal before tax',
      },
    },
    {
      name: 'tax',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Tax amount (if applicable)',
      },
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Final amount to be paid',
      },
    },
    {
      name: 'discountApplied',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Total discount applied',
      },
    },
    {
      name: 'savings',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Total savings from discount',
      },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Expired', value: 'expired' },
      ],
      defaultValue: 'pending',
      index: true,
    },
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        { label: 'Credit Card', value: 'credit_card' },
        { label: 'Bank Transfer', value: 'bank_transfer' },
        { label: 'E-Wallet', value: 'e_wallet' },
        { label: 'Cash', value: 'cash' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'paymentReference',
      type: 'text',
      admin: {
        description: 'External payment reference (e.g., Midtrans order ID)',
      },
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'customerPhone',
      type: 'text',
      required: true,
    },
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'paidAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        description: 'Order expiration time if not paid',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      maxLength: 500,
    },
  ],
  hooks: {
    beforeChange: [beforeChange],
    afterChange: [afterChange],
  },
  timestamps: true,
  indexes: [
    {
      fields: {
        orderNumber: 1,
      },
      unique: true,
    },
    {
      fields: {
        customer: 1,
        createdAt: -1,
      },
    },
    {
      fields: {
        deal: 1,
        createdAt: -1,
      },
    },
    {
      fields: {
        paymentStatus: 1,
        createdAt: -1,
      },
    },
    {
      fields: {
        customerEmail: 1,
      },
    },
  ],
}

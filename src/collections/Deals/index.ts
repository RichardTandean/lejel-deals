import { CollectionConfig } from 'payload/types'
import { isAdmin, isAuthenticated } from '@/access'
import { beforeChange, afterChange } from './hooks'
import { validateDealData } from './validation'

export const Deals: CollectionConfig = {
  slug: 'deals',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'pricingType', 'startDate', 'endDate'],
    group: 'Content',
  },
  access: {
    read: () => true, // Public read access for active deals
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 200,
      validate: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Title is required'
        }
        if (value.length > 200) {
          return 'Title must be less than 200 characters'
        }
        return true
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      validate: (value) => {
        if (!value || !/^[a-z0-9-]+$/.test(value)) {
          return 'Slug must contain only lowercase letters, numbers, and hyphens'
        }
        return true
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      maxLength: 500,
    },
    {
      name: 'pricingType',
      type: 'select',
      required: true,
      options: [
        { label: 'Fixed Price', value: 'fixed_price' },
        { label: 'Percentage Discount', value: 'percentage_discount' },
        { label: 'Fixed Discount', value: 'fixed_discount' },
      ],
      defaultValue: 'fixed_price',
    },
    // Fixed Price fields
    {
      name: 'originalPrice',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        condition: (data) => data.pricingType === 'fixed_price',
      },
    },
    {
      name: 'discountPrice',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        condition: (data) => data.pricingType === 'fixed_price',
      },
    },
    // Percentage Discount fields
    {
      name: 'discountPercentage',
      type: 'number',
      min: 0,
      max: 100,
      admin: {
        condition: (data) => data.pricingType === 'percentage_discount',
      },
    },
    {
      name: 'maxDiscountAmount',
      type: 'number',
      min: 0,
      admin: {
        condition: (data) => data.pricingType === 'percentage_discount',
      },
    },
    // Fixed Discount fields
    {
      name: 'discountAmount',
      type: 'number',
      min: 0,
      admin: {
        condition: (data) => data.pricingType === 'fixed_discount',
      },
    },
    // Minimum Order Requirements
    {
      name: 'minimumOrderAmount',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'minimumOrderItems',
      type: 'number',
      min: 1,
      defaultValue: 1,
    },
    // Calculated fields (read-only)
    {
      name: 'savings',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'finalPrice',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'currency',
      type: 'text',
      required: true,
      defaultValue: 'IDR',
      validate: (value) => {
        if (!value || value.length !== 3) {
          return 'Currency must be a 3-letter code (e.g., IDR)'
        }
        return true
      },
    },
    {
      name: 'discountDisplay',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'discountDescription',
      type: 'text',
      required: true,
      maxLength: 200,
    },
    // Timing
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'timezone',
      type: 'text',
      required: true,
      defaultValue: 'Asia/Jakarta',
      validate: (value) => {
        try {
          Intl.DateTimeFormat(undefined, { timeZone: value })
          return true
        } catch {
          return 'Invalid timezone'
        }
      },
    },
    // Inventory
    {
      name: 'maxCoupons',
      type: 'number',
      min: 1,
      admin: {
        description: 'Leave empty for unlimited coupons',
      },
    },
    {
      name: 'soldCoupons',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'isInventoryCapped',
      type: 'checkbox',
      admin: {
        readOnly: true,
      },
    },
    // Status
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Expired', value: 'expired' },
        { label: 'Sold Out', value: 'sold_out' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'draft',
      index: true,
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      index: true,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      index: true,
    },
    // Relationships
    {
      name: 'merchant',
      type: 'relationship',
      relationTo: 'merchants',
      required: true,
      index: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      index: true,
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
      ],
    },
    // Content
    {
      name: 'termsAndConditions',
      type: 'richText',
      required: true,
    },
    {
      name: 'highlights',
      type: 'array',
      fields: [
        {
          name: 'highlight',
          type: 'text',
          required: true,
          maxLength: 100,
        },
      ],
    },
    // SEO
    {
      name: 'metaTitle',
      type: 'text',
      maxLength: 60,
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      maxLength: 160,
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
        status: 1,
        isVisible: 1,
        startDate: 1,
        endDate: 1,
      },
    },
    {
      fields: {
        merchant: 1,
        status: 1,
      },
    },
    {
      fields: {
        category: 1,
        status: 1,
      },
    },
    {
      fields: {
        slug: 1,
      },
      unique: true,
    },
  ],
}

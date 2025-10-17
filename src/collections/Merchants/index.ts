import { CollectionConfig } from 'payload/types'
import { isAdmin, isMerchant } from '@/access'
import { beforeChange, afterChange } from './hooks'

export const Merchants: CollectionConfig = {
  slug: 'merchants',
  admin: {
    useAsTitle: 'businessName',
    defaultColumns: ['businessName', 'businessType', 'isActive', 'isVerified'],
    group: 'Business',
  },
  access: {
    read: () => true, // Public read access
    create: isAdmin,
    update: isMerchant,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'businessName',
      type: 'text',
      required: true,
      maxLength: 200,
      validate: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Business name is required'
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
      name: 'contactPerson',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      validate: (value) => {
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please provide a valid email address'
        }
        return true
      },
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      validate: (value) => {
        if (!value || !/^\+62[0-9]{8,13}$/.test(value)) {
          return 'Phone number must be a valid Indonesian number (+62xxxxxxxxx)'
        }
        return true
      },
    },
    {
      name: 'whatsapp',
      type: 'text',
      validate: (value) => {
        if (value && !/^\+62[0-9]{8,13}$/.test(value)) {
          return 'WhatsApp number must be a valid Indonesian number (+62xxxxxxxxx)'
        }
        return true
      },
    },
    {
      name: 'businessType',
      type: 'select',
      required: true,
      options: [
        { label: 'Restaurant', value: 'restaurant' },
        { label: 'Cafe', value: 'cafe' },
        { label: 'Lifestyle', value: 'lifestyle' },
        { label: 'Beauty', value: 'beauty' },
        { label: 'Fitness', value: 'fitness' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'restaurant',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      maxLength: 1000,
    },
    {
      name: 'establishedYear',
      type: 'number',
      min: 1900,
      max: new Date().getFullYear(),
    },
    {
      name: 'address',
      type: 'textarea',
      required: true,
      maxLength: 500,
    },
    {
      name: 'city',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'province',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'postalCode',
      type: 'text',
      maxLength: 10,
      validate: (value) => {
        if (value && !/^[0-9]{5}$/.test(value)) {
          return 'Postal code must be 5 digits'
        }
        return true
      },
    },
    {
      name: 'coordinates',
      type: 'group',
      fields: [
        {
          name: 'lat',
          type: 'number',
          validate: (value) => {
            if (value && (value < -90 || value > 90)) {
              return 'Latitude must be between -90 and 90'
            }
            return true
          },
        },
        {
          name: 'lng',
          type: 'number',
          validate: (value) => {
            if (value && (value < -180 || value > 180)) {
              return 'Longitude must be between -180 and 180'
            }
            return true
          },
        },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'brandColors',
      type: 'group',
      fields: [
        {
          name: 'primary',
          type: 'text',
          validate: (value) => {
            if (value && !/^#[0-9A-Fa-f]{6}$/.test(value)) {
              return 'Primary color must be a valid hex color (e.g., #FF6B6B)'
            }
            return true
          },
        },
        {
          name: 'secondary',
          type: 'text',
          validate: (value) => {
            if (value && !/^#[0-9A-Fa-f]{6}$/.test(value)) {
              return 'Secondary color must be a valid hex color (e.g., #4ECDC4)'
            }
            return true
          },
        },
      ],
    },
    {
      name: 'operatingHours',
      type: 'group',
      fields: [
        {
          name: 'monday',
          type: 'group',
          fields: [
            { name: 'open', type: 'text' },
            { name: 'close', type: 'text' },
            { name: 'closed', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          name: 'tuesday',
          type: 'group',
          fields: [
            { name: 'open', type: 'text' },
            { name: 'close', type: 'text' },
            { name: 'closed', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          name: 'wednesday',
          type: 'group',
          fields: [
            { name: 'open', type: 'text' },
            { name: 'close', type: 'text' },
            { name: 'closed', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          name: 'thursday',
          type: 'group',
          fields: [
            { name: 'open', type: 'text' },
            { name: 'close', type: 'text' },
            { name: 'closed', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          name: 'friday',
          type: 'group',
          fields: [
            { name: 'open', type: 'text' },
            { name: 'close', type: 'text' },
            { name: 'closed', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          name: 'saturday',
          type: 'group',
          fields: [
            { name: 'open', type: 'text' },
            { name: 'close', type: 'text' },
            { name: 'closed', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          name: 'sunday',
          type: 'group',
          fields: [
            { name: 'open', type: 'text' },
            { name: 'close', type: 'text' },
            { name: 'closed', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      required: true,
      defaultValue: true,
      index: true,
    },
    {
      name: 'isVerified',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      index: true,
    },
    {
      name: 'verificationDate',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'commissionRate',
      type: 'number',
      min: 0,
      max: 1,
      admin: {
        description: 'Commission rate as decimal (e.g., 0.1 for 10%)',
      },
    },
    {
      name: 'bankAccount',
      type: 'group',
      fields: [
        {
          name: 'bankName',
          type: 'text',
          maxLength: 100,
        },
        {
          name: 'accountNumber',
          type: 'text',
          maxLength: 50,
        },
        {
          name: 'accountHolder',
          type: 'text',
          maxLength: 100,
        },
      ],
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
        businessName: 1,
      },
    },
    {
      fields: {
        slug: 1,
      },
      unique: true,
    },
    {
      fields: {
        email: 1,
      },
      unique: true,
    },
    {
      fields: {
        isActive: 1,
        isVerified: 1,
      },
    },
    {
      fields: {
        businessType: 1,
        isActive: 1,
      },
    },
  ],
}

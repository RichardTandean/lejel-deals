import { CollectionConfig } from 'payload/types'
import { isAuthenticated, isAdmin } from '@/access'
import { beforeChange, afterChange } from './hooks'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'phone', 'isActive', 'totalOrders'],
    group: 'Users',
  },
  access: {
    read: isAuthenticated,
    create: () => true, // Allow public registration
    update: isAuthenticated,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
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
      unique: true,
      index: true,
      validate: (value) => {
        if (!value || !/^\+62[0-9]{8,13}$/.test(value)) {
          return 'Phone number must be a valid Indonesian number (+62xxxxxxxxx)'
        }
        return true
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 100,
      validate: (value) => {
        if (!value || value.trim().length < 2) {
          return 'Name must be at least 2 characters long'
        }
        return true
      },
    },
    {
      name: 'whatsappNumber',
      type: 'text',
      validate: (value) => {
        if (value && !/^\+62[0-9]{8,13}$/.test(value)) {
          return 'WhatsApp number must be a valid Indonesian number (+62xxxxxxxxx)'
        }
        return true
      },
    },
    {
      name: 'isSubscribedToNotifications',
      type: 'checkbox',
      required: true,
      defaultValue: true,
    },
    {
      name: 'notificationPreferences',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'whatsapp',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'sms',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'gender',
      type: 'select',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
        { label: 'Prefer not to say', value: 'prefer_not_to_say' },
      ],
    },
    {
      name: 'profilePicture',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'totalOrders',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalSpent',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'lastOrderAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
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
      name: 'verificationToken',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'verificationExpires',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'lastLoginAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
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
        email: 1,
      },
      unique: true,
    },
    {
      fields: {
        phone: 1,
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
        totalOrders: -1,
      },
    },
    {
      fields: {
        totalSpent: -1,
      },
    },
  ],
}

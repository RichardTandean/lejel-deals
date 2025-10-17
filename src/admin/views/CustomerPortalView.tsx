import React from 'react'
import { useAuth } from '@payloadcms/next/views'
import { CustomerDashboard } from '@/components/admin/customer/CustomerDashboard'

export const CustomerPortalView: React.FC = () => {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="customer-portal-loading">
        <div className="loading-spinner"></div>
        <p>Loading customer portal...</p>
      </div>
    )
  }

  return (
    <div className="customer-portal">
      <div className="portal-header">
        <h1>Customer Portal</h1>
        <p>Manage your deals and orders</p>
      </div>
      
      <CustomerDashboard user={user} />
    </div>
  )
}

// Customer portal specific styles
const customerPortalStyles = `
  .customer-portal {
    min-height: 100vh;
    background: #f9fafb;
  }

  .customer-portal-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;
    padding: 2rem;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f4f6;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .customer-portal-loading p {
    color: #6b7280;
    font-size: 1.1rem;
  }

  .portal-header {
    background: white;
    padding: 2rem;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 2rem;
  }

  .portal-header h1 {
    font-size: 2rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .portal-header p {
    color: #6b7280;
    font-size: 1.1rem;
  }

  /* Override PayloadCMS styles for customer portal */
  .customer-portal .payload-admin {
    background: #f9fafb;
  }

  .customer-portal .template-default {
    background: #f9fafb;
  }

  .customer-portal .nav {
    background: white;
    border-bottom: 1px solid #e5e7eb;
  }

  .customer-portal .nav__brand {
    color: #1f2937;
  }

  .customer-portal .nav__brand:hover {
    color: #3b82f6;
  }

  .customer-portal .nav__link {
    color: #6b7280;
  }

  .customer-portal .nav__link:hover {
    color: #1f2937;
  }

  .customer-portal .nav__link--active {
    color: #3b82f6;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .customer-portal {
      padding: 0;
    }

    .portal-header {
      padding: 1rem;
    }

    .portal-header h1 {
      font-size: 1.5rem;
    }
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = customerPortalStyles
  document.head.appendChild(styleSheet)
}

import React from 'react'
import { useAuth } from '@payloadcms/next/views'
import { CustomerDashboard } from './customer/CustomerDashboard'
import { MerchantDashboard } from './merchant/MerchantDashboard'
import { StaffDashboard } from './staff/StaffDashboard'
import { AdminDashboard } from './admin/AdminDashboard'

export const RoleBasedDashboard: React.FC = () => {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="loading-dashboard">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  // Determine user role and render appropriate dashboard
  const userRole = user.role || 'customer'

  switch (userRole) {
    case 'admin':
      return <AdminDashboard user={user} />
    case 'merchant':
      return <MerchantDashboard user={user} />
    case 'staff':
      return <StaffDashboard user={user} />
    case 'customer':
    default:
      return <CustomerDashboard user={user} />
  }
}

// Loading component styles
const loadingStyles = `
  .loading-dashboard {
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

  .loading-dashboard p {
    color: #6b7280;
    font-size: 1.1rem;
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = loadingStyles
  document.head.appendChild(styleSheet)
}

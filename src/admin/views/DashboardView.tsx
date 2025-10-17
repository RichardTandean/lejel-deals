import React from 'react'
import { useAuth } from '@payloadcms/next/views'
import { RoleBasedDashboard } from '@/components/admin/RoleBasedDashboard'

export const DashboardView: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="custom-dashboard-view">
      <RoleBasedDashboard />
    </div>
  )
}

// Global styles for the dashboard view
const dashboardStyles = `
  .custom-dashboard-view {
    min-height: 100vh;
    background: #f9fafb;
  }

  .custom-dashboard-view * {
    box-sizing: border-box;
  }

  .custom-dashboard-view .dashboard-header h1 {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .custom-dashboard-view .dashboard-card {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .custom-dashboard-view .btn {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  /* Override PayloadCMS admin styles for better integration */
  .custom-dashboard-view .payload-admin {
    background: #f9fafb;
  }

  .custom-dashboard-view .template-default {
    background: #f9fafb;
  }

  .custom-dashboard-view .nav {
    background: white;
    border-bottom: 1px solid #e5e7eb;
  }

  .custom-dashboard-view .nav__brand {
    color: #1f2937;
  }

  .custom-dashboard-view .nav__brand:hover {
    color: #3b82f6;
  }

  .custom-dashboard-view .nav__link {
    color: #6b7280;
  }

  .custom-dashboard-view .nav__link:hover {
    color: #1f2937;
  }

  .custom-dashboard-view .nav__link--active {
    color: #3b82f6;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .custom-dashboard-view {
      padding: 0;
    }
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = dashboardStyles
  document.head.appendChild(styleSheet)
}

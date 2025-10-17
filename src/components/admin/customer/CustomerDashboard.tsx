import React from 'react'
import { useAuth } from '@payloadcms/next/views'
import { useConfig } from '@payloadcms/next/views'
import { useDocumentInfo } from '@payloadcms/next/views'
import { useTranslation } from '@payloadcms/next/views'

interface CustomerDashboardProps {
  user: any
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user }) => {
  const { t } = useTranslation()
  const config = useConfig()

  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name || user.email}!</h1>
        <p>Manage your deals and orders</p>
      </div>

      <div className="dashboard-grid">
        {/* Active Deals */}
        <div className="dashboard-card">
          <h3>Active Deals</h3>
          <div className="card-content">
            <div className="stat">
              <span className="stat-number">3</span>
              <span className="stat-label">Active Deals</span>
            </div>
            <div className="stat">
              <span className="stat-number">2</span>
              <span className="stat-label">Expiring Soon</span>
            </div>
          </div>
          <div className="card-actions">
            <a href="/customer/deals" className="btn btn-primary">
              View All Deals
            </a>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="dashboard-card">
          <h3>Recent Orders</h3>
          <div className="card-content">
            <div className="order-item">
              <div className="order-info">
                <span className="order-title">50% Off Premium Menu</span>
                <span className="order-date">Dec 15, 2024</span>
              </div>
              <div className="order-status">
                <span className="status-badge status-paid">Paid</span>
              </div>
            </div>
            <div className="order-item">
              <div className="order-info">
                <span className="order-title">Free Coffee with Purchase</span>
                <span className="order-date">Dec 14, 2024</span>
              </div>
              <div className="order-status">
                <span className="status-badge status-pending">Pending</span>
              </div>
            </div>
          </div>
          <div className="card-actions">
            <a href="/customer/orders" className="btn btn-secondary">
              View All Orders
            </a>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="card-content">
            <div className="quick-actions">
              <a href="/deals" className="quick-action">
                <span className="action-icon">🔍</span>
                <span className="action-text">Browse Deals</span>
              </a>
              <a href="/customer/profile" className="quick-action">
                <span className="action-icon">👤</span>
                <span className="action-text">Update Profile</span>
              </a>
              <a href="/customer/support" className="quick-action">
                <span className="action-icon">💬</span>
                <span className="action-text">Get Support</span>
              </a>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="dashboard-card">
          <h3>Notifications</h3>
          <div className="card-content">
            <div className="notification-item">
              <span className="notification-text">Your deal expires in 2 days</span>
              <span className="notification-time">2 hours ago</span>
            </div>
            <div className="notification-item">
              <span className="notification-text">New deal available at your favorite restaurant</span>
              <span className="notification-time">1 day ago</span>
            </div>
          </div>
          <div className="card-actions">
            <a href="/customer/notifications" className="btn btn-secondary">
              View All Notifications
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .customer-dashboard {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #1f2937;
        }

        .dashboard-header p {
          color: #6b7280;
          font-size: 1.1rem;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .dashboard-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .dashboard-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .card-content {
          margin-bottom: 1rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 6px;
          margin-bottom: 0.5rem;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #3b82f6;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .order-title {
          font-weight: 500;
          color: #1f2937;
        }

        .order-date {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-paid {
          background: #dcfce7;
          color: #166534;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .quick-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .quick-action {
          display: flex;
          align-items: center;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 6px;
          text-decoration: none;
          color: #374151;
          transition: background-color 0.2s;
        }

        .quick-action:hover {
          background: #f3f4f6;
        }

        .action-icon {
          font-size: 1.25rem;
          margin-right: 0.75rem;
        }

        .action-text {
          font-weight: 500;
        }

        .notification-item {
          padding: 0.75rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-text {
          display: block;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .notification-time {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .card-actions {
          margin-top: 1rem;
        }

        .btn {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        @media (max-width: 768px) {
          .customer-dashboard {
            padding: 1rem;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-header h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}

import React from 'react'
import { useAuth } from '@payloadcms/next/views'
import { useConfig } from '@payloadcms/next/views'
import { useDocumentInfo } from '@payloadcms/next/views'
import { useTranslation } from '@payloadcms/next/views'

interface MerchantDashboardProps {
  user: any
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ user }) => {
  const { t } = useTranslation()
  const config = useConfig()

  return (
    <div className="merchant-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.businessName || user.email}!</h1>
        <p>Manage your deals, orders, and business</p>
      </div>

      <div className="dashboard-grid">
        {/* Sales Overview */}
        <div className="dashboard-card sales-overview">
          <h3>Sales Overview</h3>
          <div className="card-content">
            <div className="sales-stats">
              <div className="sales-stat">
                <span className="stat-number">Rp 2,450,000</span>
                <span className="stat-label">Today's Revenue</span>
                <span className="stat-change positive">+12%</span>
              </div>
              <div className="sales-stat">
                <span className="stat-number">Rp 15,200,000</span>
                <span className="stat-label">This Week</span>
                <span className="stat-change positive">+8%</span>
              </div>
              <div className="sales-stat">
                <span className="stat-number">Rp 45,800,000</span>
                <span className="stat-label">This Month</span>
                <span className="stat-change positive">+15%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="dashboard-card">
          <h3>Recent Orders</h3>
          <div className="card-content">
            <div className="order-item">
              <div className="order-info">
                <span className="order-title">50% Off Premium Menu</span>
                <span className="order-customer">John Doe</span>
                <span className="order-time">2 minutes ago</span>
              </div>
              <div className="order-amount">Rp 125,000</div>
            </div>
            <div className="order-item">
              <div className="order-info">
                <span className="order-title">Free Coffee with Purchase</span>
                <span className="order-customer">Jane Smith</span>
                <span className="order-time">15 minutes ago</span>
              </div>
              <div className="order-amount">Rp 75,000</div>
            </div>
            <div className="order-item">
              <div className="order-info">
                <span className="order-title">Lunch Special</span>
                <span className="order-customer">Bob Wilson</span>
                <span className="order-time">1 hour ago</span>
              </div>
              <div className="order-amount">Rp 200,000</div>
            </div>
          </div>
          <div className="card-actions">
            <a href="/merchant/orders" className="btn btn-primary">
              View All Orders
            </a>
          </div>
        </div>

        {/* Deal Performance */}
        <div className="dashboard-card">
          <h3>Deal Performance</h3>
          <div className="card-content">
            <div className="deal-item">
              <div className="deal-info">
                <span className="deal-title">50% Off Premium Menu</span>
                <span className="deal-status active">Active</span>
              </div>
              <div className="deal-stats">
                <span className="deal-sold">45 sold</span>
                <span className="deal-revenue">Rp 5,625,000</span>
              </div>
            </div>
            <div className="deal-item">
              <div className="deal-info">
                <span className="deal-title">Free Coffee with Purchase</span>
                <span className="deal-status active">Active</span>
              </div>
              <div className="deal-stats">
                <span className="deal-sold">23 sold</span>
                <span className="deal-revenue">Rp 1,725,000</span>
              </div>
            </div>
            <div className="deal-item">
              <div className="deal-info">
                <span className="deal-title">Lunch Special</span>
                <span className="deal-status expired">Expired</span>
              </div>
              <div className="deal-stats">
                <span className="deal-sold">67 sold</span>
                <span className="deal-revenue">Rp 13,400,000</span>
              </div>
            </div>
          </div>
          <div className="card-actions">
            <a href="/merchant/deals" className="btn btn-primary">
              Manage Deals
            </a>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="card-content">
            <div className="quick-actions">
              <a href="/merchant/deals/create" className="quick-action">
                <span className="action-icon">➕</span>
                <span className="action-text">Create New Deal</span>
              </a>
              <a href="/merchant/analytics" className="quick-action">
                <span className="action-icon">📊</span>
                <span className="action-text">View Analytics</span>
              </a>
              <a href="/merchant/staff" className="quick-action">
                <span className="action-icon">👥</span>
                <span className="action-text">Manage Staff</span>
              </a>
              <a href="/merchant/profile" className="quick-action">
                <span className="action-icon">⚙️</span>
                <span className="action-text">Business Settings</span>
              </a>
            </div>
          </div>
        </div>

        {/* Staff Activity */}
        <div className="dashboard-card">
          <h3>Staff Activity</h3>
          <div className="card-content">
            <div className="staff-item">
              <div className="staff-info">
                <span className="staff-name">Sarah Johnson</span>
                <span className="staff-role">Manager</span>
              </div>
              <div className="staff-activity">
                <span className="activity-text">Processed 12 redemptions today</span>
                <span className="activity-time">Last active: 5 minutes ago</span>
              </div>
            </div>
            <div className="staff-item">
              <div className="staff-info">
                <span className="staff-name">Mike Chen</span>
                <span className="staff-role">Staff</span>
              </div>
              <div className="staff-activity">
                <span className="activity-text">Processed 8 redemptions today</span>
                <span className="activity-time">Last active: 1 hour ago</span>
              </div>
            </div>
          </div>
          <div className="card-actions">
            <a href="/merchant/staff" className="btn btn-secondary">
              Manage Staff
            </a>
          </div>
        </div>

        {/* Notifications */}
        <div className="dashboard-card">
          <h3>Notifications</h3>
          <div className="card-content">
            <div className="notification-item">
              <span className="notification-text">New order received for "50% Off Premium Menu"</span>
              <span className="notification-time">2 minutes ago</span>
            </div>
            <div className="notification-item">
              <span className="notification-text">Deal "Lunch Special" has expired</span>
              <span className="notification-time">1 hour ago</span>
            </div>
            <div className="notification-item">
              <span className="notification-text">Weekly sales report is ready</span>
              <span className="notification-time">2 hours ago</span>
            </div>
          </div>
          <div className="card-actions">
            <a href="/merchant/notifications" className="btn btn-secondary">
              View All Notifications
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .merchant-dashboard {
          padding: 2rem;
          max-width: 1400px;
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
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .sales-overview {
          grid-column: 1 / -1;
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

        .sales-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .sales-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 8px;
          text-align: center;
        }

        .stat-number {
          font-size: 1.75rem;
          font-weight: 700;
          color: #059669;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .stat-change {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .stat-change.positive {
          background: #dcfce7;
          color: #166534;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .order-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .order-title {
          font-weight: 500;
          color: #1f2937;
        }

        .order-customer {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .order-time {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .order-amount {
          font-weight: 600;
          color: #059669;
        }

        .deal-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .deal-item:last-child {
          border-bottom: none;
        }

        .deal-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .deal-title {
          font-weight: 500;
          color: #1f2937;
        }

        .deal-status {
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .deal-status.active {
          background: #dcfce7;
          color: #166534;
        }

        .deal-status.expired {
          background: #fef2f2;
          color: #dc2626;
        }

        .deal-stats {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .deal-sold {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .deal-revenue {
          font-weight: 600;
          color: #059669;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .quick-action {
          display: flex;
          align-items: center;
          padding: 1rem;
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

        .staff-item {
          padding: 1rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .staff-item:last-child {
          border-bottom: none;
        }

        .staff-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .staff-name {
          font-weight: 500;
          color: #1f2937;
        }

        .staff-role {
          font-size: 0.75rem;
          color: #6b7280;
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .staff-activity {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .activity-text {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #9ca3af;
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
          .merchant-dashboard {
            padding: 1rem;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .sales-stats {
            grid-template-columns: 1fr;
          }

          .quick-actions {
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

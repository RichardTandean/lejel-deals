import React from 'react'
import { useAuth } from '@payloadcms/next/views'
import { useConfig } from '@payloadcms/next/views'
import { useDocumentInfo } from '@payloadcms/next/views'
import { useTranslation } from '@payloadcms/next/views'

interface AdminDashboardProps {
  user: any
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const { t } = useTranslation()
  const config = useConfig()

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Platform Administration</h1>
        <p>Manage the entire Lejel Deals platform</p>
      </div>

      <div className="dashboard-grid">
        {/* Platform Overview */}
        <div className="dashboard-card overview-card">
          <h3>Platform Overview</h3>
          <div className="card-content">
            <div className="overview-stats">
              <div className="overview-stat">
                <span className="stat-number">1,247</span>
                <span className="stat-label">Total Users</span>
                <span className="stat-change positive">+12%</span>
              </div>
              <div className="overview-stat">
                <span className="stat-number">89</span>
                <span className="stat-label">Active Merchants</span>
                <span className="stat-change positive">+8%</span>
              </div>
              <div className="overview-stat">
                <span className="stat-number">342</span>
                <span className="stat-label">Active Deals</span>
                <span className="stat-change positive">+15%</span>
              </div>
              <div className="overview-stat">
                <span className="stat-number">Rp 45.2M</span>
                <span className="stat-label">Platform Revenue</span>
                <span className="stat-change positive">+23%</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="dashboard-card">
          <h3>System Health</h3>
          <div className="card-content">
            <div className="health-item">
              <div className="health-info">
                <span className="health-label">API Response Time</span>
                <span className="health-value">145ms</span>
              </div>
              <div className="health-status healthy">Healthy</div>
            </div>
            <div className="health-item">
              <div className="health-info">
                <span className="health-label">Database Performance</span>
                <span className="health-value">98.5%</span>
              </div>
              <div className="health-status healthy">Healthy</div>
            </div>
            <div className="health-item">
              <div className="health-info">
                <span className="health-label">Error Rate</span>
                <span className="health-value">0.02%</span>
              </div>
              <div className="health-status healthy">Healthy</div>
            </div>
            <div className="health-item">
              <div className="health-info">
                <span className="health-label">Uptime</span>
                <span className="health-value">99.9%</span>
              </div>
              <div className="health-status healthy">Healthy</div>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="dashboard-card">
          <h3>Pending Approvals</h3>
          <div className="card-content">
            <div className="approval-item">
              <div className="approval-info">
                <span className="approval-title">New Merchant: "Cafe Delight"</span>
                <span className="approval-type">Merchant Registration</span>
                <span className="approval-time">2 hours ago</span>
              </div>
              <div className="approval-actions">
                <button className="btn btn-success btn-sm">Approve</button>
                <button className="btn btn-danger btn-sm">Reject</button>
              </div>
            </div>
            <div className="approval-item">
              <div className="approval-info">
                <span className="approval-title">Deal: "50% Off Premium Menu"</span>
                <span className="approval-type">Deal Moderation</span>
                <span className="approval-time">4 hours ago</span>
              </div>
              <div className="approval-actions">
                <button className="btn btn-success btn-sm">Approve</button>
                <button className="btn btn-danger btn-sm">Reject</button>
              </div>
            </div>
            <div className="approval-item">
              <div className="approval-info">
                <span className="approval-title">Content Update: "Terms of Service"</span>
                <span className="approval-type">Content Moderation</span>
                <span className="approval-time">6 hours ago</span>
              </div>
              <div className="approval-actions">
                <button className="btn btn-success btn-sm">Approve</button>
                <button className="btn btn-danger btn-sm">Reject</button>
              </div>
            </div>
          </div>
          <div className="card-actions">
            <a href="/admin/merchants" className="btn btn-primary">
              View All Pending
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <div className="card-content">
            <div className="activity-item">
              <div className="activity-info">
                <span className="activity-text">New merchant "Restaurant ABC" registered</span>
                <span className="activity-time">5 minutes ago</span>
              </div>
              <div className="activity-type">Merchant</div>
            </div>
            <div className="activity-item">
              <div className="activity-info">
                <span className="activity-text">Deal "Lunch Special" expired</span>
                <span className="activity-time">1 hour ago</span>
              </div>
              <div className="activity-type">Deal</div>
            </div>
            <div className="activity-item">
              <div className="activity-info">
                <span className="activity-text">Payment processed for Order #LD-12345678</span>
                <span className="activity-time">2 hours ago</span>
              </div>
              <div className="activity-type">Payment</div>
            </div>
            <div className="activity-item">
              <div className="activity-info">
                <span className="activity-text">Customer support ticket resolved</span>
                <span className="activity-time">3 hours ago</span>
              </div>
              <div className="activity-type">Support</div>
            </div>
          </div>
          <div className="card-actions">
            <a href="/admin/logs" className="btn btn-secondary">
              View All Activity
            </a>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="card-content">
            <div className="quick-actions">
              <a href="/admin/merchants" className="quick-action">
                <span className="action-icon">🏪</span>
                <span className="action-text">Manage Merchants</span>
              </a>
              <a href="/admin/deals" className="quick-action">
                <span className="action-icon">🎯</span>
                <span className="action-text">Moderate Deals</span>
              </a>
              <a href="/admin/users" className="quick-action">
                <span className="action-icon">👥</span>
                <span className="action-text">User Management</span>
              </a>
              <a href="/admin/analytics" className="quick-action">
                <span className="action-icon">📊</span>
                <span className="action-text">View Analytics</span>
              </a>
              <a href="/admin/settings" className="quick-action">
                <span className="action-icon">⚙️</span>
                <span className="action-text">Platform Settings</span>
              </a>
              <a href="/admin/reports" className="quick-action">
                <span className="action-icon">📋</span>
                <span className="action-text">Generate Reports</span>
              </a>
            </div>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="dashboard-card">
          <h3>Alerts & Notifications</h3>
          <div className="card-content">
            <div className="alert-item warning">
              <span className="alert-icon">⚠️</span>
              <span className="alert-text">High server load detected</span>
              <span className="alert-time">10 minutes ago</span>
            </div>
            <div className="alert-item info">
              <span className="alert-icon">ℹ️</span>
              <span className="alert-text">Scheduled maintenance in 2 hours</span>
              <span className="alert-time">1 hour ago</span>
            </div>
            <div className="alert-item success">
              <span className="alert-icon">✅</span>
              <span className="alert-text">Backup completed successfully</span>
              <span className="alert-time">2 hours ago</span>
            </div>
          </div>
          <div className="card-actions">
            <a href="/admin/logs" className="btn btn-secondary">
              View All Alerts
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
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

        .overview-card {
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

        .overview-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .overview-stat {
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
          color: #3b82f6;
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

        .health-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .health-item:last-child {
          border-bottom: none;
        }

        .health-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .health-label {
          font-weight: 500;
          color: #1f2937;
        }

        .health-value {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .health-status {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .health-status.healthy {
          background: #dcfce7;
          color: #166534;
        }

        .approval-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .approval-item:last-child {
          border-bottom: none;
        }

        .approval-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .approval-title {
          font-weight: 500;
          color: #1f2937;
        }

        .approval-type {
          font-size: 0.75rem;
          color: #6b7280;
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          display: inline-block;
        }

        .approval-time {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .approval-actions {
          display: flex;
          gap: 0.5rem;
        }

        .activity-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .activity-text {
          font-weight: 500;
          color: #1f2937;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .activity-type {
          font-size: 0.75rem;
          color: #6b7280;
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
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

        .alert-item {
          display: flex;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .alert-item:last-child {
          border-bottom: none;
        }

        .alert-icon {
          font-size: 1.25rem;
          margin-right: 0.75rem;
        }

        .alert-text {
          flex: 1;
          font-weight: 500;
          color: #1f2937;
        }

        .alert-time {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .alert-item.warning {
          background: #fef3c7;
          border-radius: 6px;
          padding: 1rem;
          margin-bottom: 0.5rem;
        }

        .alert-item.info {
          background: #dbeafe;
          border-radius: 6px;
          padding: 1rem;
          margin-bottom: 0.5rem;
        }

        .alert-item.success {
          background: #dcfce7;
          border-radius: 6px;
          padding: 1rem;
          margin-bottom: 0.5rem;
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
          border: none;
          cursor: pointer;
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

        .btn-success {
          background: #10b981;
          color: white;
        }

        .btn-success:hover {
          background: #059669;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .btn-sm {
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
        }

        @media (max-width: 768px) {
          .admin-dashboard {
            padding: 1rem;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .overview-stats {
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

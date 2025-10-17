import React from 'react'
import { useAuth } from '@payloadcms/next/views'
import { useConfig } from '@payloadcms/next/views'
import { useDocumentInfo } from '@payloadcms/next/views'
import { useTranslation } from '@payloadcms/next/views'

interface StaffDashboardProps {
  user: any
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ user }) => {
  const { t } = useTranslation()
  const config = useConfig()

  return (
    <div className="staff-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name || user.email}!</h1>
        <p>Today's tasks and redemption activities</p>
      </div>

      <div className="dashboard-grid">
        {/* Today's Summary */}
        <div className="dashboard-card summary-card">
          <h3>Today's Summary</h3>
          <div className="card-content">
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-number">24</span>
                <span className="stat-label">Redemptions Processed</span>
              </div>
              <div className="summary-stat">
                <span className="stat-number">Rp 1,850,000</span>
                <span className="stat-label">Total Value Processed</span>
              </div>
              <div className="summary-stat">
                <span className="stat-number">8</span>
                <span className="stat-label">Pending Redemptions</span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Scanner */}
        <div className="dashboard-card scanner-card">
          <h3>QR Code Scanner</h3>
          <div className="card-content">
            <div className="scanner-interface">
              <div className="scanner-placeholder">
                <span className="scanner-icon">📱</span>
                <span className="scanner-text">Tap to open scanner</span>
              </div>
            </div>
            <div className="scanner-actions">
              <button className="btn btn-primary btn-large">
                Open Scanner
              </button>
            </div>
          </div>
        </div>

        {/* Pending Redemptions */}
        <div className="dashboard-card">
          <h3>Pending Redemptions</h3>
          <div className="card-content">
            <div className="redemption-item">
              <div className="redemption-info">
                <span className="redemption-title">50% Off Premium Menu</span>
                <span className="redemption-customer">John Doe</span>
                <span className="redemption-time">5 minutes ago</span>
              </div>
              <div className="redemption-actions">
                <button className="btn btn-success btn-sm">Approve</button>
                <button className="btn btn-danger btn-sm">Reject</button>
              </div>
            </div>
            <div className="redemption-item">
              <div className="redemption-info">
                <span className="redemption-title">Free Coffee with Purchase</span>
                <span className="redemption-customer">Jane Smith</span>
                <span className="redemption-time">12 minutes ago</span>
              </div>
              <div className="redemption-actions">
                <button className="btn btn-success btn-sm">Approve</button>
                <button className="btn btn-danger btn-sm">Reject</button>
              </div>
            </div>
            <div className="redemption-item">
              <div className="redemption-info">
                <span className="redemption-title">Lunch Special</span>
                <span className="redemption-customer">Bob Wilson</span>
                <span className="redemption-time">18 minutes ago</span>
              </div>
              <div className="redemption-actions">
                <button className="btn btn-success btn-sm">Approve</button>
                <button className="btn btn-danger btn-sm">Reject</button>
              </div>
            </div>
          </div>
          <div className="card-actions">
            <a href="/staff/orders" className="btn btn-secondary">
              View All Orders
            </a>
          </div>
        </div>

        {/* Recent Redemptions */}
        <div className="dashboard-card">
          <h3>Recent Redemptions</h3>
          <div className="card-content">
            <div className="redemption-item">
              <div className="redemption-info">
                <span className="redemption-title">50% Off Premium Menu</span>
                <span className="redemption-customer">Alice Johnson</span>
                <span className="redemption-time">2 minutes ago</span>
              </div>
              <div className="redemption-status">
                <span className="status-badge status-approved">Approved</span>
              </div>
            </div>
            <div className="redemption-item">
              <div className="redemption-info">
                <span className="redemption-title">Free Coffee with Purchase</span>
                <span className="redemption-customer">Charlie Brown</span>
                <span className="redemption-time">8 minutes ago</span>
              </div>
              <div className="redemption-status">
                <span className="status-badge status-approved">Approved</span>
              </div>
            </div>
            <div className="redemption-item">
              <div className="redemption-info">
                <span className="redemption-title">Lunch Special</span>
                <span className="redemption-customer">Diana Prince</span>
                <span className="redemption-time">15 minutes ago</span>
              </div>
              <div className="redemption-status">
                <span className="status-badge status-rejected">Rejected</span>
              </div>
            </div>
          </div>
          <div className="card-actions">
            <a href="/staff/redemptions" className="btn btn-secondary">
              View All Redemptions
            </a>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="card-content">
            <div className="quick-actions">
              <a href="/staff/scanner" className="quick-action">
                <span className="action-icon">📱</span>
                <span className="action-text">Open Scanner</span>
              </a>
              <a href="/staff/orders" className="quick-action">
                <span className="action-icon">📋</span>
                <span className="action-text">View Orders</span>
              </a>
              <a href="/staff/redemptions" className="quick-action">
                <span className="action-icon">✅</span>
                <span className="action-text">Redemption History</span>
              </a>
              <a href="/staff/help" className="quick-action">
                <span className="action-icon">❓</span>
                <span className="action-text">Get Help</span>
              </a>
            </div>
          </div>
        </div>

        {/* Training & Help */}
        <div className="dashboard-card">
          <h3>Training & Help</h3>
          <div className="card-content">
            <div className="help-item">
              <span className="help-title">How to process redemptions</span>
              <span className="help-type">Video Tutorial</span>
            </div>
            <div className="help-item">
              <span className="help-title">Common issues and solutions</span>
              <span className="help-type">Guide</span>
            </div>
            <div className="help-item">
              <span className="help-title">Contact support</span>
              <span className="help-type">Support</span>
            </div>
          </div>
          <div className="card-actions">
            <a href="/staff/help" className="btn btn-secondary">
              View All Help
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .staff-dashboard {
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

        .summary-card {
          grid-column: 1 / -1;
        }

        .scanner-card {
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

        .summary-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .summary-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 8px;
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #3b82f6;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .scanner-interface {
          margin-bottom: 1rem;
        }

        .scanner-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          background: #f9fafb;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .scanner-placeholder:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .scanner-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .scanner-text {
          font-size: 1.1rem;
          color: #6b7280;
        }

        .scanner-actions {
          text-align: center;
        }

        .redemption-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .redemption-item:last-child {
          border-bottom: none;
        }

        .redemption-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .redemption-title {
          font-weight: 500;
          color: #1f2937;
        }

        .redemption-customer {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .redemption-time {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .redemption-actions {
          display: flex;
          gap: 0.5rem;
        }

        .redemption-status {
          display: flex;
          align-items: center;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-approved {
          background: #dcfce7;
          color: #166534;
        }

        .status-rejected {
          background: #fef2f2;
          color: #dc2626;
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

        .help-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .help-item:last-child {
          border-bottom: none;
        }

        .help-title {
          font-weight: 500;
          color: #1f2937;
        }

        .help-type {
          font-size: 0.75rem;
          color: #6b7280;
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
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

        .btn-large {
          padding: 1rem 2rem;
          font-size: 1rem;
        }

        .btn-sm {
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
        }

        @media (max-width: 768px) {
          .staff-dashboard {
            padding: 1rem;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .summary-stats {
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

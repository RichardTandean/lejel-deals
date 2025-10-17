import { AdminConfig } from 'payload/types'
import { DashboardView } from './views/DashboardView'

export const adminConfig: Partial<AdminConfig> = {
  // Custom admin components
  components: {
    // Override the default dashboard with our role-based dashboard
    beforeDashboard: [DashboardView],
  },

  // Custom admin routes
  routes: {
    // Add custom routes for different user types
    beforeDashboard: [
      {
        path: '/customer/*',
        component: DashboardView,
        exact: false,
      },
      {
        path: '/merchant/*',
        component: DashboardView,
        exact: false,
      },
      {
        path: '/staff/*',
        component: DashboardView,
        exact: false,
      },
      {
        path: '/admin/*',
        component: DashboardView,
        exact: false,
      },
    ],
  },

  // Custom admin meta
  meta: {
    titleSuffix: '- Lejel Deals Platform',
    favicon: '/favicon.ico',
  },

  // Custom admin styling
  css: `
    /* Custom admin styles */
    .payload-admin {
      --theme-elevation-0: #ffffff;
      --theme-elevation-50: #f9fafb;
      --theme-elevation-100: #f3f4f6;
      --theme-elevation-200: #e5e7eb;
      --theme-elevation-300: #d1d5db;
      --theme-elevation-400: #9ca3af;
      --theme-elevation-500: #6b7280;
      --theme-elevation-600: #4b5563;
      --theme-elevation-700: #374151;
      --theme-elevation-800: #1f2937;
      --theme-elevation-900: #111827;
      --theme-elevation-1000: #000000;
      
      --theme-success-50: #f0fdf4;
      --theme-success-100: #dcfce7;
      --theme-success-200: #bbf7d0;
      --theme-success-300: #86efac;
      --theme-success-400: #4ade80;
      --theme-success-500: #22c55e;
      --theme-success-600: #16a34a;
      --theme-success-700: #15803d;
      --theme-success-800: #166534;
      --theme-success-900: #14532d;
      
      --theme-warning-50: #fffbeb;
      --theme-warning-100: #fef3c7;
      --theme-warning-200: #fde68a;
      --theme-warning-300: #fcd34d;
      --theme-warning-400: #fbbf24;
      --theme-warning-500: #f59e0b;
      --theme-warning-600: #d97706;
      --theme-warning-700: #b45309;
      --theme-warning-800: #92400e;
      --theme-warning-900: #78350f;
      
      --theme-error-50: #fef2f2;
      --theme-error-100: #fee2e2;
      --theme-error-200: #fecaca;
      --theme-error-300: #fca5a5;
      --theme-error-400: #f87171;
      --theme-error-500: #ef4444;
      --theme-error-600: #dc2626;
      --theme-error-700: #b91c1c;
      --theme-error-800: #991b1b;
      --theme-error-900: #7f1d1d;
    }

    /* Custom dashboard styles */
    .custom-dashboard-view {
      background: var(--theme-elevation-50);
      min-height: 100vh;
    }

    /* Mobile optimization */
    @media (max-width: 768px) {
      .payload-admin .nav {
        padding: 0.5rem;
      }
      
      .payload-admin .nav__brand {
        font-size: 1.25rem;
      }
      
      .payload-admin .nav__link {
        font-size: 0.875rem;
        padding: 0.5rem;
      }
    }
  `,
}

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { ApplicationsPage } from '@/features/applications/pages/ApplicationsPage';
import { TestsPage } from '@/features/tests/pages/TestsPage';
import { ExperimentsPage } from '@/features/experiments/pages/ExperimentsPage';
import { FindingsPage } from '@/features/findings/pages/FindingsPage';
import { ReportsPage } from '@/features/reports/pages/ReportsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'applications',
        element: <ApplicationsPage />,
      },
      {
        path: 'tests',
        element: <TestsPage />,
      },
      {
        path: 'experiments',
        element: <ExperimentsPage />,
      },
      {
        path: 'findings',
        element: <FindingsPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);


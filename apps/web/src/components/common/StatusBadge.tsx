import React from 'react';
import { cn } from '@/lib/utils';
import { Severity, TestRunStatus, ExperimentRunStatus, ServiceStatus } from '@/types/contracts';

interface StatusBadgeProps {
  status: Severity | TestRunStatus | ExperimentRunStatus | ServiceStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getVariantClasses = (val: string) => {
    switch (val.toUpperCase()) {
      case 'CRITICAL':
      case 'FAILED':
      case 'UNHEALTHY':
      case 'REJECTED':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'HIGH':
      case 'DEGRADED':
      case 'ROLLING_BACK':
      case 'FAULT_INJECTING':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'MEDIUM':
      case 'OBSERVING':
      case 'INITIALIZING':
        return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
      case 'PASSED':
      case 'HEALTHY':
      case 'COMPLETED':
      case 'APPROVED':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'RUNNING':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30 animate-pulse';
      case 'PENDING':
      case 'PENDING_APPROVAL':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'LOW':
      case 'INFO':
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider',
        getVariantClasses(status),
        className
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
};


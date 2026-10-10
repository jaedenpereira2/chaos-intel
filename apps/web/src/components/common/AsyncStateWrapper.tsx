import React from 'react';
import { AlertTriangle, RefreshCw, Inbox } from 'lucide-react';

interface AsyncStateWrapperProps<T> {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  isStale?: boolean;
  isEmpty?: boolean;
  data?: T;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  loadingSkeleton?: React.ReactNode;
  children: (data: T) => React.ReactNode;
}

export function AsyncStateWrapper<T>({
  isLoading,
  isError,
  error,
  isStale,
  isEmpty,
  data,
  onRetry,
  emptyTitle = 'No data found',
  emptyDescription = 'There are no records available for this query.',
  loadingSkeleton,
  children,
}: AsyncStateWrapperProps<T>) {
  if (isLoading) {
    if (loadingSkeleton) return <>{loadingSkeleton}</>;
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-lg border border-border bg-card/50 p-8">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading technical telemetry...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-8 text-center">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <h3 className="text-base font-semibold text-destructive">Failed to load data</h3>
        <p className="max-w-md text-sm text-muted-foreground">
          {error?.message || 'An unexpected error occurred while communicating with the P3 API.'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        )}
      </div>
    );
  }

  if (isEmpty || !data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-lg border border-border border-dashed bg-card/30 p-8 text-center">
        <Inbox className="h-8 w-8 text-muted-foreground/60" />
        <h3 className="text-base font-semibold text-foreground">{emptyTitle}</h3>
        <p className="max-w-md text-sm text-muted-foreground">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {isStale && (
        <div className="mb-2 flex items-center justify-between rounded-md bg-accent/50 px-3 py-1.5 text-xs text-muted-foreground border border-border">
          <span>Displaying cached snapshot. Background synchronization in progress...</span>
          <RefreshCw className="h-3 w-3 animate-spin text-primary" />
        </div>
      )}
      {children(data)}
    </div>
  );
}


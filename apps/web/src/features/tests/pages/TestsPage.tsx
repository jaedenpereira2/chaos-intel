import React, { useState } from 'react';
import { Activity, Clock, AlertTriangle, FileCode, ExternalLink, ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDateTime, formatDurationMs } from '@/lib/utils';
import { TestRunItem } from '@/types/contracts';

const mockTestRuns: TestRunItem[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    applicationId: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    name: 'Cart Checkout Stress & Latency Validation',
    type: 'LOAD_K6',
    status: 'FAILED',
    startedAt: '2026-10-10T12:00:00.000Z',
    completedAt: '2026-10-10T12:04:15.000Z',
    durationMs: 255000,
    summary: {
      totalSteps: 12,
      passedSteps: 9,
      failedSteps: 3,
      skippedSteps: 0,
    },
    failedStepCount: 3,
    environment: 'staging-k8s',
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    applicationId: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    name: 'End-to-End User Order Journey',
    type: 'E2E_PLAYWRIGHT',
    status: 'PASSED',
    startedAt: '2026-10-10T11:15:00.000Z',
    completedAt: '2026-10-10T11:18:20.000Z',
    durationMs: 200000,
    summary: {
      totalSteps: 24,
      passedSteps: 24,
      failedSteps: 0,
      skippedSteps: 0,
    },
    failedStepCount: 0,
    environment: 'staging-k8s',
  },
  {
    id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    applicationId: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    name: 'Smoke Verification on Core Endpoints',
    type: 'SMOKE',
    status: 'PASSED',
    startedAt: '2026-10-10T10:30:00.000Z',
    completedAt: '2026-10-10T10:31:12.000Z',
    durationMs: 72000,
    summary: {
      totalSteps: 8,
      passedSteps: 8,
      failedSteps: 0,
      skippedSteps: 0,
    },
    failedStepCount: 0,
    environment: 'staging-k8s',
  },
];

export const TestsPage: React.FC = () => {
  const [selectedRun, setSelectedRun] = useState<TestRunItem>(mockTestRuns[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Test Execution & Verification</h2>
        <p className="text-xs text-muted-foreground">
          Review automated smoke, k6 load testing, and Playwright verification runs executed via P2 workers.
        </p>
      </div>

      {/* Test Runs Explorer Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-muted/40 px-4 py-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Executed Test Runs
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/20 text-[11px] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Run ID / Name</th>
                <th className="px-4 py-3 font-medium">Suite Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Timing & Duration</th>
                <th className="px-4 py-3 font-medium">Summary (Passed / Failed)</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono">
              {mockTestRuns.map((run) => (
                <tr
                  key={run.id}
                  onClick={() => setSelectedRun(run)}
                  className={`cursor-pointer transition-colors hover:bg-muted/30 ${
                    selectedRun.id === run.id ? 'bg-primary/5' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <p className="font-sans font-medium text-foreground text-xs">{run.name}</p>
                    <p className="text-[10px] text-muted-foreground">{run.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-accent px-2 py-0.5 text-[11px] text-foreground">
                      {run.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={run.status} />
                  </td>
                  <td className="px-4 py-3 text-[11px]">
                    <p>{formatDateTime(run.startedAt)}</p>
                    <p className="text-muted-foreground">{formatDurationMs(run.durationMs || 0)}</p>
                  </td>
                  <td className="px-4 py-3 text-[11px]">
                    <span>{run.summary?.passedSteps} passed</span>
                    {run.summary && run.summary.failedSteps > 0 && (
                      <span className="ml-2 font-bold text-red-400">
                        · {run.summary.failedSteps} failed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-primary hover:underline font-sans text-xs">
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Test Run Detail & Evidence Section */}
      {selectedRun && (
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Run Details: {selectedRun.name}
              </h3>
              <p className="text-[11px] text-muted-foreground font-mono">UUID: {selectedRun.id}</p>
            </div>
            <StatusBadge status={selectedRun.status} />
          </div>

          {selectedRun.status === 'FAILED' ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded border border-red-500/30 bg-red-500/10 p-3">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-red-400">Failed Step: POST /api/checkout/submit</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    HTTP 504 Gateway Timeout observed after 15,000ms. Upstream inventory reservation worker unresponsive.
                  </p>
                </div>
              </div>

              {/* Evidence Section */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-foreground">Attached Execution Evidence</span>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded border border-border bg-background p-3">
                    <span className="text-[11px] font-mono text-primary">k6 Summary Telemetry Dump</span>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      p99 latency reached 14,890ms. 42% HTTP 5xx responses.
                    </p>
                  </div>
                  <div className="rounded border border-border bg-background p-3">
                    <span className="text-[11px] font-mono text-primary">Service Container Error Log</span>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      ConnectionPoolTimeoutException: Timeout waiting for connection from pool.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
              All 24 test assertions passed within nominal thresholds. Zero resilience regressions found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};


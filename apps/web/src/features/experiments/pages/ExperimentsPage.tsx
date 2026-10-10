import React, { useState } from 'react';
import {
  FlaskConical,
  ShieldAlert,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  ChevronRight,
  Info
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ExperimentRunItem } from '@/types/contracts';

export const ExperimentsPage: React.FC = () => {
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [activeExperiment, setActiveExperiment] = useState<ExperimentRunItem>({
    id: 'e28b8a07-88d4-4a46-81c4-2795d2cb3781',
    experimentId: 'exp-template-001',
    applicationId: 'app-ecommerce-core',
    status: 'OBSERVING',
    approvalStatus: {
      isApproved: true,
      approvedBy: 'lead-sre@company.internal',
      approvedAt: '2026-10-10T12:30:00.000Z',
      backendAuthorizationToken: 'auth-token-verified-p3',
    },
    targetService: {
      id: 's-003',
      name: 'Auth Service',
    },
    timeline: [
      {
        timestamp: '2026-10-10T12:30:00.000Z',
        phase: 'PRE_CHECK',
        message: 'Pre-flight health check passed. Baseline latency: 18ms.',
      },
      {
        timestamp: '2026-10-10T12:30:15.000Z',
        phase: 'FAULT_INJECTION',
        message: 'Pumba injected 250ms synthetic latency on eth0.',
      },
      {
        timestamp: '2026-10-10T12:31:00.000Z',
        phase: 'OBSERVING',
        message: 'Observing gateway response times and downstream circuit breaker trips.',
      },
    ],
    outcome: {
      resilienceVerified: false,
      unhandledFailureDetected: true,
      findingsGeneratedCount: 1,
      findingIds: ['f-cascading-001'],
      summary: 'Circuit breaker failed to trip within 300ms SLA, causing 504 cascades.',
    },
    rollback: {
      triggered: false,
      completed: false,
    },
    startedAt: '2026-10-10T12:30:00.000Z',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Chaos Experimentation Control</h2>
          <p className="text-xs text-muted-foreground">
            Plan, authorize, and observe controlled failure injection experiments via P2 workers.
          </p>
        </div>

        <button
          onClick={() => setShowApprovalModal(true)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Play className="h-3.5 w-3.5" />
          Launch New Experiment
        </button>
      </div>

      {/* Safety Notice Banner (Section 6) */}
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card/60 p-4 text-xs text-muted-foreground">
        <Info className="h-4 w-4 text-primary shrink-0" />
        <span>
          <strong>Architecture Rule:</strong> Warnings and approval dialogues in this UI are UX safety controls.
          The backend authorization engine (P3) enforces the true security perimeter and blast radius boundaries.
        </span>
      </div>

      {/* Active Experiment Run Execution View */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold text-foreground">
                Target: {activeExperiment.targetService?.name}
              </h3>
              <StatusBadge status={activeExperiment.status} />
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              Run ID: {activeExperiment.id} · Approved by {activeExperiment.approvalStatus.approvedBy}
            </p>
          </div>

          <button className="inline-flex items-center gap-1.5 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20">
            <RotateCcw className="h-3.5 w-3.5" />
            Emergency Rollback
          </button>
        </div>

        {/* Experiment Configuration Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded border border-border bg-background p-3 text-xs">
            <span className="text-[11px] text-muted-foreground">Fault Injected</span>
            <p className="font-semibold text-foreground mt-0.5">NETWORK_LATENCY</p>
            <p className="text-[10px] text-muted-foreground font-mono">250ms (jitter ±20ms)</p>
          </div>

          <div className="rounded border border-border bg-background p-3 text-xs">
            <span className="text-[11px] text-muted-foreground">Blast Radius Scope</span>
            <p className="font-semibold text-amber-400 mt-0.5">TIER_2_DOWNSTREAM</p>
            <p className="text-[10px] text-muted-foreground">2 downstream services affected</p>
          </div>

          <div className="rounded border border-border bg-background p-3 text-xs">
            <span className="text-[11px] text-muted-foreground">Rollback Safety Guard</span>
            <p className="font-semibold text-emerald-400 mt-0.5">AUTO_ROLLBACK_ENABLED</p>
            <p className="text-[10px] text-muted-foreground">Timeout: 300s limit</p>
          </div>

          <div className="rounded border border-border bg-background p-3 text-xs">
            <span className="text-[11px] text-muted-foreground">Backend Auth State</span>
            <p className="font-semibold text-emerald-400 mt-0.5">TOKEN_VALIDATED</p>
            <p className="text-[10px] text-muted-foreground font-mono">p3-signature-verified</p>
          </div>
        </div>

        {/* Live Execution Timeline (SSE / Polling) */}
        <div>
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Live Execution Timeline (Polling / SSE)
          </h4>
          <div className="mt-3 space-y-3 font-mono text-xs">
            {activeExperiment.timeline?.map((item, index) => (
              <div key={index} className="flex items-start gap-3 rounded border border-border/70 bg-background/40 p-3">
                <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">[{item.phase}]</span>
                    <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
                  </div>
                  <p className="mt-1 text-muted-foreground font-sans text-xs">{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pre-flight Safety & Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-foreground">Authorize Chaos Injection</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Confirm fault injection parameters and acknowledge blast radius impact.
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
              <p>
                <strong>Target:</strong> payment-service (Production-Simulated)
              </p>
              <p>
                <strong>Fault:</strong> 50% Packet Loss for 120 seconds
              </p>
              <p>
                <strong>Blast Radius:</strong> Potentially impacts checkout-api and notification-worker.
              </p>
              <p className="text-[11px] text-muted-foreground">
                * Note: Backend authorization must approve this request before workers execute Pumba.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="rounded-md border border-border bg-secondary px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/80"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="rounded-md bg-destructive px-3.5 py-1.5 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90"
              >
                Authorize & Dispatch Run
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


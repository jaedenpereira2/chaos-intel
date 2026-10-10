import React from 'react';
import { ShieldAlert, Activity, CheckCircle2, FlaskConical, Layers, ArrowUpRight } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Resilience Command Center</h2>
        <p className="text-xs text-muted-foreground">
          Autonomous failure discovery overview, system health metrics, and active chaos runs.
        </p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Overall Resilience Score</span>
            <ShieldAlert className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">84.2</span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">Grade: A- · 3 critical discoveries mitigated</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Monitored Applications</span>
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-foreground">12</span>
            <span className="text-xs text-muted-foreground">apps</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">48 microservices across clusters</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Active Test & Chaos Runs</span>
            <Activity className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-blue-400">3</span>
            <span className="text-xs text-muted-foreground">in progress</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">2 k6 load tests, 1 latency injection</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Critical Open Findings</span>
            <ShieldAlert className="h-4 w-4 text-red-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-red-400">2</span>
            <span className="text-xs text-muted-foreground">unresolved</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">Cascading timeout & missing breaker</p>
        </div>
      </div>

      {/* Grid: Critical Findings & Recent Experiments */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Critical Findings Panel */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Critical Resilience Vulnerabilities</h3>
              <p className="text-[11px] text-muted-foreground">Unresolved failure risks discovered by P3 analysis</p>
            </div>
            <a href="/findings" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="mt-3 space-y-3">
            <div className="rounded border border-border/80 bg-background/50 p-3">
              <div className="flex items-center justify-between">
                <StatusBadge status="CRITICAL" />
                <span className="text-[11px] text-muted-foreground font-mono">auth-service</span>
              </div>
              <h4 className="mt-1.5 text-xs font-semibold text-foreground">
                Cascading Timeout Failure under 250ms Token Verification Latency
              </h4>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Observed downstream retry storm leading to Redis connection pool exhaustion.
              </p>
            </div>

            <div className="rounded border border-border/80 bg-background/50 p-3">
              <div className="flex items-center justify-between">
                <StatusBadge status="HIGH" />
                <span className="text-[11px] text-muted-foreground font-mono">billing-api</span>
              </div>
              <h4 className="mt-1.5 text-xs font-semibold text-foreground">
                Missing Circuit Breaker on Third-Party Payment Gateway
              </h4>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Payment worker threads blocked indefinitely when upstream HTTP socket hung.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Experiments Panel */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Recent Chaos Experiments</h3>
              <p className="text-[11px] text-muted-foreground">Executed failure injections and rollback verifications</p>
            </div>
            <a href="/experiments" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between rounded border border-border/80 bg-background/50 p-3">
              <div className="flex items-start gap-3">
                <FlaskConical className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-foreground">order-service: 15% Packet Loss</h4>
                  <p className="text-[11px] text-muted-foreground">Target: order-service-pod-0 · Pumba Injection</p>
                </div>
              </div>
              <div className="text-right">
                <StatusBadge status="COMPLETED" />
                <p className="mt-1 text-[10px] text-muted-foreground font-mono">Rollback Verified</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded border border-border/80 bg-background/50 p-3">
              <div className="flex items-start gap-3">
                <FlaskConical className="mt-0.5 h-4 w-4 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-foreground">inventory-db: Connection Limit Throttle</h4>
                  <p className="text-[11px] text-muted-foreground">Target: postgres-inventory · Stress Injected</p>
                </div>
              </div>
              <div className="text-right">
                <StatusBadge status="FAULT_INJECTING" />
                <p className="mt-1 text-[10px] text-muted-foreground font-mono">Phase 2/4</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


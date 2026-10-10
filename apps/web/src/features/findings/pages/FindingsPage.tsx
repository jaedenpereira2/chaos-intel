import React, { useState } from 'react';
import {
  AlertOctagon,
  Filter,
  Search,
  ExternalLink,
  Terminal,
  FileImage,
  LineChart,
  GitCommit,
  CheckCircle2,
  X
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { FindingItem, Severity } from '@/types/contracts';

const mockFindings: FindingItem[] = [
  {
    id: 'f-cascading-001',
    projectId: 'p-001',
    applicationId: 'app-ecommerce-core',
    serviceId: 's-003',
    serviceName: 'Auth Service',
    title: 'Cascading Timeout & Thread Exhaustion under Upstream Latency',
    severity: 'CRITICAL',
    category: 'CASCADING_FAILURE',
    status: 'OPEN',
    observedBehavior:
      'When 250ms synthetic latency was injected into Auth Service, API Gateway threads saturated within 12 seconds, causing 100% of concurrent storefront requests to fail with HTTP 504 Gateway Timeout.',
    timeline: [
      { timestamp: '12:30:15', description: 'Fault injected (250ms network delay)' },
      { timestamp: '12:30:27', description: 'API Gateway connection pool at 100% capacity' },
      { timestamp: '12:30:30', description: 'Storefront requests failing with 504' },
      { timestamp: '12:31:00', description: 'Fault stopped, recovery completed after 45s' },
    ],
    probableRootCause:
      'Missing circuit breaker pattern and unbounded synchronous client timeout (default 30s) between API Gateway and Auth Service.',
    confidence: 0.94,
    impact: 'System-wide outage affecting all unauthenticated and authenticated users.',
    recovery: '45 seconds after fault removal, requiring TCP connection pool reset.',
    recommendationId: 'rec-001',
    experimentRunId: 'e28b8a07-88d4-4a46-81c4-2795d2cb3781',
    evidence: [
      {
        id: 'ev-1',
        type: 'LOG',
        title: 'API Gateway Thread Dump',
        url: 'https://storage.chaos-intel.io/logs/gateway-thread-dump.log',
      },
      {
        id: 'ev-2',
        type: 'METRIC',
        title: 'Active Connection Saturation Chart',
        url: 'https://storage.chaos-intel.io/metrics/conn-pool-saturation.json',
      },
      {
        id: 'ev-3',
        type: 'TRACE',
        title: 'OpenTelemetry Distributed Trace',
        url: 'https://storage.chaos-intel.io/traces/trace-span-504.json',
      },
    ],
    createdAt: '2026-10-10T12:32:00.000Z',
    updatedAt: '2026-10-10T12:32:00.000Z',
  },
  {
    id: 'f-breaker-002',
    projectId: 'p-001',
    applicationId: 'app-ecommerce-core',
    serviceId: 's-004',
    serviceName: 'Order Service',
    title: 'Missing Fallback on Third-Party Payment Gateway Outage',
    severity: 'HIGH',
    category: 'CIRCUIT_BREAKER_MISSING',
    status: 'OPEN',
    observedBehavior:
      'Payment service threw unhandled SocketTimeoutException on payment gateway simulation, locking cart checkout database transactions.',
    timeline: [
      { timestamp: '11:15:00', description: 'Packet loss injected on payment gateway port' },
      { timestamp: '11:15:30', description: 'Postgres transaction lock contention spiked' },
    ],
    probableRootCause:
      'Synchronous payment verification executed within active Postgres database transaction block without fallback handler.',
    confidence: 0.89,
    impact: 'Order checkout locks, preventing other customers from completing purchases.',
    recovery: 'Manual container restart required.',
    recommendationId: 'rec-002',
    evidence: [
      {
        id: 'ev-4',
        type: 'SCREENSHOT',
        title: 'User Checkout Error Screen',
        url: 'https://storage.chaos-intel.io/screenshots/checkout-error.png',
      },
    ],
    createdAt: '2026-10-10T11:16:00.000Z',
    updatedAt: '2026-10-10T11:16:00.000Z',
  },
];

export const FindingsPage: React.FC = () => {
  const [selectedFinding, setSelectedFinding] = useState<FindingItem>(mockFindings[0]);
  const [activeEvidenceTab, setActiveEvidenceTab] = useState<'LOG' | 'METRIC' | 'TRACE' | 'SCREENSHOT'>('LOG');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const filteredFindings = mockFindings.filter((f) =>
    severityFilter === 'ALL' ? true : f.severity === severityFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Findings & Root Cause Analysis (RCA)</h2>
        <p className="text-xs text-muted-foreground">
          Evidence-grounded vulnerability discoveries, root causes, AI confidence, and remediation recommendations.
        </p>
      </div>

      {/* Multi-Dimensional Filter Bar (Section 7) */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="h-3.5 w-3.5" />
          <span className="font-semibold uppercase tracking-wider text-[11px]">Filters:</span>
        </div>

        {/* Severity Filter */}
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="rounded border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical Only</option>
          <option value="HIGH">High Only</option>
          <option value="MEDIUM">Medium Only</option>
          <option value="LOW">Low Only</option>
        </select>

        {/* Category Filter */}
        <select className="rounded border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none">
          <option>All Categories</option>
          <option>Cascading Failure</option>
          <option>Circuit Breaker Missing</option>
          <option>Timeout Misconfiguration</option>
        </select>

        {/* Service Filter */}
        <select className="rounded border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none">
          <option>All Services</option>
          <option>Auth Service</option>
          <option>Order Service</option>
          <option>API Gateway</option>
        </select>

        {/* Status Filter */}
        <select className="rounded border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none">
          <option>All Statuses</option>
          <option>Open</option>
          <option>Investigating</option>
          <option>Resolved</option>
        </select>
      </div>

      {/* Main Grid: Findings List + Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Findings Table */}
        <div className="lg:col-span-5 rounded-lg border border-border bg-card overflow-hidden">
          <div className="border-b border-border bg-muted/40 px-4 py-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Discovered Findings ({filteredFindings.length})
            </h3>
          </div>

          <div className="divide-y divide-border">
            {filteredFindings.map((finding) => (
              <div
                key={finding.id}
                onClick={() => setSelectedFinding(finding)}
                className={`cursor-pointer p-4 transition-colors hover:bg-muted/30 ${
                  selectedFinding.id === finding.id ? 'bg-primary/10 border-l-2 border-l-primary' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <StatusBadge status={finding.severity} />
                  <span className="text-[11px] font-mono text-muted-foreground">{finding.serviceName}</span>
                </div>
                <h4 className="mt-2 text-xs font-semibold text-foreground leading-snug">{finding.title}</h4>
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-mono">{finding.category}</span>
                  <span className="font-mono text-primary">
                    Confidence: {(finding.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Finding Deep Inspection & Evidence Viewer */}
        {selectedFinding && (
          <div className="lg:col-span-7 rounded-lg border border-border bg-card p-6 space-y-5">
            {/* Finding Header */}
            <div className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedFinding.severity} />
                <span className="text-xs font-mono text-muted-foreground">ID: {selectedFinding.id}</span>
              </div>
              <h3 className="mt-2 text-base font-bold text-foreground">{selectedFinding.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Affected Service: <strong className="text-foreground">{selectedFinding.serviceName}</strong> ·
                Confidence Score: <strong className="text-primary font-mono">{(selectedFinding.confidence * 100).toFixed(0)}%</strong>
              </p>
            </div>

            {/* Observed Behavior vs Expected Baseline */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Observed Failure Behavior</h4>
              <p className="rounded border border-border bg-background p-3 text-xs text-muted-foreground leading-relaxed">
                {selectedFinding.observedBehavior}
              </p>
            </div>

            {/* Probable Root Cause (RCA) */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Probable Root Cause Analysis (RCA Engine)
              </h4>
              <div className="rounded border border-primary/30 bg-primary/10 p-3 text-xs text-foreground leading-relaxed">
                {selectedFinding.probableRootCause}
              </div>
            </div>

            {/* Impact & Recovery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground font-semibold uppercase">Blast Radius Impact</span>
                <p className="mt-1 text-foreground">{selectedFinding.impact}</p>
              </div>
              <div className="rounded border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground font-semibold uppercase">System Recovery</span>
                <p className="mt-1 text-foreground">{selectedFinding.recovery}</p>
              </div>
            </div>

            {/* Multi-Modal Evidence Viewer (Section 7) */}
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Diagnostic Evidence Assets
                </h4>
                <span className="text-[10px] text-muted-foreground font-mono">Object Storage Resolved</span>
              </div>

              <div className="flex items-center gap-2 border-b border-border pb-2 text-xs">
                <button
                  onClick={() => setActiveEvidenceTab('LOG')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium ${
                    activeEvidenceTab === 'LOG' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5" /> Logs
                </button>
                <button
                  onClick={() => setActiveEvidenceTab('METRIC')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium ${
                    activeEvidenceTab === 'METRIC' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <LineChart className="h-3.5 w-3.5" /> Metrics
                </button>
                <button
                  onClick={() => setActiveEvidenceTab('TRACE')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium ${
                    activeEvidenceTab === 'TRACE' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <GitCommit className="h-3.5 w-3.5" /> Traces
                </button>
                <button
                  onClick={() => setActiveEvidenceTab('SCREENSHOT')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium ${
                    activeEvidenceTab === 'SCREENSHOT' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <FileImage className="h-3.5 w-3.5" /> Screenshots
                </button>
              </div>

              {/* Evidence Content Preview */}
              <div className="rounded border border-border bg-background p-4 font-mono text-xs">
                {activeEvidenceTab === 'LOG' && (
                  <div className="text-muted-foreground space-y-1">
                    <p className="text-red-400">[2026-10-10T12:30:27Z] ERROR org.chaos.gateway.ClientPool - Pool exhausted.</p>
                    <p>[2026-10-10T12:30:28Z] WARN - Active worker count: 200/200 max saturation.</p>
                    <p className="text-amber-400">[2026-10-10T12:30:29Z] HTTP 504 Gateway Timeout dispatched to client #1491.</p>
                  </div>
                )}
                {activeEvidenceTab === 'METRIC' && (
                  <p className="text-muted-foreground">
                    Telemetry Stream: Connection pool active threads spiked from 8 to 200 (+2400%) in 4,200ms.
                  </p>
                )}
                {activeEvidenceTab === 'TRACE' && (
                  <p className="text-muted-foreground">
                    Trace ID: 4bf92f3577b34da6a3ce929d0e0e4736 · Span: gateway.forward &rarr; auth.verify (Duration: 30,000ms TIMEOUT)
                  </p>
                )}
                {activeEvidenceTab === 'SCREENSHOT' && (
                  <p className="text-muted-foreground">
                    Screenshot: Stored in object storage bucket `chaos-artifacts/screenshots/checkout-error.png`.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


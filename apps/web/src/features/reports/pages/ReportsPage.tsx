import React from 'react';
import { FileText, Download, Printer, ShieldCheck, CheckCircle2, AlertTriangle, ArrowDownToLine } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ReportItem } from '@/types/contracts';

const mockReport: ReportItem = {
  id: 'rep-ecommerce-2026-10-10',
  applicationId: 'app-ecommerce-core',
  title: 'Autonomous Resilience & Failure Discovery Audit Report',
  generatedAt: '2026-10-10T13:00:00.000Z',
  executiveSummary: {
    resilienceScore: 84.2,
    grade: 'A',
    totalExperiments: 8,
    criticalFindingsCount: 2,
    overviewText:
      'The application demonstrates strong self-healing capabilities against single-pod crashes and Redis connection drops. However, severe cascading timeout vulnerabilities were identified between API Gateway and Auth Service under sustained network latency.',
    meanTimeToRecoverySec: 45.0,
  },
  technicalFindings: [
    {
      findingId: 'f-cascading-001',
      title: 'Cascading Timeout & Thread Exhaustion under Upstream Latency',
      severity: 'CRITICAL',
      serviceName: 'Auth Service',
      rootCauseSummary: 'Missing circuit breaker pattern and unbounded synchronous client timeout.',
    },
    {
      findingId: 'f-breaker-002',
      title: 'Missing Fallback on Third-Party Payment Gateway Outage',
      severity: 'HIGH',
      serviceName: 'Order Service',
      rootCauseSummary: 'Synchronous payment verification within active database transaction block.',
    },
  ],
  experimentHistory: [
    {
      experimentRunId: 'e28b8a07-88d4-4a46-81c4-2795d2cb3781',
      targetService: 'Auth Service',
      faultType: 'NETWORK_LATENCY',
      outcomeStatus: 'FAILED',
      passed: false,
      blastRadiusContained: false,
    },
    {
      experimentRunId: 'e99b1a02-1234-4a46-81c4-2795d2cb9999',
      targetService: 'Session Cache',
      faultType: 'PROCESS_KILL',
      outcomeStatus: 'COMPLETED',
      passed: true,
      blastRadiusContained: true,
    },
  ],
  recommendations: [
    {
      recommendationId: 'rec-001',
      findingId: 'f-cascading-001',
      title: 'Configure Resilience4j / Envoy Circuit Breaker with 2000ms Cutoff',
      priority: 'P0',
      estimatedEffort: 'LOW',
    },
    {
      recommendationId: 'rec-002',
      findingId: 'f-breaker-002',
      title: 'Decouple Payment Authorization from Main DB Transaction via Outbox Queue',
      priority: 'P1',
      estimatedEffort: 'MEDIUM',
    },
  ],
};

export const ReportsPage: React.FC = () => {
  const handlePrintPdf = () => {
    window.print();
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(mockReport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chaos-intel-report-${mockReport.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const headers = ['Finding ID', 'Severity', 'Service', 'Title', 'Root Cause'];
    const rows = mockReport.technicalFindings.map((f) => [
      f.findingId,
      f.severity,
      f.serviceName,
      `"${f.title.replace(/"/g, '""')}"`,
      `"${(f.rootCauseSummary || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chaos-intel-findings-${mockReport.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header and Export Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Resilience Reports & Audits</h2>
          <p className="text-xs text-muted-foreground">
            Backend-provided synthesis (P3) referencing canonical Finding, Experiment, and Recommendation IDs.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={handlePrintPdf}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
          >
            <Printer className="h-3.5 w-3.5" />
            Print / PDF Export
          </button>
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
          <button
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <ArrowDownToLine className="h-3.5 w-3.5" />
            Export JSON Schema
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="rounded-lg border border-border bg-card p-8 space-y-8 shadow-sm">
        {/* Report Title & Meta */}
        <div className="border-b border-border pb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Audit Report ID: {mockReport.id}
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              Generated: {mockReport.generatedAt}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-foreground">{mockReport.title}</h1>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-2">
            1. Executive Resilience Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="rounded border border-border bg-background p-4 text-center">
              <span className="text-xs text-muted-foreground">Resilience Score</span>
              <p className="text-3xl font-bold font-mono text-emerald-400 mt-1">
                {mockReport.executiveSummary.resilienceScore}
              </p>
            </div>
            <div className="rounded border border-border bg-background p-4 text-center">
              <span className="text-xs text-muted-foreground">Letter Grade</span>
              <p className="text-3xl font-bold font-mono text-foreground mt-1">
                {mockReport.executiveSummary.grade}
              </p>
            </div>
            <div className="rounded border border-border bg-background p-4 text-center">
              <span className="text-xs text-muted-foreground">Experiments Executed</span>
              <p className="text-3xl font-bold font-mono text-foreground mt-1">
                {mockReport.executiveSummary.totalExperiments}
              </p>
            </div>
            <div className="rounded border border-border bg-background p-4 text-center">
              <span className="text-xs text-muted-foreground">Mean Time to Recovery</span>
              <p className="text-3xl font-bold font-mono text-primary mt-1">
                {mockReport.executiveSummary.meanTimeToRecoverySec}s
              </p>
            </div>
          </div>
          <p className="rounded border border-border bg-background/60 p-4 text-xs text-muted-foreground leading-relaxed">
            {mockReport.executiveSummary.overviewText}
          </p>
        </div>

        {/* Section 2: Technical Findings Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-2">
            2. Technical Findings Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/20 text-[11px] text-muted-foreground font-mono">
                <tr>
                  <th className="px-4 py-2 font-medium">Finding ID</th>
                  <th className="px-4 py-2 font-medium">Severity</th>
                  <th className="px-4 py-2 font-medium">Service</th>
                  <th className="px-4 py-2 font-medium">Vulnerability Title</th>
                  <th className="px-4 py-2 font-medium">Root Cause Deduction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockReport.technicalFindings.map((tf) => (
                  <tr key={tf.findingId}>
                    <td className="px-4 py-3 font-mono text-[11px] text-primary">{tf.findingId}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={tf.severity} />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{tf.serviceName}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">{tf.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{tf.rootCauseSummary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Prioritized Recommendations */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-2">
            3. Prioritized Architectural Recommendations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockReport.recommendations.map((rec) => (
              <div key={rec.recommendationId} className="rounded border border-border bg-background p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 text-[10px] font-bold font-mono">
                    Priority: {rec.priority}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Effort: {rec.estimatedEffort}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-foreground">{rec.title}</h4>
                <p className="text-[11px] font-mono text-muted-foreground">
                  Linked Finding: {rec.findingId}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


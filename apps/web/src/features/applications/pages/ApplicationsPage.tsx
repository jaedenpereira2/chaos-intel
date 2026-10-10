import React from 'react';
import { ArchitectureGraph } from '../components/ArchitectureGraph';
import { Layers, ShieldCheck, Cpu, HardDrive } from 'lucide-react';

export const ApplicationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Application Intelligence</h2>
          <p className="text-xs text-muted-foreground">
            Canonical topology discovery (P1) mapped with real-time health, risk levels, and failure metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-secondary px-2.5 py-1 text-xs font-mono text-muted-foreground">
            App ID: app-ecommerce-core
          </span>
        </div>
      </div>

      {/* Tech Stack & Risk Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <span className="text-[11px] font-medium text-muted-foreground">Application Stack</span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {['React', 'Node.js', 'FastAPI', 'PostgreSQL', 'Redis', 'Kafka'].map((tech) => (
              <span key={tech} className="rounded bg-accent/60 px-2 py-0.5 text-xs font-mono text-foreground">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <span className="text-[11px] font-medium text-muted-foreground">Discovered Topology</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-foreground">6</span>
            <span className="text-xs text-muted-foreground">nodes · 5 active edges</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">Canonical P1 graph schema rendered directly</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <span className="text-[11px] font-medium text-muted-foreground">Resilience Risk Assessment</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400">MODERATE</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">Vulnerable to session cache latency spikes</p>
        </div>
      </div>

      {/* React Flow Architecture Visualization Canvas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Canonical Architecture Graph</h3>
          <span className="text-[11px] text-muted-foreground font-mono">
            Click any node to view service metadata, dependencies & recent failures
          </span>
        </div>
        <ArchitectureGraph />
      </div>
    </div>
  );
};


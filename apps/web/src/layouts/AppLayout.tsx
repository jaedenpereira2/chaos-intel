import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  FlaskConical,
  Activity,
  AlertOctagon,
  FileText,
  ShieldCheck,
  Server
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Applications', path: '/applications', icon: Layers },
  { name: 'Tests', path: '/tests', icon: Activity },
  { name: 'Chaos Experiments', path: '/experiments', icon: FlaskConical },
  { name: 'Findings & RCA', path: '/findings', icon: AlertOctagon },
  { name: 'Reports', path: '/reports', icon: FileText },
];

export const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-border bg-card/60 flex flex-col shrink-0">
        <div className="flex h-16 items-center gap-3 px-6 border-b border-border">
          <ShieldCheck className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-sm font-bold tracking-wider uppercase text-foreground">CHAOS-INTEL</h1>
            <p className="text-[10px] text-muted-foreground font-mono">Control Center · P4</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Server className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-mono text-[11px]">P3 API: Connected</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card/30 px-8">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
              Workspace / Production
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Engine Online
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};


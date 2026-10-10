import React, { useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from '@xyflow/react';
import { Database, HardDrive, Layers, Globe, Radio, ExternalLink, X, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ServiceItem, NodeType } from '@/types/contracts';

// Custom node rendering for canonical node types
const CustomServiceNode = ({ data }: { data: any }) => {
  const getIcon = (type: NodeType) => {
    switch (type) {
      case 'database':
        return <Database className="h-4 w-4 text-emerald-400" />;
      case 'cache':
        return <HardDrive className="h-4 w-4 text-amber-400" />;
      case 'queue':
        return <Radio className="h-4 w-4 text-purple-400" />;
      case 'frontend':
        return <Globe className="h-4 w-4 text-blue-400" />;
      case 'external dependency':
        return <ExternalLink className="h-4 w-4 text-rose-400" />;
      case 'service':
      default:
        return <Layers className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="rounded-md border border-border bg-card/90 px-3 py-2 shadow-md hover:border-primary transition-colors min-w-[150px]">
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      <div className="flex items-center gap-2">
        {getIcon(data.nodeType)}
        <div className="overflow-hidden">
          <p className="text-xs font-semibold text-foreground truncate">{data.label}</p>
          <span className="text-[10px] text-muted-foreground uppercase font-mono">{data.nodeType}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </div>
  );
};

const nodeTypes = {
  customService: CustomServiceNode,
};

// Initial canonical graph layout provided by P1 via P3 API
const initialNodes: Node[] = [
  {
    id: 'node-ui',
    type: 'customService',
    position: { x: 250, y: 0 },
    data: {
      label: 'Storefront Web UI',
      nodeType: 'frontend',
      status: 'HEALTHY',
      serviceId: 's-001',
      version: 'v2.4.1',
      failures: 0,
    },
  },
  {
    id: 'node-gateway',
    type: 'customService',
    position: { x: 250, y: 100 },
    data: {
      label: 'API Gateway',
      nodeType: 'service',
      status: 'HEALTHY',
      serviceId: 's-002',
      version: 'v1.12.0',
      failures: 1,
    },
  },
  {
    id: 'node-auth',
    type: 'customService',
    position: { x: 100, y: 220 },
    data: {
      label: 'Auth Service',
      nodeType: 'service',
      status: 'DEGRADED',
      serviceId: 's-003',
      version: 'v3.0.4',
      failures: 5,
    },
  },
  {
    id: 'node-order',
    type: 'customService',
    position: { x: 400, y: 220 },
    data: {
      label: 'Order Service',
      nodeType: 'service',
      status: 'HEALTHY',
      serviceId: 's-004',
      version: 'v2.1.0',
      failures: 0,
    },
  },
  {
    id: 'node-redis',
    type: 'customService',
    position: { x: 100, y: 340 },
    data: {
      label: 'Session Cache',
      nodeType: 'cache',
      status: 'HEALTHY',
      serviceId: 's-005',
      version: '7.2',
      failures: 0,
    },
  },
  {
    id: 'node-db',
    type: 'customService',
    position: { x: 400, y: 340 },
    data: {
      label: 'PostgreSQL Orders',
      nodeType: 'database',
      status: 'HEALTHY',
      serviceId: 's-006',
      version: '15.4',
      failures: 2,
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'node-ui', target: 'node-gateway', label: 'HTTP (1.0)', animated: true },
  { id: 'e2', source: 'node-gateway', target: 'node-auth', label: 'gRPC (0.95)' },
  { id: 'e3', source: 'node-gateway', target: 'node-order', label: 'HTTP (0.98)' },
  { id: 'e4', source: 'node-auth', target: 'node-redis', label: 'CACHE_CLIENT' },
  { id: 'e5', source: 'node-order', target: 'node-db', label: 'DATABASE_CLIENT' },
];

export const ArchitectureGraph: React.FC = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data);
  };

  return (
    <div className="relative h-[600px] w-full rounded-lg border border-border bg-card/40 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background gap={16} size={1} color="#334155" />
        <Controls className="!bg-card !border-border" />
        <MiniMap
          nodeColor="#3b82f6"
          maskColor="rgba(15, 23, 42, 0.7)"
          className="!bg-card !border-border"
        />
      </ReactFlow>

      {/* Node Details Inspection Drawer (Section 5) */}
      {selectedNode && (
        <div className="absolute right-0 top-0 h-full w-80 border-l border-border bg-card/95 p-5 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-bold text-foreground truncate">{selectedNode.label}</h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 space-y-4 text-xs">
            <div>
              <span className="text-[11px] text-muted-foreground">Status</span>
              <div className="mt-1">
                <StatusBadge status={selectedNode.status} />
              </div>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground">Canonical Type</span>
              <p className="mt-0.5 font-mono uppercase text-foreground">{selectedNode.nodeType}</p>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground">Version</span>
              <p className="mt-0.5 font-mono text-foreground">{selectedNode.version}</p>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground">Recent Failures</span>
              <div className="mt-1 flex items-center gap-2">
                {selectedNode.failures > 0 ? (
                  <span className="flex items-center gap-1 font-semibold text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {selectedNode.failures} failures recorded
                  </span>
                ) : (
                  <span className="text-emerald-400">0 recent failures</span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <span className="text-[11px] text-muted-foreground">Target Service Actions</span>
              <div className="mt-2 space-y-2">
                <a
                  href="/experiments"
                  className="block w-full text-center rounded bg-primary/20 border border-primary/40 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/30"
                >
                  Configure Chaos Injections
                </a>
                <a
                  href="/findings"
                  className="block w-full text-center rounded bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80"
                >
                  View Related Findings
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


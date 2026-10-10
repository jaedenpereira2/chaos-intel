/**
 * TypeScript contract interfaces mapped from packages/schemas/
 * Rules:
 * - UUIDs consistently
 * - ISO-8601 UTC timestamps
 * - Shared enums for statuses / severity (never invent local spellings)
 */

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type NodeType =
  | 'frontend'
  | 'service'
  | 'database'
  | 'cache'
  | 'queue'
  | 'external dependency';

export type DependencyType =
  | 'HTTP'
  | 'gRPC'
  | 'TCP'
  | 'AMQP'
  | 'DATABASE_CLIENT'
  | 'CACHE_CLIENT'
  | 'EXTERNAL_API';

export type ServiceStatus = 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' | 'UNKNOWN';

export type TestRunType =
  | 'SMOKE'
  | 'INTEGRATION'
  | 'LOAD_K6'
  | 'E2E_PLAYWRIGHT'
  | 'RESILIENCE_VALIDATION';

export type TestRunStatus = 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED' | 'ABORTED';

export type ExperimentFaultType =
  | 'NETWORK_LATENCY'
  | 'PACKET_LOSS'
  | 'POD_KILL'
  | 'PROCESS_KILL'
  | 'CPU_BURN'
  | 'MEMORY_STRESS'
  | 'DISK_IO_THROTTLE'
  | 'DNS_FAILURE'
  | 'HTTP_ERROR_INJECTION';

export type ExperimentRunStatus =
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'INITIALIZING'
  | 'FAULT_INJECTING'
  | 'OBSERVING'
  | 'ROLLING_BACK'
  | 'COMPLETED'
  | 'FAILED'
  | 'ABORTED';

export type FindingCategory =
  | 'CASCADING_FAILURE'
  | 'CIRCUIT_BREAKER_MISSING'
  | 'TIMEOUT_MISCONFIGURATION'
  | 'UNHANDLED_EXCEPTION'
  | 'DATA_CORRUPTION_RISK'
  | 'RESOURCE_EXHAUSTION'
  | 'ASYNC_RETRY_STORM'
  | 'DEGRADED_STATE_LEAK';

export type FindingStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'IGNORED';

export interface ServiceDependency {
  targetServiceId: string;
  dependencyType: DependencyType;
  confidence?: number;
}

export interface ServiceItem {
  id: string;
  applicationId: string;
  name: string;
  nodeType: NodeType;
  status: ServiceStatus;
  version?: string;
  port?: number;
  protocol?: string;
  healthEndpoint?: string;
  dependencies?: ServiceDependency[];
  recentFailuresCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationItem {
  id: string;
  projectId: string;
  name: string;
  slug: string;
  description?: string;
  repositoryUrl?: string;
  stack: string[];
  resilienceScore?: number;
  riskLevel?: Severity | 'UNKNOWN';
  createdAt: string;
  updatedAt: string;
}

export interface TestRunItem {
  id: string;
  applicationId: string;
  name?: string;
  type: TestRunType;
  status: TestRunStatus;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  summary?: {
    totalSteps: number;
    passedSteps: number;
    failedSteps: number;
    skippedSteps: number;
  };
  failedStepCount?: number;
  environment?: string;
}

export interface TestResultItem {
  id: string;
  testRunId: string;
  stepIndex?: number;
  stepName: string;
  status: 'PASSED' | 'FAILED' | 'SKIPPED' | 'TIMED_OUT';
  durationMs: number;
  errorMessage?: string;
  stackTrace?: string;
  evidence?: Array<{
    id: string;
    type: 'SCREENSHOT' | 'LOG' | 'METRIC' | 'TRACE' | 'VIDEO';
    title: string;
    url: string;
    metadata?: Record<string, unknown>;
  }>;
}

export interface ExperimentItem {
  id: string;
  applicationId: string;
  name: string;
  description?: string;
  targetServiceId: string;
  faultType: ExperimentFaultType;
  parameters: Record<string, unknown>;
  blastRadius: {
    estimatedImpactLevel: 'ISOLATED' | 'TIER_2_DOWNSTREAM' | 'SYSTEM_WIDE';
    affectedServicesCount: number;
    affectedServiceIds?: string[];
  };
  rollbackStrategy: {
    automatic: boolean;
    timeoutSeconds: number;
    action: string;
  };
  requiresApproval?: boolean;
}

export interface ExperimentRunItem {
  id: string;
  experimentId: string;
  applicationId: string;
  status: ExperimentRunStatus;
  approvalStatus: {
    isApproved: boolean;
    approvedBy?: string;
    approvedAt?: string;
    backendAuthorizationToken?: string;
  };
  targetService?: {
    id: string;
    name: string;
  };
  timeline?: Array<{
    timestamp: string;
    phase: string;
    message: string;
    details?: Record<string, unknown>;
  }>;
  outcome?: {
    resilienceVerified?: boolean;
    unhandledFailureDetected?: boolean;
    findingsGeneratedCount?: number;
    findingIds?: string[];
    summary?: string;
  };
  rollback?: {
    triggered?: boolean;
    completed?: boolean;
    triggerReason?: string;
    timestamp?: string;
  };
  startedAt: string;
  completedAt?: string;
}

export interface FindingItem {
  id: string;
  projectId: string;
  applicationId: string;
  serviceId: string;
  serviceName?: string;
  title: string;
  severity: Severity;
  category: FindingCategory;
  status: FindingStatus;
  observedBehavior: string;
  timeline?: Array<{
    timestamp: string;
    description: string;
    stage?: string;
  }>;
  probableRootCause: string;
  confidence: number; // 0.0 - 1.0
  impact: string;
  recovery: string;
  recommendationId?: string;
  experimentRunId?: string;
  evidence?: Array<{
    id: string;
    type: 'SCREENSHOT' | 'LOG' | 'METRIC' | 'TRACE';
    title: string;
    url: string;
    details?: Record<string, unknown>;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface RecommendationItem {
  id: string;
  findingId: string;
  title: string;
  summary?: string;
  actionPlan: string[];
  codeSnippet?: string;
  estimatedEffort: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface ReportItem {
  id: string;
  applicationId: string;
  title: string;
  generatedAt: string;
  executiveSummary: {
    resilienceScore: number;
    grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
    totalExperiments: number;
    criticalFindingsCount: number;
    overviewText: string;
    meanTimeToRecoverySec?: number;
  };
  technicalFindings: Array<{
    findingId: string;
    title: string;
    severity: Severity;
    serviceName: string;
    rootCauseSummary?: string;
  }>;
  experimentHistory: Array<{
    experimentRunId: string;
    targetService: string;
    faultType: string;
    outcomeStatus: string;
    passed?: boolean;
    blastRadiusContained?: boolean;
  }>;
  recommendations: Array<{
    recommendationId: string;
    findingId?: string;
    title: string;
    priority: 'P0' | 'P1' | 'P2' | 'P3';
    estimatedEffort: 'LOW' | 'MEDIUM' | 'HIGH';
  }>;
}


# CHAOS-INTEL: Frontend, Reporting & QA Subsystem (Person 4)

> **Subsystem Ownership Contract**: Control Center UI, Architecture Visualization, Test & Chaos Experimentation Reviews, Findings & Root Cause Analysis (RCA), Reporting Engine, and Frontend Quality Assurance.

---

## 1. Executive Summary & Ownership Scope

**CHAOS-INTEL** is an Intelligent Autonomous Software Resilience & Failure Discovery Platform designed to understand target applications, plan and execute controlled failure experiments, observe live behavior, identify root causes, and produce evidence-grounded remediation recommendations.

The architecture is divided into four cleanly decoupled workstreams communicating through strict contracts:
- **Person 1 (P1)**: Application Intelligence (codebase parsing, dependency discovery, canonical architecture graph generation).
- **Person 2 (P2)**: Chaos & Test Execution Engine (worker-driven execution of Playwright, k6 load testing, Pumba/container chaos injections).
- **Person 3 (P3)**: Platform, API & RCA Engine (FastAPI platform, PostgreSQL metadata, object storage references, root cause analysis engine).
- **Person 4 (P4 - This Subsystem)**: **Frontend, Reporting & QA Lead** (React control center, real-time experiment observation, graph rendering, findings explorer, executive/technical reports, and automated frontend testing).

```
   ┌─────────────────────────────────────────────────────────────┐
   │             P1: Application Intelligence                     │
   │  (Discovers topology, produces canonical architecture graph) │
   └──────────────────────────────┬──────────────────────────────┘
                                  │
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │             P3: Platform API & Storage                      │
   │      (FastAPI REST/SSE, PostgreSQL Meta, Object Store)       │
   └───────────────▲──────────────────────────────┬──────────────┘
                   │                              │
       Dispatches  │                  Consumes    │ Versioned REST
       Worker Jobs │                  Telemetry   │ & SSE Events
                   │                              │
                   ▼                              ▼
   ┌──────────────────────────────┐ ┌─────────────────────────────┐
   │   P2: Chaos & Test Engine    │ │  P4: Frontend & QA (YOU)    │
   │ (Playwright, k6, Pumba Chaos)│ │  (Dashboard, React Flow,    │
   └──────────────────────────────┘ │   Findings, RCA & Reports)  │
                                    └─────────────────────────────┘
```

### What Person 4 Owns
- The complete **React Control Center UI** (`apps/web`).
- **Dashboard**: High-level health scores, active applications, ongoing runs, critical vulnerabilities, and recent chaos experiments.
- **Project & Application Views**: Tech stack breakdown, services catalogue, dependency matrices, resilience risk scores, and run history.
- **Architecture Visualization**: High-fidelity canvas rendering P1's canonical service topology using **React Flow**.
- **Test & Chaos Experiment UI**: Run inspection, fault parameterization, blast radius estimation, pre-flight safety approval UX, and live timeline observation.
- **Findings & Root Cause Analysis (RCA)**: Deep findings table, multi-dimensional filters, AI-grounded root causes, and multi-modal evidence viewer (screenshots, terminal logs, telemetry metrics, and traces).
- **Reporting Engine**: Executive summaries, technical vulnerability deep dives, experiment matrices, actionable recommendations, and PDF/CSV/JSON export workflows.
- **Frontend Quality Assurance (QA)**: Comprehensive test suite with Vitest, React Testing Library, mock API integration tests, and Playwright E2E coverage.

### Strict Boundaries & Constraints (What You Do NOT Do)
- ❌ **Do NOT query PostgreSQL directly**: The frontend communicates **strictly via P3’s versioned REST and SSE endpoints**. No database drivers or connection strings in `apps/web`.
- ❌ **Do NOT implement backend business logic or orchestrate test tools directly**: FastAPI request handlers and frontend code never directly execute Playwright, k6, or Pumba; long-running execution belongs exclusively to P2 background workers.
- ❌ **Do NOT reconstruct or recalculate graph layout logic**: Render P1's canonical graph directly.
- ❌ **Do NOT treat frontend approval as security authorization**: Confirmation modals and warnings are UX safety gates only; backend authorization is the actual safety gate.
- ❌ **Do NOT create a separate reporting database**: Reports reference the exact same Finding, Experiment, and Recommendation IDs stored in P3.
- ❌ **Do NOT hardcode IDs or status values**: Always use UUIDs, ISO-8601 UTC timestamps, and shared enums defined in `packages/schemas`.

---

## 2. Technology Stack

| Layer | Tooling | Purpose |
| :--- | :--- | :--- |
| **Framework & Build** | **React 18+**, **TypeScript**, **Vite** | Blazing-fast HMR, strict type safety, modular component architecture |
| **UI Components** | **Tailwind CSS**, **shadcn/ui** | Professional, accessible, high-density technical SaaS component library |
| **Icons & Typography** | **Lucide React**, **Geist / Inter** / Mono | Clean technical visual hierarchy, monospace font for hashes & metrics |
| **Routing** | **React Router v6+** | Client-side routing, nested layouts, protected routes |
| **Server State** | **TanStack Query (React Query v5)** | Caching, deduplication, polling, loading/error/stale lifecycle management |
| **Architecture Graph** | **React Flow (`@xyflow/react`)** | Interactive node-edge visualization of P1's canonical architecture |
| **Metrics & Telemetry**| **Recharts / ECharts** | Time-series metrics, failure timelines, latency percentiles |
| **Unit & Integration** | **Vitest**, **React Testing Library** | Unit tests, component behavior, hook testing, mock assertions |
| **E2E Testing** | **Playwright** | Full browser automation testing across critical user journeys |
| **Mocking & Contracts**| **MSW (Mock Service Worker)** | Autonomous local frontend development simulating P3 API contracts |
| **Containerization** | **Docker** & **Docker Compose** | Multi-stage build (Vite build + Nginx Alpine runtime) for local & CI environments |

---

## 3. Information Architecture & Navigation

```
Dashboard (/)
├── System Health & Resilience Index
├── Active Applications & Top-Level Metrics
├── Active Runs (Live Tests & Experiments)
├── Critical Findings Requiring Action
└── Recent Chaos Runs

Projects (/projects)
└── Project Detail (/projects/:projectId)
    └── Applications List
        └── Application Overview (/applications/:appId)
            ├── Summary & Tech Stack Overview
            ├── Architecture Canvas (React Flow: Services, DBs, Queues, Caches)
            │   └── Node Inspection Drawer (Telemetry, Dependencies, Failure History)
            ├── Services Catalogue & Dependency Matrix
            ├── Risk Assessment & Resilience Score
            └── Historical Test & Experiment Runs

Tests (/tests)
├── Test Runs Explorer (Search, Status, Duration, Suite Type)
└── Test Run Detail (/tests/:testRunId)
    ├── Run Metadata & Execution Summary
    ├── Step-by-Step Test Execution Timeline
    ├── Failed Step Drill-down & Error Diagnostics
    └── Attached Evidence (Screenshots, Assertions, Network Dumps)

Experiments (/experiments)
├── Chaos Catalogue & Active Experiment List
├── Experiment Configuration & Launch Flow
│   ├── Target Selection, Fault Type (latency, packet loss, pod kill)
│   ├── Blast Radius Analysis & Affected Service Preview
│   └── Safety Approval Gate (UX confirmation of blast radius & rollback plan)
└── Experiment Run Detail (/experiments/:experimentRunId)
    ├── Live Execution Timeline (SSE / Polling)
    ├── Injected Fault Status & Target Health Telemetry
    ├── Automated Rollback & Verification State
    └── Outcome Summary & Discovered Findings

Findings (/findings)
├── High-Density Findings Grid (Filters: project, app, severity, category, service, status)
└── Finding Detail (/findings/:findingId)
    ├── Severity & Category Badges
    ├── Observed Behavior vs. Expected Baseline
    ├── Probable Root Cause Analysis (RCA) & AI Confidence Score
    ├── Impact Radius & Recovery Guidance
    └── Multi-Modal Evidence Viewer (Tabs: Screenshots, Terminal Logs, Metrics, Traces)

Reports (/reports)
├── Executive Summary (Resilience Score, MTTR, Vulnerability Trends)
├── Technical Findings Breakdown (Cross-referenced with Findings & Recommendations)
├── Experiment History & Blast Radius Containment Report
└── Export Actions: PDF (Print-optimized), CSV (Findings export), JSON (Schema-compliant)
```

---

## 4. Shared Contract Specifications (`packages/schemas/`)

All subsystems share a single repository and adhere to contracts defined in `packages/schemas/`.

| Schema File | Core Purpose | Person 4 Usage |
| :--- | :--- | :--- |
| `application.schema.json` | High-level system definition, repository metadata, tech stack | Renders application header, stack badges, and risk overview |
| `service.schema.json` | Service node specification, port, protocol, health endpoint | Custom React Flow node properties, node inspection sheet |
| `test-run.schema.json` | Test execution session metadata, status, environment, duration | Test run table, execution header |
| `test-result.schema.json` | Granular step results, assertions, failed step details, output | Test run detail timeline, failed step callout |
| `experiment.schema.json` | Chaos experiment definition, fault config, blast radius bounds | Experiment catalogue, pre-flight safety approval dialog |
| `experiment-run.schema.json`| Live experiment session, timeline phases, outcome, rollback state| Real-time experiment status stream, phase progress stepper |
| `telemetry.schema.json` | Time-series CPU, memory, latency, error rate metrics | Recharts metric cards, evidence viewer telemetry tab |
| `finding.schema.json` | Discovered vulnerability, RCA, confidence, affected service | Findings grid, finding detail view, evidence links |
| `recommendation.schema.json`| Actionable remediation guide, estimated effort, target service | Finding detail recommendation card, report action matrix |
| `report.schema.json` | Consolidated executive and technical report data | Report dashboard, PDF/CSV/JSON export generator |

### Shared Enums & Data Rules
1. **Identifiers**: Always use standard **UUID v4** strings (`"123e4567-e89b-12d3-a456-426614174000"`).
2. **Timestamps**: Always format timestamps as **ISO-8601 UTC strings** (`"2026-10-10T08:15:30.000Z"`).
3. **Severity Enum**: Strictly use `"CRITICAL"`, `"HIGH"`, `"MEDIUM"`, `"LOW"`, `"INFO"`.
4. **Execution Status Enum**: Strictly use `"PENDING"`, `"RUNNING"`, `"PASSED"`, `"FAILED"`, `"ABORTED"`, `"ROLLED_BACK"`.
5. **Asset Storage**: Heavy assets (recordings, screenshots, raw terminal logs) are hosted in Object Storage (e.g., S3/MinIO) and referenced in P3 metadata via pre-signed/resolvable URLs.

---

## 5. Monorepo & Directory Structure

```
c:\Dev\Chaos-Intel\
├── .github/
│   └── workflows/
│       └── frontend-ci.yml           # CI workflow: typecheck, lint, test, build
├── apps/
│   └── web/                          # Person 4 React Application
│       ├── public/                   # Static assets, favicon, mock service worker
│       ├── src/
│       │   ├── api/                  # P3 API client, Axios/Fetch wrappers, endpoints
│       │   ├── components/           # Reusable UI & common design system components
│       │   │   ├── common/           # StatusBadge, AsyncWrapper, PageHeader, EmptyState
│       │   │   └── ui/               # shadcn/ui primitives (button, dialog, table, etc.)
│       │   ├── features/             # Domain-specific modules
│       │   │   ├── applications/     # App views, React Flow architecture graph
│       │   │   │   ├── components/   # Custom nodes (ServiceNode, DBNode), GraphCanvas
│       │   │   │   ├── hooks/        # useApplicationGraph, useServiceDetails
│       │   │   │   └── pages/        # ApplicationDetailPage
│       │   │   ├── dashboard/        # Executive overview, system health cards
│       │   │   ├── experiments/      # Chaos catalog, approval modal, live runner
│       │   │   ├── findings/         # Findings table, RCA viewer, evidence modal
│       │   │   ├── reports/          # Report views, PDF/CSV export utilities
│       │   │   └── tests/            # Test runs list, step timeline viewer
│       │   ├── hooks/                # Global hooks (useSSE, useDebounce, useMediaQuery)
│       │   ├── layouts/              # AppLayout, Sidebar, CommandHeader
│       │   ├── lib/                  # Utility functions (cn, formatters, dateUtils)
│       │   ├── mocks/                # Mock Service Worker handlers & test data
│       │   ├── pages/                # Route pages connecting layouts to features
│       │   ├── router/               # React Router route configuration
│       │   ├── styles/               # Tailwind CSS entrypoint, themes
│       │   └── types/                # TypeScript types & generated schema bindings
│       ├── tests/                    # Vitest & React Testing Library test suites
│       ├── Dockerfile                # Production multi-stage Docker build
│       ├── Dockerfile.dev            # Local development Docker setup
│       ├── package.json              # Web app dependencies & scripts
│       ├── tsconfig.json             # TypeScript configuration with strict checks
│       └── vite.config.ts            # Vite configuration with aliases & test setup
├── packages/
│   └── schemas/                      # Shared JSON Schema contracts across P1, P2, P3, P4
│       ├── application.schema.json
│       ├── experiment-run.schema.json
│       ├── experiment.schema.json
│       ├── finding.schema.json
│       ├── recommendation.schema.json
│       ├── report.schema.json
│       ├── service.schema.json
│       ├── telemetry.schema.json
│       ├── test-result.schema.json
│       └── test-run.schema.json
├── docker-compose.yml                # Local orchestration for web + mock / backend
├── package.json                      # Workspace root scripts
└── README.md                         # Subsystem documentation (this file)
```

---

## 6. Implementation Plan & Phases

### Phase 0: Workspace Foundation & Contract Setup
- Initialize root monorepo, configure `package.json`, and set up workspaces.
- Populate `packages/schemas/` with the 10 shared JSON schema specifications.
- Configure schema codegen tool (`json-schema-to-typescript`) to generate type-safe models in `apps/web/src/types/generated/`.
- Initialize `apps/web` with Vite, React 18, TypeScript, and Tailwind CSS.
- Install shadcn/ui primitives and configure Lucide icons.
- Configure Vitest and React Testing Library baseline test harness.

### Phase 1: Application Shell, Design System & Mock API Layer
- Build responsive `AppLayout` with collapsible sidebar, command bar, and breadcrumb header.
- Implement React Router route structure with lazy-loaded route views.
- Configure TanStack Query client with standard caching, error retry, and window focus rules.
- Build standard async wrappers (`AsyncStateWrapper`) handling **Loading**, **Empty**, **Error**, and **Stale** states.
- Configure Mock Service Worker (MSW) to serve synthetic, contract-valid P3 API payloads for local development.

### Phase 2: Application Intelligence & React Flow Architecture Graph
- Build `ArchitectureGraph` canvas using `@xyflow/react`.
- Create custom node components: `FrontendNode`, `ServiceNode`, `DatabaseNode`, `CacheNode`, `QueueNode`, and `ExternalDependencyNode`.
- Create custom edge renderers visualizing communication protocol and confidence ratings.
- Build slide-out `ServiceDetailsSheet` displaying incoming/outgoing dependencies, health metrics, and failure history.
- Ensure strict consumption of P1's canonical graph layout provided by P3 without frontend reconstruction.

### Phase 3: Test Execution & Chaos Experimentation Control Center
- Build `TestRunsPage` and `TestRunDetailPage` showing execution metadata, suite type, and failed step callouts.
- Build `ExperimentsPage` detailing chaos targets, fault injections, parameters, and estimated blast radius.
- Implement pre-flight **Safety & Approval Confirmation Dialog** with clear UX disclaimer that backend authorization is the actual safety control.
- Implement live experiment progress timeline using Polling / SSE (`useExperimentStream`), displaying states: `SCHEDULED`, `INJECTING`, `OBSERVING`, `RECOVERING`, `COMPLETED`, `ROLLED_BACK`.

### Phase 4: Findings, Evidence & Root Cause Analysis (RCA) Explorer
- Build high-density `FindingsGrid` supporting multi-column sorting and filtering by project, application, severity, category, service, and status.
- Implement `FindingDetailPage` featuring severity badge, observed vs. expected behavior timeline, root cause analysis with AI confidence metric, and remediation instructions.
- Build tabbed `EvidenceViewer`:
  - Screenshots (lightbox image zoom)
  - Logs (virtualized terminal console with search)
  - Metrics (Recharts time-series telemetry charts)
  - Traces (distributed trace span waterfall)

### Phase 5: Reporting Engine & Export Subsystem
- Build `ReportsPage` presenting executive resilience scores, MTTR metrics, vulnerability summaries, and prioritized recommendations.
- Ensure all reports link directly to canonical Finding, Experiment, and Recommendation IDs without a separate database.
- Implement client-side export utility (`ExportMenu`):
  - Print-ready PDF report layout utilizing `@media print` CSS.
  - CSV export for raw technical findings and vulnerability inventories.
  - Schema-compliant JSON download conforming to `report.schema.json`.

### Phase 6: Frontend QA, Testing Automation & Docker Integration
- Author Vitest unit tests for utilities, formatters, and custom hooks.
- Author React Testing Library component tests for critical interactions (`ArchitectureGraph`, `EvidenceViewer`, `ApprovalModal`).
- Author contract tests verifying API consumers against `packages/schemas/`.
- Build multi-stage production `Dockerfile` and local `Dockerfile.dev`.
- Verify full local orchestration via `docker-compose.yml`.
- Review Definition of Done checklist.

---

## 7. UX & Visual Design Principles

1. **Dense but Readable Technical SaaS**: High information density suited for Site Reliability Engineers (SREs), QA engineers, and architects. Avoid excessive padding or decorative whitespace.
2. **Restrained Visuals**: Prioritize clarity over 3D animations or frivolous transitions. Clean borders, subtle elevation, and clear color semantics.
3. **Strict Four-State Coverage**: Every single data view must explicitly handle:
   - **Loading State**: Content-shaped skeleton loaders (no jarring generic spinners).
   - **Empty State**: Clear contextual illustration, explanation, and primary call to action.
   - **Error State**: Non-blocking error alert with failure diagnosis and a "Retry" button.
   - **Stale State**: Subtle banner or badge indicating background synchronization in progress.
4. **Accessible Semantics**: Semantic HTML tables, ARIA labels for graph elements, accessible dialog modals, and keyboard navigation support (`Escape` to close drawers/modals, `Cmd/Ctrl + K` command bar).

---

## 8. Local Setup & Quickstart Guide

### Prerequisites
- **Node.js**: v18.0.0 or v20.x LTS
- **npm** or **pnpm**
- **Docker & Docker Compose** (for containerized execution)

### 1. Installation
Clone the repository and install root and workspace dependencies:
```bash
# Clone the repository
git clone https://github.com/your-org/chaos-intel.git
cd Chaos-Intel

# Install dependencies across all workspaces
npm install
```

### 2. Generate Schema Types
Compile the shared JSON schemas in `packages/schemas/` into TypeScript definitions:
```bash
npm run codegen:schemas
```

### 3. Run Development Server (with Mock API)
To develop the frontend independently using Mock Service Worker (MSW) without requiring a running P3 backend:
```bash
npm run dev
# The app will be available at http://localhost:5173
```

### 4. Run Development Server (against Live P3 Backend)
To point the frontend at an active P3 FastAPI instance:
```bash
# Set backend URL in apps/web/.env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_USE_MOCKS=false

npm run dev
```

### 5. Running with Docker Compose
To run the containerized frontend locally:
```bash
docker compose up --build web
# Accessible at http://localhost:3000
```

---

## 9. Testing & Quality Assurance (QA) Strategy

As QA Lead for the frontend subsystem, high test coverage and contract fidelity are mandatory.

### Test Execution Commands
```bash
# Run unit & component tests with Vitest
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run TypeScript type check across the entire workspace
npm run typecheck

# Run linter
npm run lint

# Run Playwright E2E tests (when enabled)
npm run test:e2e
```

### Testing Layers
1. **Unit Tests (Vitest)**: Tests utility functions, status formatters, time calculation helpers, and data mapping functions.
2. **Component Tests (React Testing Library)**: Tests individual UI components (e.g., node drawers, modal safety gates, filter reducers) ensuring proper DOM rendering and accessibility.
3. **Integration & Contract Tests**: Tests MSW handlers and API consumers against the canonical schemas in `packages/schemas/` to ensure frontend never breaks when backend types evolve.
4. **End-to-End Tests (Playwright)**: Tests critical user journeys across the application (Application inspection -> Experiment execution -> Finding investigation -> Report export).

---

## 10. Definition of Done (DoD) Checklist

Before any feature or phase is merged or handed over to other team members, verify every item below:

- [ ] **Runs Locally in Docker**: Subsystem builds and runs cleanly via `docker compose up web`.
- [ ] **Comprehensive Test Coverage**: All new components and workflows have corresponding Vitest / RTL tests passing with zero errors.
- [ ] **Zero Hardcoded Secrets**: No API keys, credentials, database connection strings, or personal tokens are committed.
- [ ] **Documented Setup**: Installation steps, environment variables, and run commands are fully documented.
- [ ] **Shared Schemas Respected**: All API payloads conform strictly to the schemas in `packages/schemas/`; no local enum spellings or improvised shapes.
- [ ] **Failure Paths Handled**: Loading skeletons, empty states, error boundaries, and retry triggers are thoroughly implemented and verified.
- [ ] **Integration Test Passes**: Cross-subsystem integration tests (consuming P1 graph via P3 API) pass cleanly.


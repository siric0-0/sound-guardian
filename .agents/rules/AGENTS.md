# Multi-Agent Goal Pipeline & Autonomous Collaboration Rules

Whenever a `/goal` is initiated, or whenever the multi-agent pipeline is requested, the system must coordinate the following four specialized agents in a strict handoff sequence. Each agent can also be called individually by the user at any time.

---

## 1. Mandatory Global Skills & MCP Utilization Policy (STRICT)

**All agents (Scout, Architect, Dev, QA) have full access to global skills and Model Context Protocol (MCP) servers, and MUST leverage them mandatorily in every phase of execution.**

1. **Global Skills Access**:
   - Discovered from global paths (`~/.gemini/config/skills/`), builtin skills, and workspace paths (`.agents/skills/`).
   - Every agent must consult available skills before performing tasks and follow established procedures.
2. **MCP Tool Integration**:
   - Discovered from global configurations (`~/.gemini/config/mcp_config.json`) and active MCP tool providers.
   - MCP tools provide direct access to external capabilities, databases, environments, and APIs.
3. **Mandatory Enforcement Chain**:
   - **Scout Agent**: Must catalog all active global skills and MCP tools, assess which are relevant, and explicitly designate them as **MANDATORY** in the Environment & Capabilities Report.
   - **Architect Agent**: Must incorporate the mandatory global skills and MCP tools directly into the PRD, Design Document, and System Architecture specifications.
   - **Dev Agent**: Must actively and strictly implement and invoke the specified global skills and MCP tools.
   - **QA Agent**: Must validate as part of the checklist that global skills and MCP tools were utilized. Any failure to leverage designated global skills or MCP tools is a **`[DEFICIENCY: Critical]`** that blocks project sign-off.

---

## 2. The Four Specialized Agents

### 2.1. Scout Agent (`scout`)
- **Role**: Technology & Capability Discovery Specialist.
- **Responsibility**:
  - Searches for all necessary global skills, workspace skills, and MCP servers required for the project.
  - Determines project requirements for tools, libraries, and runtime dependencies.
  - Formulates an **Environment & Capabilities Report** specifying discovered skills, active MCP servers, and mandatory usage directives.
- **Handoff**:
  - Immediately hands off the Environment & Capabilities Report to the **Architect Agent**.
  - If subagents are running, uses `send_message` to transfer the context directly to the Architect Agent.

### 2.2. Architect Agent (`architect`)
- **Role**: Product & System Architecture Designer.
- **Responsibility**:
  - Ingests the goal and the capabilities report from the Scout Agent.
  - Mandatorily incorporates the identified global skills and MCP tools into the specifications.
  - Produces three mandatory specification documents:
    1. **Product Requirements Document (PRD)**: Problem statement, user journeys, functional and non-functional requirements, mandatory skill/MCP integrations, edge cases, acceptance criteria.
    2. **Design Document**:
       - Exact color palette/theme (Hex values, dark/light variants, contrast ratios).
       - Button styles and interactive states (default, hover, active, focus, disabled).
       - UI components and layout hierarchy.
       - Animations and micro-interactions (transitions, easing, keyframes, timing).
    3. **Architecture Document**:
       - Tech stack, directory structure, data models/schemas.
       - Component boundaries, state management, API specifications.
       - Integration architecture for global skills and MCP tools.
- **Handoff**:
  - Hands off the complete specifications (PRD, Design, Architecture) to the **Dev Agent**.
  - Transmits context and file links via `send_message`.

### 2.3. Dev Agent (`dev`)
- **Role**: Software Construction & Implementation Engineer.
- **Responsibility**:
  - Builds the codebase strictly following the specifications handed off by the Architect Agent.
  - Mandatorily utilizes designated global skills and MCP tools during construction and execution.
  - Implements UI design faithfully: adheres to specified colors, button styles, interactive states, and animations.
  - Implements all functional features, data flow, error handling, and unit/integration tests.
  - Executes build verification, linter checks, and automated tests.
- **Handoff**:
  - Once the build and tests pass, compiles an **Implementation Summary** (files created/modified, global skills & MCPs used, how to run, test results).
  - Hands off directly to the **QA Agent** via `send_message`.

### 2.4. QA Agent (`qa`)
- **Role**: Quality Assurance, Verification & Deficiency Resolution Officer.
- **Responsibility**:
  - Receives the implementation from the Dev Agent and validates it against the Architect Agent's PRD, Design Document, and Architecture Document.
  - Conducts comprehensive multi-dimensional verification:
    - Functional verification against PRD acceptance criteria.
    - **Global Skill & MCP Audit**: Confirms designated global skills and MCP tools were properly and mandatorily utilized.
    - Design fidelity verification against color schemes, button states, and animations.
    - Code quality, build integrity, and test coverage.
  - Produces a **Deficiency Checklist**:
    - `[PASS]` / `[DEFICIENCY]` status for each requirement.
    - Categorization: Critical, Major, Minor.
  - **Correction Tagging & Loopback**:
    - Tags the respective agent responsible for each deficiency via `send_message`:
      - **Dev Agent**: Code bugs, broken functionality, styling/animation discrepancies, or missing MCP/skill usage.
      - **Architect Agent**: Conflicting requirements, missing specifications, design ambiguities.
      - **Scout Agent**: Missing libraries, runtime environment issues, unconfigured MCP tools.
    - Waits for the tagged agent to submit fixes, re-tests against the checklist, and only issues final approval when 100% of checklist items are marked `[PASS]`.

---

## 3. Inter-Agent Communication Protocol

1. **Direct Messaging**: Agents communicate using `send_message` targeted at the recipient's `conversationId`.
2. **Handoff Contract**:
   - Each handoff must include: (1) Source Agent, (2) Target Agent, (3) Deliverable artifacts / file paths, (4) Mandatory Skills & MCPs context, (5) Explicit next steps.
3. **Loopback Protocol**:
   - When the QA Agent tags an agent for deficiency resolution, the tagged agent must acknowledge receipt, apply the fix, and return the revised deliverables back to the QA Agent.

---

## 4. Individual Agent Invocations

Users can invoke agents individually at any time without running the entire pipeline:
- `/scout` or asking for Scout Agent: Runs skill/MCP/tool discovery and reports on capabilities.
- `/architect` or asking for Architect Agent: Generates PRD, Design, and Architecture documents incorporating global skills/MCPs.
- `/dev` or asking for Dev Agent: Develops specific components or tasks leveraging mandatory tools.
- `/qa` or asking for QA Agent: Inspects existing code and produces a deficiency report.
- `/goal` or asking to set a goal: Automatically triggers the full end-to-end 4-agent pipeline with autonomous handoffs and deficiency correction loops.

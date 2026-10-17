---
name: goal
description: Orchestrates the autonomous multi-agent pipeline (Scout -> Architect -> Dev -> QA -> Loopback) whenever a goal is set, enforcing mandatory global skills and MCP utilization.
---

# End-to-End Multi-Agent Goal Pipeline

Use this skill whenever a `/goal` is set or the user asks to pursue an end-to-end goal.

## Mandatory Global Skill & MCP Utilization

All agents in this pipeline have full access to global skills (`~/.gemini/config/skills/`, builtin skills) and MCP servers (`~/.gemini/config/mcp_config.json`). Every agent must mandatorily leverage them throughout the pipeline:
- **Scout Agent**: Catalogs and mandates global skills & MCP tools.
- **Architect Agent**: Embeds mandatory global skills & MCP tools into PRD, Design, and Architecture.
- **Dev Agent**: Strictly implements and calls designated global skills & MCP tools.
- **QA Agent**: Audits skill & MCP utilization; marks omitted tools as Critical Deficiencies.

## Pipeline Architecture & Handoff Sequence

```
User Goal
   │
   ▼
1. Scout Agent (Discover Skills & MCPs, Designate Mandatory Capabilities)
   │  Handoff via send_message
   ▼
2. Architect Agent (PRD + Design Docs [colors, buttons, animations] + Architecture + Skill/MCP Specs)
   │  Handoff via send_message
   ▼
3. Dev Agent (Implementation strictly adhering to specs, leveraging mandatory Skills & MCPs)
   │  Handoff via send_message
   ▼
4. QA Agent (Comprehensive Validation against Architect Solution + Global Skill/MCP Audit)
   │
   ├── [Deficiencies Found] ──> Tags responsible agent (Dev/Architect/Scout) via send_message
   │                                  ▲
   │                                  └── [Fix Applied & Re-handed off]
   └── [100% Passed] ─────────> Final QA Sign-off & Goal Completed
```

## Execution Instructions

1. **Phase 1: Scout Agent Execution**
   - Invoke `scout` subagent using `invoke_subagent` or execute Scout workflow.
   - Inspect global skills, builtin skills, workspace skills, and MCP tools.
   - Output Environment & Capabilities Report designating mandatory tools.
   - Hand off context to the Architect Agent via `send_message`.

2. **Phase 2: Architect Agent Execution**
   - Invoke `architect` subagent using `invoke_subagent` or execute Architect workflow.
   - Ingest Scout report and project goal.
   - Produce: PRD, Design Document (color palette, button states, animations), Architecture Document, and Skill/MCP integration plan.
   - Hand off specifications to the Dev Agent via `send_message`.

3. **Phase 3: Dev Agent Execution**
   - Invoke `dev` subagent using `invoke_subagent` or execute Dev workflow.
   - Implement codebase according to specifications, mandatorily leveraging designated global skills and MCP tools.
   - Verify build, tests, and styles.
   - Hand off completed build to QA Agent via `send_message`.

4. **Phase 4: QA Agent Execution & Feedback Loop**
   - Invoke `qa` subagent using `invoke_subagent` or execute QA workflow.
   - Audit implementation against Architect's solution and verify mandatory skill/MCP usage.
   - Generate Deficiency Checklist with status `[PASS]` or `[DEFICIENCY]`.
   - If deficiencies exist: Tag the responsible agent (Dev / Architect / Scout) via `send_message`.
   - Await fix, re-evaluate checklist, and repeat until 100% pass.
   - Issue final QA sign-off.

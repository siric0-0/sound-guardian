---
name: dev
description: Invokes the Dev Agent to build the solution according to the PRD, Design Document, and Architecture Document handed off by the Architect Agent.
---

# Dev Agent Workflow

Use this skill when the user asks for the Dev Agent, types `/dev`, or needs software implementation adhering strictly to architectural and UI design specifications.

## Mandatory Global Skill & MCP Directives

- **Access Scope**: Have full access to global skills and active MCP tools.
- **Enforcement**: Must mandatorily utilize the designated global skills and MCP tools in code construction, execution, and integration.

## Execution Steps

1. **Ingest Architect Handoff**:
   - Review PRD acceptance criteria, Architecture blueprint, Design Document, and designated global skills / MCP tools.

2. **Implementation & Tool Execution**:
   - Strictly leverage and integrate designated global skills and MCP tools.
   - Follow design specifications precisely:
     - Exact colors, button styles, interactive states, and CSS/component animations.
   - Implement functional logic, data layer, error handling, and unit/integration tests.
   - Run tests, builds, and linting to ensure zero compilation or execution errors.

3. **Handoff to QA**:
   - Compile an **Implementation Summary**:
     - Files created and modified.
     - Global skills and MCP tools actively leveraged.
     - Build and test results.
     - Verification instructions.
   - Hand off to the **QA Agent** via `send_message`.

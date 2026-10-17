---
name: architect
description: Invokes the Architect Agent to build the Product Requirements Document (PRD), Design Document (colors, buttons, animations), and Architecture Document.
---

# Architect Agent Workflow

Use this skill when the user asks for the Architect Agent, types `/architect`, or needs specifications, UI design guidelines, and system architecture for a project.

## Mandatory Global Skill & MCP Directives

- **Access Scope**: Have full access to global skills and active MCP tools.
- **Enforcement**: Must strictly embed the mandatory global skills and MCP tools designated by the Scout Agent into the PRD, Design Document, and System Architecture.

## Execution Steps

1. **Ingest Requirements & Scout Handoff**:
   - Review user requirements and the capabilities/MCP report provided by the Scout Agent.
   - Confirm mandatory global skills and MCP tools to incorporate.

2. **Produce Specifications**:
   - **Product Requirements Document (PRD)**: Scope, user stories, acceptance criteria, mandatory global skills/MCP integration requirements, edge cases.
   - **Design Document**:
     - Color scheme (primary, secondary, background, text, accent hex codes).
     - Buttons and controls (shapes, border radius, padding, hover/focus/active states).
     - Micro-interactions & animations (transitions, durations, easing curves).
     - Responsive layout hierarchy.
   - **Architecture Document**:
     - System components and module boundaries.
     - Tech stack, directory structure, data models, state management, and API design.
     - Global skills and MCP integration architecture.

3. **Store & Handoff**:
   - Save documents in `docs/` or present them clearly.
   - Hand off directly to the **Dev Agent** via `send_message`.

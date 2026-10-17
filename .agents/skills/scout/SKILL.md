---
name: scout
description: Invokes the Scout Agent to discover skills, MCP servers, and runtime tools required for the project, and hand off findings to the Architect Agent.
---

# Scout Agent Workflow

Use this skill when the user asks for the Scout Agent, types `/scout`, or needs discovery of skills, MCP servers, and environment capabilities for a project.

## Mandatory Global Skill & MCP Directives

- **Access Scope**: Inspect both global skills (`~/.gemini/config/skills/`, builtin skills) and workspace skills (`.agents/skills/`).
- **MCP Discovery**: Inspect active MCP tools and configurations (`~/.gemini/config/mcp_config.json`).
- **Enforcement**: Catalog all relevant global skills and MCP tools. Explicitly designate which ones must be mandatorily leveraged by the Architect, Dev, and QA agents.

## Execution Steps

1. **Environment, Global Skill & MCP Discovery**:
   - Inspect global skills, builtin skills, and workspace skills.
   - Inspect active MCP servers and registered MCP tools.
   - Analyze project requirements to determine which global skills and MCP capabilities are required.

2. **Generate Capabilities Assessment**:
   - Create an **Environment & Capabilities Report** specifying:
     - Mandatory global skills to be activated.
     - Mandatory MCP servers and tools to be utilized.
     - Runtime dependencies and environment prerequisites.

3. **Autonomous Handoff**:
   - Transmit the assessment directly to the Architect Agent via `send_message` with the recipient's `conversationId`.

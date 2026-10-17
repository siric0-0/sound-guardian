import sys
import json
import os
import glob

def read_input():
    try:
        raw = sys.stdin.read()
        if raw.strip():
            return json.loads(raw)
    except Exception:
        pass
    return {}

def discover_capabilities():
    # 1. MCP Discovery
    mcp_servers = []
    user_profile = os.environ.get("USERPROFILE", os.path.expanduser("~"))
    mcp_dir = os.path.join(user_profile, ".gemini", "antigravity", "mcp")
    if os.path.exists(mcp_dir):
        for entry in os.listdir(mcp_dir):
            full_path = os.path.join(mcp_dir, entry)
            if os.path.isdir(full_path):
                tools = [f[:-5] for f in os.listdir(full_path) if f.endswith(".json")]
                mcp_servers.append({"name": entry, "tools": tools})

    # 2. Global & Builtin Skills Discovery
    global_skills = []
    builtin_skills_dir = os.path.join(user_profile, ".gemini", "antigravity", "builtin", "skills")
    if os.path.exists(builtin_skills_dir):
        for entry in os.listdir(builtin_skills_dir):
            if os.path.isdir(os.path.join(builtin_skills_dir, entry)):
                global_skills.append(f"builtin:{entry}")

    config_skills_dir = os.path.join(user_profile, ".gemini", "config", "skills")
    if os.path.exists(config_skills_dir):
        for entry in os.listdir(config_skills_dir):
            if os.path.isdir(os.path.join(config_skills_dir, entry)):
                global_skills.append(f"global:{entry}")

    agents_skills_dir = os.path.join(user_profile, ".agents", "skills")
    if os.path.exists(agents_skills_dir):
        for entry in os.listdir(agents_skills_dir):
            if os.path.isdir(os.path.join(agents_skills_dir, entry)):
                global_skills.append(f"global:{entry}")

    return mcp_servers, global_skills

def handle_pre_invocation(data):
    transcript_path = data.get("transcriptPath", "")
    is_goal = False
    goal_text = ""

    if transcript_path and os.path.exists(transcript_path):
        try:
            with open(transcript_path, "r", encoding="utf-8") as f:
                lines = f.readlines()
                for line in reversed(lines):
                    line_data = json.loads(line)
                    if line_data.get("type") == "USER_INPUT":
                        content = line_data.get("content", "")
                        if "/goal" in content.lower() or content.strip().startswith("/goal"):
                            is_goal = True
                            goal_text = content.strip()
                            break
                        # Stop checking older user inputs
                        break
        except Exception:
            pass

    if is_goal:
        mcp_servers, global_skills = discover_capabilities()
        mcp_summary = ", ".join([f"{s['name']} ({len(s['tools'])} tools)" for s in mcp_servers]) if mcp_servers else "None discovered"
        skills_summary = ", ".join(global_skills) if global_skills else "None discovered"

        instruction = (
            "[GOAL HOOK ACTIVATED]\n"
            "A '/goal' workflow has been initiated: " + goal_text + "\n\n"
            "=== STRICT MANDATORY GLOBAL SKILLS & MCP POLICY ===\n"
            f"• Available MCP Servers: {mcp_summary}\n"
            f"• Available Global/Builtin Skills: {skills_summary}\n\n"
            "ALL 4 AGENTS MUST MANDATORILY LEVERAGE GLOBAL SKILLS AND MCP TOOLS:\n"
            "1. SCOUT AGENT: Scan all active global skills and MCP tools. Explicitly designate which ones are mandatory for this project in the Environment & Capabilities Report. Hand off to Architect.\n"
            "2. ARCHITECT AGENT: Ingest the mandatory global skills and MCP tools and strictly embed them into the PRD, Design Document (colors, buttons, animations), Architecture Document, and tool integration plan. Hand off to Dev.\n"
            "3. DEV AGENT: Build the complete solution, mandatorily utilizing designated global skills and executing MCP tools (via call_mcp_tool). Hand off to QA.\n"
            "4. QA AGENT: Perform full audit. Verify that the solution strictly utilized the designated global skills and MCP tools. Any omission is a [DEFICIENCY: Critical]. Tag responsible agents via send_message to resolve, and re-validate until 100% passed.\n\n"
            "Agents communicate via send_message. The goal is complete ONLY when QA issues a 100% PASS sign-off."
        )
        output = {
            "injectSteps": [
                {
                    "ephemeralMessage": instruction
                }
            ]
        }
    else:
        output = {
            "injectSteps": []
        }

    sys.stdout.write(json.dumps(output))

def handle_stop(data):
    output = {
        "decision": "allow"
    }
    sys.stdout.write(json.dumps(output))

def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "pre_invocation"
    data = read_input()
    if mode == "pre_invocation":
        handle_pre_invocation(data)
    elif mode == "stop":
        handle_stop(data)
    else:
        sys.stdout.write(json.dumps({}))

if __name__ == "__main__":
    main()

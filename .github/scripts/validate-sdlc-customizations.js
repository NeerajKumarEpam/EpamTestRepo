const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const errors = [];
const requiredAgents = [
  "agentic-sdlc",
  "sdlc-requirements",
  "sdlc-architecture",
  "sdlc-design-review",
  "sdlc-implementation-plan",
  "sdlc-developer",
  "sdlc-code-review",
  "sdlc-verification",
  "sdlc-pr-preparer",
];
const requiredArtifacts = [
  "README.md",
  "requirements.md",
  "architecture.md",
  "design-review.md",
  "impl-plan.md",
  "code-review.md",
  "verification.md",
  "changelog.md",
  "pr-description.md",
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function check(condition, message) {
  if (!condition) errors.push(message);
}

function frontmatter(text, label) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  check(Boolean(match), `${label}: missing YAML frontmatter`);
  return match ? match[1] : "";
}

const hookConfig = JSON.parse(read(".github/hooks/sdlc-session.json"));
const sessionHooks = hookConfig.hooks && hookConfig.hooks.SessionStart;
check(Array.isArray(sessionHooks) && sessionHooks.length === 1,
  "Hook config: expected one SessionStart command");
if (Array.isArray(sessionHooks) && sessionHooks[0]) {
  check(sessionHooks[0].type === "command",
    "Hook config: SessionStart must use a command");
  check(sessionHooks[0].command === "node .github/hooks/session-context.js",
    "Hook config: unexpected session context command");
  check(Number.isInteger(sessionHooks[0].timeout) && sessionHooks[0].timeout <= 5,
    "Hook config: timeout must be an integer of at most five seconds");
}

const hookOutput = execFileSync(
  process.execPath,
  [".github/hooks/session-context.js"],
  { cwd: root, encoding: "utf8" },
);
const hookResult = JSON.parse(hookOutput);
check(typeof hookResult.systemMessage === "string"
  && hookResult.systemMessage.includes(".github/copilot-instructions.md")
  && hookResult.systemMessage.includes("output/"),
"Session hook: systemMessage is missing workflow pointers");

const agentFiles = fs.readdirSync(path.join(root, ".github", "agents"))
  .filter((file) => file.endsWith(".agent.md"));
const foundAgentNames = [];
for (const file of agentFiles) {
  const content = read(path.join(".github", "agents", file));
  const metadata = frontmatter(content, file);
  const name = metadata.match(/^name:\s*([a-z0-9-]+)\s*$/m);
  const description = metadata.match(/^description:\s*"[^"]+"\s*$/m);
  const tools = metadata.match(/^tools:\s*\[([a-z, ]+)\]\s*$/m);
  check(Boolean(name), `${file}: missing valid name`);
  check(Boolean(description), `${file}: missing quoted description`);
  check(Boolean(tools), `${file}: missing tools list`);
  if (name) foundAgentNames.push(name[1]);
}
check(agentFiles.length === requiredAgents.length,
  `Agents: expected ${requiredAgents.length}, found ${agentFiles.length}`);
for (const expected of requiredAgents) {
  check(foundAgentNames.includes(expected), `Agents: missing ${expected}`);
}
check(new Set(foundAgentNames).size === foundAgentNames.length,
  "Agents: duplicate name found");

const orchestrator = read(".github/agents/agentic-sdlc.agent.md");
for (const name of requiredAgents.slice(1)) {
  check(orchestrator.includes(name), `Orchestrator: missing handoff to ${name}`);
}

const skill = frontmatter(read(".github/skills/agentic-sdlc/SKILL.md"), "Skill");
check(/^name:\s*agentic-sdlc\s*$/m.test(skill), "Skill: name must match its folder");
check(/^description:\s*"[^"]+"\s*$/m.test(skill), "Skill: missing quoted description");

const instructions = frontmatter(
  read(".github/instructions/sdlc-artifacts.instructions.md"),
  "Artifact instructions",
);
check(/^description:\s*"[^"]+"\s*$/m.test(instructions),
  "Artifact instructions: missing quoted description");
check(/^applyTo:\s*"output\/\*\*\/\*\.md"\s*$/m.test(instructions),
  "Artifact instructions: unexpected applyTo pattern");

const outputFiles = fs.readdirSync(path.join(root, "output"));
for (const file of requiredArtifacts) {
  check(outputFiles.includes(file), `Output artifacts: missing ${file}`);
}
const requirements = read("output/requirements.md");
check(requirements.includes("COD-15") && requirements.includes("FR-1"),
  "Requirements: source or requirement traceability is missing");
check(requirements.includes("Pending human approval"),
  "Requirements: approval status is not explicit");
check(read("output/architecture.md").includes("Pending human approval"),
  "Architecture: approval status is not explicit");

const prDescription = read("output/pr-description.md");
for (const heading of [
  "Summary",
  "Changes Made",
  "Test Evidence",
  "Known Limitations",
  "Reviewer Checklist",
]) {
  check(prDescription.includes(`## ${heading}`),
    `PR description: missing ${heading} section`);
}

const checkedFiles = [
  "README.md",
  ...agentFiles.map((file) => path.join(".github", "agents", file)),
  ".github/copilot-instructions.md",
  ".github/instructions/sdlc-artifacts.instructions.md",
  ".github/skills/agentic-sdlc/SKILL.md",
  ".github/hooks/sdlc-session.json",
  ".github/hooks/session-context.js",
  ".github/scripts/validate-sdlc-customizations.js",
  ...requiredArtifacts.map((file) => path.join("output", file)),
];
for (const file of checkedFiles) {
  const lines = read(file).split(/\r?\n/);
  if (lines.some((line) => /[ \t]+$/.test(line))) {
    errors.push(`${file}: trailing whitespace found`);
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `ERROR: ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`PASS: hook configuration and output; ${agentFiles.length} agent definitions and orchestrator handoffs; skill/instruction metadata; ${requiredArtifacts.length} output artifacts; required PR sections; whitespace check.`);
}

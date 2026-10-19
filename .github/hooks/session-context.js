process.stdout.write(JSON.stringify({
  systemMessage: [
    'Repository SDLC guidance: read .github/copilot-instructions.md.',
    'For lifecycle work, use .github/skills/agentic-sdlc/SKILL.md and the agentic-sdlc agent.',
    'Keep deliverables in output/ and stop at the documented human-approval gates.'
  ].join(' ')
}));

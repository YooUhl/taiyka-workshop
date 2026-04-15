# Claude Code Starter Pack — 3 skills to get started

> The pack I wish I had when I first discovered Claude Code.
> — Manu, founder of [Taiyka](https://instagram.com/manu_ai.to)

---

## What is Claude Code?

Claude Code is Claude (Anthropic's AI) running directly in your terminal — able to **read your files, write code, run commands, and execute "skills"**.

Think of it as a hyper-powered assistant living on your machine: you talk, it acts. No copy-pasting from ChatGPT, no context lost between conversations.

A **skill** is just a `.md` file that tells Claude *"here's exactly how to do X when someone asks for X"*. You drop one in, and from that moment on, whenever you trigger the right keyword, Claude follows the procedure you defined.

This pack ships **3 ready-to-use skills** + this guide to install them in 30 minutes.

---

## Before you start

**You'll need:**
- An [Anthropic account](https://console.anthropic.com) (for the API key) OR a Claude.ai Pro/Max subscription (which includes Claude Code)
- Node.js v18+ installed
- A terminal (Windows: PowerShell or Git Bash / Mac: Terminal)
- 30 minutes

---

## Step 1 — Install Claude Code

### On Windows or Mac

Open your terminal and run:

```bash
npm install -g @anthropic-ai/claude-code
```

Verify the install:

```bash
claude --version
```

If you see a version number, you're good.

### Authenticate

Run:

```bash
claude
```

On first launch, Claude Code opens a web page to log you in (either with your API key or your Claude.ai account).

That's it. You can now talk to it in the terminal.

---

## Step 2 — Where to put the skills

Skills live in a special folder on your machine. Claude Code reads them automatically.

### On Mac / Linux
```
~/.claude/skills/
```

### On Windows
```
C:\Users\YOUR_NAME\.claude\skills\
```

If the `skills` folder doesn't exist, **create it**.

Then **copy the 3 `.md` files from the `skills/` folder of this pack** into that folder. You should end up with:

```
~/.claude/skills/
├── content-creator.md
├── morning-planner.md
└── excalidraw-diagram.md
```

That's it. No restart, no config.

---

## Step 3 — How to trigger a skill

Launch Claude Code in any folder:

```bash
claude
```

Then type a request that matches the skill's **description**. Claude auto-detects which skill to use.

### Examples

**For content-creator:**
> "Help me write a Reels script about automation"

**For morning-planner:**
> "Plan my day"

**For excalidraw-diagram:**
> "Make me a diagram of a user signup flow"

Claude recognizes the intent, loads the matching skill, and follows the procedure step by step.

---

## The 3 skills in this pack

### 1. content-creator
Generates Reels/TikTok scripts, Instagram captions, carousels, or 10 content ideas when you're stuck. Asks 3 questions about your niche/audience/tone, then ships ready-to-publish content.

### 2. morning-planner
Morning planning ritual. Reads your Google Calendar (if MCP connected), asks for your tasks, applies 80/20 logic to surface the 3 tasks that actually matter, and builds a realistic schedule.

### 3. excalidraw-diagram
Generates editable Excalidraw diagrams from a plain description. Architecture, flows, comparisons, timelines — all of it. Outputs an `.excalidraw` file you open at excalidraw.com to edit.

---

## Troubleshooting

**"claude: command not found"**
→ Node.js isn't installed or isn't in your PATH. Install Node from [nodejs.org](https://nodejs.org), restart your terminal.

**The skill doesn't trigger**
→ Check the `.md` file is in `~/.claude/skills/` (Mac) or `C:\Users\YOUR_NAME\.claude\skills\` (Windows). Also check the **description** of the skill matches your request — if your phrasing is too vague, Claude can't pick the right skill.

**Claude responds but doesn't use the skill**
→ Be explicit: "Use the morning-planner skill to plan my day."

**morning-planner doesn't write to Google Calendar**
→ That's expected: you don't have the Google Calendar MCP connected. The skill still works and outputs the schedule as markdown you can copy manually. To go further, add the Google Calendar MCP (Anthropic docs).

---

## Going further

Want:

- **To learn how to build your first AI agent end-to-end?**
  → [Build Your First AI Agent (€29)](https://taiyka.com/products/ai-agent-playbook)

- **To join a community of AI Solopreneurs + access to all my new skills, workflows and products?**
  → [The Skool community](https://taiyka.com/skool)

- **To see how I build my own skills?**
  → Follow me on [@manu_ai.to](https://instagram.com/manu_ai.to) — I publish everything in the open.

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to) · [taiyka.com](https://taiyka.com)

# Quick-start — If you only have 30 min

> For those who want to see the agent run before reading the full playbook. Follow these 6 steps, you'll have a working AI agent in 30 minutes.

---

## What you need

- An n8n account (cloud or self-hosted) — free cloud version is enough
- An Anthropic API key ([console.anthropic.com](https://console.anthropic.com)) — €5 of credit is plenty
- 30 minutes

---

## 1. Import the workflow (3 min)

1. Open your n8n
2. **+ Add workflow** → menu **... → Import from File**
3. Select `delivery/workflow/agent-starter.json`
4. You'll see 6 connected nodes appear

---

## 2. Configure (5 min)

Click the **"Edit Fields (config)"** node and replace:

| Field | Value |
|---|---|
| `anthropic_api_key` | Your Anthropic API key |
| `business_name` | Your business name |
| `business_offer` | One sentence describing what you do |

Optional: change `agent_name` ("Aria" default) and `claude_model` (`claude-sonnet-4-6` default, swap to `claude-haiku-4-5` to save cost).

---

## 3. Activate the workflow (1 min)

1. Save the workflow (Ctrl+S)
2. Activate it (toggle top-right)
3. Click the **"Webhook (incoming message)"** node → copy the webhook URL (two versions show: "Test URL" for trials, "Production URL" for prod — use Production)

---

## 4. Test (5 min)

In a terminal:

```bash
curl -X POST "https://YOUR_N8N_URL/webhook/agent-starter" \
  -H "Content-Type: application/json" \
  -d '{"user_message": "Hey, what do you offer?", "user_name": "Marie"}'
```

You should get back JSON:

```json
{
  "reply": "Hey Marie! We're [business_name]...",
  "model": "claude-sonnet-4-6"
}
```

🎉 Your first AI agent is running.

---

## 5. Customise the prompt (10 min)

Open the **"Build prompt"** node. The system prompt is in JavaScript inside. This is what defines the agent's behaviour.

**Three things to change for your case:**

- **The `# YOUR JOB`** section — describe what your agent should do for your business
- **The `# RULES (NEVER, EVER)`** section — add specific rules (e.g. "Never quote an exact price", "Never promise a delivery date")
- **The `# TONE & STYLE`** section — adapt to your brand voice

Save and re-run the test. The reply changes immediately.

---

## 6. Connect to your real channel (6 min)

The webhook accepts any source. A few quick options:

- **Website** — add a chat widget (Tidio, Chatwoot, or a custom input) that POSTs to the webhook URL
- **Instagram / Messenger** — connect a Meta Messenger node upstream of the Webhook (n8n has native nodes)
- **WhatsApp** — via Twilio or Meta WhatsApp Business
- **Email** — Gmail Trigger node upstream, which POSTs to the same endpoint

For the "actually wired to Instagram" version, follow **Chapter 3** of the full playbook.

---

## Want more?

- Read the **full playbook** (`playbook-en.md`) — 6 chapters to understand, package and **sell** your agent
- Bundle the 3 Claude skills (`delivery/skills/`) into your own projects — `agent-prompt-architect` is your best friend to design the prompt
- Join the **[Skool community](https://taiyka.com/skool)** for advanced agents (that call tools, that remember, that chain together)

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to)

Stuck? Reply to the delivery email.

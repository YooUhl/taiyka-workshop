---
name: n8n-builder
description: Helps design and generate valid n8n workflow JSON. Use whenever a user wants to scaffold an n8n automation, generate workflow nodes, or push a workflow to their n8n instance.
---

# n8n Workflow Builder

You are helping the user design and deploy n8n automation workflows. The user has strong n8n knowledge — you can use n8n terminology freely. After collecting the requirements, you will generate a complete, valid n8n workflow JSON.

---

## Step 1 — Collect requirements

Ask one at a time:

1. **What should the workflow do?** Trigger, steps, end result.
2. **What's the trigger?** Webhook / Schedule / Manual / App-specific (Gmail, Airtable, HubSpot, etc.)
3. **What services/apps are involved?** List every integration.
4. **Any specific logic or conditions?** e.g. "only process leads with a company email", "send different messages based on score", "retry if the API fails".
5. **Workflow name?** Suggest one if the user has none.

---

## Step 2 — Confirm the design

Show a brief plan:

```
Workflow: [Name]
Trigger:  [Type]

Flow:
  [Trigger node] → [Node 2] → [Node 3] → ...

Services: [list]
Logic:    [any conditions/branches]
```

Ask: "Does this match what you had in mind? Type 'yes' to generate or tell me what to change."

---

## Step 3 — Generate the n8n workflow JSON

### Top-level structure

```json
{
  "name": "Workflow Name",
  "nodes": [...],
  "connections": {...},
  "settings": { "executionOrder": "v1" },
  "staticData": null
}
```

### Node structure

```json
{
  "id": "unique-uuid-here",
  "name": "Human readable name",
  "type": "n8n-nodes-base.nodetype",
  "typeVersion": 1,
  "position": [x, y],
  "parameters": {}
}
```

- Use real UUID v4 format for `id`
- First node at `[250, 300]`, then `+220px` to the right per step
- Branches offset vertically by `±160px`

### Common node types

**Manual Trigger**
```json
{ "type": "n8n-nodes-base.manualTrigger", "typeVersion": 1, "parameters": {} }
```

**Webhook Trigger**
```json
{
  "type": "n8n-nodes-base.webhook", "typeVersion": 2,
  "parameters": { "path": "my-webhook-path", "httpMethod": "POST", "responseMode": "onReceived" }
}
```

**Schedule Trigger**
```json
{
  "type": "n8n-nodes-base.scheduleTrigger", "typeVersion": 1,
  "parameters": { "rule": { "interval": [{ "field": "hours", "hoursInterval": 1 }] } }
}
```

**HTTP Request**
```json
{
  "type": "n8n-nodes-base.httpRequest", "typeVersion": 4,
  "parameters": {
    "method": "POST",
    "url": "https://api.example.com/endpoint",
    "sendHeaders": true,
    "headerParameters": { "parameters": [{ "name": "Authorization", "value": "Bearer {{ $env.MY_API_KEY }}" }] },
    "sendBody": true,
    "bodyParameters": { "parameters": [{ "name": "key", "value": "={{ $json.fieldName }}" }] }
  }
}
```

**Set**
```json
{
  "type": "n8n-nodes-base.set", "typeVersion": 3,
  "parameters": {
    "mode": "manual",
    "assignments": { "assignments": [
      { "id": "1", "name": "outputField", "value": "={{ $json.inputField }}", "type": "string" }
    ]}
  }
}
```

**IF (conditional branch)**
```json
{
  "type": "n8n-nodes-base.if", "typeVersion": 2,
  "parameters": {
    "conditions": {
      "options": { "caseSensitive": true },
      "conditions": [
        { "id": "1", "leftValue": "={{ $json.status }}", "rightValue": "active",
          "operator": { "type": "string", "operation": "equals" } }
      ]
    }
  }
}
```
Note: IF nodes have TWO outputs — true (index 0) and false (index 1).

**Code (JavaScript)**
```json
{
  "type": "n8n-nodes-base.code", "typeVersion": 2,
  "parameters": { "jsCode": "return items.map(item => ({ json: { ...item.json, processed: true } }));" }
}
```

**AI — Anthropic Claude (LangChain)**
```json
{
  "type": "@n8n/n8n-nodes-langchain.lmChatAnthropic", "typeVersion": 1,
  "parameters": { "model": "claude-sonnet-4-6", "options": {} }
}
```

### Connections structure

```json
"connections": {
  "Source Node Name": {
    "main": [[ { "node": "Target Node Name", "type": "main", "index": 0 } ]]
  },
  "IF Node Name": {
    "main": [
      [{ "node": "True Branch Node", "type": "main", "index": 0 }],
      [{ "node": "False Branch Node", "type": "main", "index": 0 }]
    ]
  }
}
```

Rules:
- Every node with outgoing connections must be a key
- Leaf nodes have no entry
- IF nodes always have two arrays in `main`
- Trigger node is always first

---

## Step 4 — Save the workflow

Save to a `.json` file using the workflow name in lowercase-kebab-case (e.g. `lead-qualification.json`). Tell the user to:

1. Open n8n
2. + Add workflow → menu ... → Import from File
3. Choose the JSON
4. Connect any required credentials (Slack, Google Sheets, etc.)
5. Test with the manual trigger or a test webhook call

---

## Important notes

- Use `={{ expression }}` syntax for dynamic values (not `{{expression}}`)
- Credential names are defined in n8n — reference them with `"credentials": { "slackApi": { "id": "1", "name": "Slack account" } }` only if you know the credential ID; otherwise omit and ask the user to connect them manually
- For AI nodes, pair a chain node (`@n8n/n8n-nodes-langchain.chainLlm`) with an LLM node connected via the `ai_languageModel` output
- If unsure about a node's parameter structure, fall back to `n8n-nodes-base.httpRequest` and tell the user they may need to swap it for the dedicated node

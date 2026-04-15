# 50 Prompts to Automate Your Business

> The prompts I actually use in Claude, ChatGPT, n8n and my AI agents.
> — Manu, founder of [Taiyka](https://instagram.com/manu_ai.to)

---

## How to read this pack

Each prompt follows the same format:
- **Title** — what it does in 5 words
- **Use case** — when to use it
- **The prompt** — copy-paste, replace `{variables}` between braces
- **Tweak this** — how to adapt it to your context

You can use them in Claude, ChatGPT, Gemini, or plug them into an "AI Agent" / "Basic LLM Chain" node in n8n.

---

# CATEGORY 1 — CONTENT (10 prompts)

## 1. Viral Reel hook
**Use case:** generate 10 punchy hooks for an Instagram Reel from a topic.

```
You are a short-form video scriptwriter specialized in AI and entrepreneurship content.

Topic: {topic}
Audience: {audience}

Generate 10 hooks (first lines of the video, max 12 words each).

Rules:
- Create a curiosity gap — never reveal everything
- Direct address ("you")
- Mix: market observation, direct question, contrarian take, personal anecdote, shock stat
- No "In this video..." or "Today I'll show you..."
- No emojis

Format: numbered list, one hook per line.
```

**Tweak this:** add "Style: {a creator you admire}" to mimic a specific tone.

---

## 2. 30-second Reel script
**Use case:** turn an idea into a complete short video script.

```
Write a 30-second Instagram Reel script on the following topic.

Topic: {topic}
Angle: {angle — e.g. tutorial, opinion, demo}
Voice: confident, direct, conversational, "you".

Structure:
1. HOOK (0-3s) — sentence that stops the scroll
2. SETUP (3-8s) — why it matters
3. CONTENT (8-25s) — 2-3 concrete points, real examples
4. CLOSE (25-30s) — punchline, calm observation, or humor. NEVER a classic CTA like "subscribe".

Include between brackets [SHOOTING NOTES] (cuts, B-roll, on-screen text).
No jargon. No generic tips. Speak from experience.
```

**Tweak this:** specify your format (TikTok, YouTube Short, Reel) — ideal length differs.

---

## 3. Curiosity-driven Instagram caption
**Use case:** write a caption that does NOT summarize the video.

```
Write an Instagram caption for this Reel.

Video topic: {topic}
Result/promise: {what's shown}

Rules:
- 1 to 2 sentences max
- DO NOT summarize the video
- Either create curiosity, add a complementary angle, or deliver the punchline
- Confident "you" tone
- Max 1 functional emoji
- End with 4-6 hashtags: #ai #automation #entrepreneur + 2-3 contextual

```

**Tweak this:** ask for 5 variants to A/B test.

---

## 4. 7-slide LinkedIn carousel
**Use case:** generate a structured educational carousel.

```
Create a 7-slide LinkedIn carousel on this topic.

Topic: {topic}
Audience: {audience}
Goal: {educate, show a system, share an experience}

Structure:
- Slide 1: Visual hook + clear promise
- Slide 2: The problem (what people get wrong)
- Slide 3-5: 3 steps / 3 concrete ideas (max 5 words per line, "555 method")
- Slide 6: Real example or quantified result
- Slide 7: Soft CTA (open question, not "DM me")

For each slide, give:
- Title (max 6 words)
- 3-5 ultra-short bullets
- Designer note (visual, icon, screenshot)
```

**Tweak this:** ask for the "case study" version if starting from a client project.

---

## 5. Content ideas for 7 days
**Use case:** unblock weekly planning in 30 seconds.

```
Generate 7 content ideas (1 per day) for my Instagram week.

My niche: {e.g. AI automation for entrepreneurs}
My unique angle: {e.g. I build my own systems in n8n}
Audience: {audience}

Recommended mix:
- 2-3 AI tool demos (with precise name and outcome)
- 1 personal moment / journey
- 1 mindset / challenge hook
- 1 business strategy
- 1 reaction to AI news

For each idea:
- Format (Reel, carousel, story)
- Suggested hook
- One-sentence angle
- Why it'll work (1 line)
```

**Tweak this:** state your content pillars to stay aligned.

---

## 6. Repurpose: Reel → Twitter thread
**Use case:** turn a video script into an X/Twitter thread.

```
Here's one of my Reel scripts:

{script}

Turn it into a 6-8 tweet Twitter/X thread.

Rules:
- Tweet 1 = ultra-short hook (max 220 chars), should work standalone
- Following tweets = 1 idea per tweet, white space between sentences
- No hashtags except in the last one
- Last tweet = punchline or observation, never "RT if you agree"
- Voice: confident, direct, "you" if applicable

End by suggesting 3 possible visuals (screenshot, diagram, chart).
```

**Tweak this:** ask for the newsletter or LinkedIn article version too.

---

## 7. Storytelling: client project → post
**Use case:** tell a project story without breaking NDA.

```
I want to tell a client project story without naming them.

Project context: {brief description}
Problem solved: {problem}
Solution implemented: {solution}
Quantified result: {result}

Generate an Instagram post (caption + video idea) that:
- Anonymizes the client (no name, generic industry)
- Highlights THE problem + THE solution + THE result
- Stays humble — no flexing
- Inspires other entrepreneurs to automate
- Includes a strong metaphor or mental image

Format: video hook + caption + 3 alternative angles.
```

**Tweak this:** add "anonymize industry too" if NDA is strict.

---

## 8. Long-form YouTube script (8-12 min)
**Use case:** structure a long-form video.

```
Write the full structure of an 8-12 minute YouTube video.

Topic: {topic}
Promise: {what the viewer learns by the end}
Audience: {audience}

Structure:
- HOOK (0-15s) — promise + reason to stay
- INTRO (15-45s) — who I am + why listen
- 3 to 5 SECTIONS — each with: title, key takeaway, concrete example, transition
- DEMO / CASE STUDY in the middle
- OUTRO — 3-point recap + soft CTA (question or next video)

For each section, add:
- Estimated duration
- Suggested B-roll
- Transition sentence
```

**Tweak this:** ask for "tutorial" vs "opinion" version — structure changes.

---

## 9. Rewrite: bland tone → personal voice
**Use case:** rewrite generic text in your voice.

```
Here's a too-generic text:

{text}

Rewrite it in this voice:
- Confident, direct, never arrogant
- "You" address
- Short sentences
- No superlatives ("amazing", "incredible", "revolutionary")
- No tips/advice — speak from experience only
- If technical term, immediate plain explanation
- One concrete metaphor if possible
- End with a calm observation, not a forced CTA

Keep the meaning, change the style.
```

**Tweak this:** paste 2-3 examples of YOUR own writing for tighter calibration.

---

## 10. Creative brief for a designer
**Use case:** turn a visual idea into a clean designer brief.

```
Generate a creative brief for a designer based on this idea:

Idea: {visual idea}
Format: {YouTube thumbnail, carousel post, ebook cover}
Brand: {name + 2 main colors}
Audience: {audience}

Brief should contain:
1. Goal of the visual (1 sentence)
2. Mood / artistic direction (3 keywords)
3. Central element (what grabs the eye first)
4. Visual hierarchy (reading order)
5. Colors and contrast
6. Text to integrate (title, subtitle, max)
7. To avoid (anti-references)
8. 3 visual references to look up (sites, accounts, styles)
```

**Tweak this:** add the final delivery format (Figma, PDF, exact dimensions).

---

# CATEGORY 2 — SALES (10 prompts)

## 11. Personalized cold email icebreaker
**Use case:** generate a personalized opener from public info.

```
You write ONE single sentence that serves as a personalized hook for a cold prospecting email.

Prospect context:
- Company name: {company}
- Industry / city: {industry_city}
- Public detail observed (site/socials): {detail}

Strict rules:
1. ONE sentence only
2. ONE light compliment max (think "solid online presence")
3. FORBIDDEN: excessive flattery, exact numbers, the word "AI", fanboy energy
4. The sentence must read naturally before: ", which is why I'm reaching out."
5. Should feel "this person actually looked at my business" — not "this person is buttering me up to sell"

Return only the sentence, no quotes or final punctuation.
```

**Tweak this:** adapt by industry (real estate, e-commerce, agencies).

---

## 12. 4-touch cold email sequence
**Use case:** build a complete outreach sequence.

```
Build a 4-touch cold email sequence.

My offer: {one-line offer}
Target: {precise persona}
Main pain point: {pain}
Promised result: {quantified result if possible}

For each email:
1. Subject line (max 5 words, no shouty caps)
2. Body (max 80 words: personal hook → problem → proof → 1 simple question)
3. Delay since previous email

Tone: direct, professional, never aggressive sales.
- Email 1: intro + value
- Email 2: proof / case study
- Email 3: different angle or free resource
- Email 4: short, clean breakup email

No "I hope this finds you well". No pitch in email 1.
```

**Tweak this:** add "industry: {x}" to adapt vocabulary.

---

## 13. Instagram DM that doesn't feel like a pitch
**Use case:** open a conversation, not sell directly.

```
Write 5 Instagram DM variants to start a conversation with this prospect.

Target profile: {description}
My angle: {what connects me to them}
My future offer (DO NOT pitch in DM): {offer}

Rules:
- Max 2 sentences
- Reference a SPECIFIC detail of their profile or recent post
- End with ONE simple question that begs an answer
- Never a direct pitch
- Never "I saw your profile and I think it's amazing"
- No emoji unless natural

Generate 5 variants with different angles.
```

**Tweak this:** swap for LinkedIn message — only adjust length (3-4 sentences).

---

## 14. Discovery call: 10 questions to ask
**Use case:** structure a sales discovery call.

```
I have a discovery call coming up with a prospect.

Their industry: {industry}
My offer: {offer}
What I already know: {info}

Generate 10 questions in this order:
1-2: Business context (where they stand)
3-4: Current pain point (quantify if possible)
5-6: Solutions already tried
7-8: Vision / 6-12 month goals
9: Budget / decision process
10: Closing question that makes them think

For each question, add:
- Why you're asking
- What you're trying to learn
- A possible follow-up question
```

**Tweak this:** ask for the "technical audit" version if call is more tech than sales.

---

## 15. One-page commercial proposal
**Use case:** structure a short, sharp proposal.

```
Write a one-page commercial proposal for this client.

Client: {name + industry}
Identified problem: {problem}
Proposed solution: {solution}
Deliverables: {list}
Timeline: {duration}
Investment: {price} EUR

Structure:
1. CONTEXT (3 lines — current situation)
2. WHAT I PROPOSE (solution as benefit, not feature)
3. DELIVERABLES (clear list with dates)
4. INVESTMENT (price + terms)
5. WHAT HAPPENS NEXT (clear next steps)

Tone: professional, confident, NEVER salesy. Zero superlatives.
No "We are thrilled to present you...".
```

**Tweak this:** ask for "3-tier options" version for built-in upsell.

---

## 16. Objection handling: top 5 objections
**Use case:** prepare answers to classic objections.

```
My offer: {offer + price}
Target: {persona}

List the 5 most likely objections a prospect will raise, and for each:

1. The objection (as a human would phrase it, not "it's too expensive")
2. What's behind it (the real fear or block)
3. My answer in 2-3 sentences (calm, not defensive, reframes)
4. The follow-up question to keep the conversation alive

No aggressive sales tactics. We play transparency.
```

**Tweak this:** ask for "B2B enterprise" version — objections shift to procurement/risk.

---

## 17. 30-second elevator pitch
**Use case:** introduce yourself clearly at networking events or in stories.

```
Build me a 30-second-max elevator pitch.

My business: {name + activity}
For whom: {precise target}
Problem solved: {problem}
Difference vs competitors: {what makes me unique}

Structure:
- Sentence 1: who I serve and what problem I solve (not "I help people...")
- Sentence 2: HOW (the method or system, in 1 line)
- Sentence 3: concrete proof OR confident statement
- End with an open question that invites continuation

No jargon. No "passionate about". No "I'm an expert in".
Generate 3 variants (formal, casual, story).
```

**Tweak this:** specify context (tech event, dinner, podcast).

---

## 18. Follow-up email after silence
**Use case:** re-engage a prospect without being annoying.

```
Write a short follow-up email for this context:

Last exchange: {date + topic}
Likely reason for silence: {hypothesis}
My initial offer/proposal: {offer}

Rules:
- Max 60 words
- Don't apologize ("sorry to follow up")
- Bring ONE new element (market info, update, resource)
- One simple question at the end
- Tone: composed, never desperate

Generate 3 variants (market info / case study / clean breakup).
```

**Tweak this:** add "B2B enterprise tone" for stricter contexts.

---

## 19. Sales page: benefits section
**Use case:** turn features into customer benefits.

```
Here are my product features:

{list of features}

For each feature:
1. Rewrite it as a concrete BENEFIT for the customer (not "feature X" but "you get Y in less than Z")
2. Add a mini-example or metaphor that makes it tangible
3. State the deeper fear or desire it addresses

Format: 3-column table (Feature → Benefit → Emotion behind it).
Voice: "you", confident, never "discover our innovative solutions".
```

**Tweak this:** ask for 5 credible testimonial templates for this target too.

---

## 20. Post-demo follow-up (qualification)
**Use case:** send a clear recap after a product demo.

```
I just demoed my product/service to this prospect.

What was shown: {demo summary}
Their perceived reaction: {reaction}
Their main questions: {questions}
Mentioned next step: {next step}

Write a follow-up email that:
1. Recaps the demo in 3 bullets
2. Answers their questions (inline, not as attachment)
3. Confirms the next step with proposed date + time
4. Includes ONE useful link (resource, case study, doc)
5. Ends with a simple question

Max 120 words. Tone: professional, composed, not salesy.
```

**Tweak this:** add "attach a short proposal" if conversation is mature.

---

# CATEGORY 3 — OPERATIONS (10 prompts)

## 21. SOP from a process
**Use case:** document a process to delegate it.

```
Document the following process as a clear SOP a new team member could follow alone.

Process: {description in 1 paragraph}
Tools used: {tool list}
Frequency: {weekly, on-demand}

Output format:
1. PROCESS NAME + 1-line goal
2. PREREQUISITES (access, info, tools)
3. NUMBERED STEPS (each with: action, suggested screenshot, expected output)
4. WATCHOUTS (common errors)
5. SUCCESS CRITERIA (how to know it's done right)
6. ESCALATION (what to do if stuck)

Style: clear imperative ("Open X, click Y"). No unexplained jargon.
```

**Tweak this:** ask for the short checklist version for daily use.

---

## 22. n8n workflow audit
**Use case:** identify weaknesses in an existing workflow.

```
I'll describe an n8n workflow. Audit it and propose improvements.

Workflow description: {description}
Trigger: {trigger}
Main nodes: {node list}
Expected output: {output}
Observed problems: {bugs / frustrations}

Analysis:
1. WEAK POINTS (logic, error handling, performance, security)
2. HIDDEN RISKS (rate limits, sensitive data, single points of failure)
3. SIMPLIFICATIONS (nodes to merge, useless branches)
4. PRIORITY IMPROVEMENTS (top 3, ranked by impact/effort)
5. RECOMMENDED ADDITIONS (logging, retry, fallback)

For each improvement: estimated effort (S/M/L) + impact (low/medium/high).
```

**Tweak this:** paste the workflow JSON directly for ultra-precise audit.

---

## 23. Tool A → Tool B migration plan
**Use case:** structure a migration without breaking anything.

```
I'm migrating from {tool_A} to {tool_B}.

Data involved: {data types}
Volume: {approximate volume}
Constraints: {e.g. zero downtime, preserve history}

Build the migration plan:
1. PRE-MIGRATION (data audit, backup, field mapping)
2. TEST PHASE (on subset, validation criteria)
3. FULL MIGRATION (ordered steps, rollback points)
4. POST-MIGRATION (checks, team/client communication)
5. PLAN B (if all breaks, how do we revert?)

For each step: who, estimated duration, deliverable, main risk.
Format: day-by-day timeline.
```

**Tweak this:** specify number of users impacted to calibrate communication.

---

## 24. Meeting recap email (with decisions and actions)
**Use case:** close a meeting with an actionable recap.

```
Here are my raw meeting notes:

{raw notes}

Turn them into a structured recap email:
1. CONTEXT (1 line — date, attendees, topic)
2. DECISIONS MADE (clean bullet list)
3. ACTIONS (table: action / owner / deadline)
4. OPEN POINTS (to decide later)
5. NEXT MEETING (proposed date + short agenda)

Tone: factual, professional, zero fluff.
If info is ambiguous in notes, mark [TO CONFIRM] rather than inventing.
```

**Tweak this:** ask for "internal" vs "client-facing" version — formality differs.

---

## 25. Weekly task plan (80/20 method)
**Use case:** prioritize when everything feels urgent.

```
Here are all my tasks for the week:

{task brain dump}

My 3 weekly priorities:
1. {priority 1}
2. {priority 2}
3. {priority 3}

Apply 80/20:
1. Identify the 20% of tasks producing 80% of impact on my priorities
2. Sort the rest into: delegate / postpone / delete
3. Propose a 5-day time-blocked plan, max 6 blocks/day
4. Block types: 🎯 Deep work (90 min) · 📋 Admin (30-45 min) · ☕ Break (15 min) · 🍽️ Meal
5. Identify THE one project that, if shipped this week, moves the whole month

No disguised procrastination. If a task isn't aligned to a priority, say so.
```

**Tweak this:** add your constraints (fixed meetings, energy peaks).

---

## 26. New client onboarding checklist
**Use case:** standardize the start of a client project.

```
Create an onboarding checklist for a new client.

Project type: {type}
Duration: {duration}
Main deliverables: {deliverables}

Structure:
1. BEFORE KICK-OFF (signature, deposit, accesses)
2. KICK-OFF MEETING (typical agenda, duration, info to collect)
3. WEEK 1 (technical setup, intros, first deliverables)
4. RITUALS (recurring meetings, reporting, comms channel)
5. END CRITERIA (final delivery, knowledge transfer, testimonial collection)

For each item: owner, relative deadline, concrete deliverable.
Also generate 5 key questions to ask at kick-off to avoid surprises.
```

**Tweak this:** specify preferred channel (Slack, Notion, email) to adapt rituals.

---

## 27. Inbox triage with clear rules
**Use case:** design an inbox sorting system.

```
My inbox is overflowing. Help me design a sorting system.

Email types I receive: {types list}
Estimated daily volume: {volume}
My priorities: {priorities}

Propose:
1. A LABEL/FOLDER SYSTEM (max 6, never more)
2. AUTOMATIC SORTING RULES (to recreate in Gmail/Outlook)
3. MANUAL TRIAGE CRITERIA (morning/evening, in 5 min)
4. THE 2-MIN RULE (what to handle immediately vs defer)
5. INBOX ZERO ROUTINE (frequency, max duration)

Include: 3 quick-reply templates to copy-paste for recurring emails.
```

**Tweak this:** add "I have an assistant" if you want delegation mode.

---

## 28. Write a technical README
**Use case:** document a code/automation project for others.

```
Write a README for this project:

Name: {name}
Goal: {1-sentence goal}
Stack: {techs used}
README audience: {junior dev, client, partner}

Structure:
1. ## What it does — 2 lines max
2. ## Why it exists — the problem it solves
3. ## How it works — mental diagram or ASCII if relevant
4. ## Setup — precise steps to run locally
5. ## Configuration — env vars, secrets, .env example
6. ## Usage — concrete command examples
7. ## Troubleshooting — top 3 likely errors and fixes
8. ## Contact — who to ask if stuck

Style: direct, simple, no unexplained jargon.
```

**Tweak this:** ask for the "non-tech" version for a client just consuming the output.

---

## 29. Prepare a project kick-off
**Use case:** structure a project launch meeting.

```
I need to facilitate a kick-off for this project:

Project: {name + goal}
Project duration: {duration}
Team: {participants}
Budget: {if relevant}

Build the kick-off agenda (60-90 min):
1. CONTEXT & STAKES (10 min)
2. GOALS & SUCCESS METRICS (15 min)
3. SCOPE & DELIVERABLES (15 min)
4. ROLES & RESPONSIBILITIES (light RACI, 10 min)
5. TIMELINE & MILESTONES (15 min)
6. RISKS & DEPENDENCIES (10 min)
7. RITUALS & COMMS (5 min)

For each section: 3 questions to ask aloud, suggested format (whiteboard, shared doc), expected output.
End with: 5 questions to send participants BEFORE the meeting so they arrive prepped.
```

**Tweak this:** specify if project is internal or client-facing — dynamic shifts.

---

## 30. Choose between 2 tools (decision framework)
**Use case:** decide a tech choice without procrastinating.

```
I need to choose between {tool_A} and {tool_B} to solve {problem}.

My constraints:
- Budget: {budget}
- Available technical skill: {level}
- Non-negotiable criteria: {list}
- Volume / scale: {volume}

Build a decision matrix:
1. CRITERIA (5-7 weighted criteria based on what I said)
2. COMPARISON TABLE (1-5 score per criterion, 1-line justification)
3. WEIGHTED FINAL SCORE
4. CLEAR RECOMMENDATION (not "it depends") + 1 risk to monitor
5. PLAN B if the rec doesn't work in 3 months

If one option wins on 80% but loses on 1 dealbreaker, say so explicitly.
```

**Tweak this:** add "time horizon" — short vs long term shifts criterion weights.

---

# CATEGORY 4 — RESEARCH (10 prompts)

## 31. Quick synthesis of a long article
**Use case:** turn a 3000-word article into useful notes.

```
Here's a long article:

{article text}

Synthesize it for someone who has no time to read.

Format:
1. MAIN THESIS (1 clear sentence)
2. 5 KEY IDEAS (1 line each, no fluff)
3. STATS / FACTS WORTH KEEPING (3-5 max, sourced from text if possible)
4. STRONG QUOTE (1 verbatim sentence to reuse)
5. WHAT'S MISSING / UNCOVERED ANGLES (critical view, 2-3 points)
6. IF YOU HAD TO TURN IT INTO A CONTENT POST: proposed angle in 1 sentence

Tone: factual, not servile. Never invent a stat absent from the text.
```

**Tweak this:** ask for "casual tone" for immediate social use.

---

## 32. Competitor watch
**Use case:** analyze a competitor to learn from or differentiate.

```
Analyze this competitor and give me a strategic brief.

Competitor: {name + URL}
My business: {name + activity}
What you know about their offer: {info}

Analysis:
1. POSITIONING (2 sentences — who they serve and how they present themselves)
2. OFFER (products, prices, business model)
3. STRENGTHS (3 max)
4. VISIBLE WEAKNESSES / GAPS (3 max)
5. DIFFERENTIATION ANGLES for ME (3 concrete ideas)
6. WHAT THEY DO BETTER THAN ME (steal / get inspired)
7. WHAT I DO BETTER THAN THEM (highlight more)

Be honest, neither flattering them nor me.
```

**Tweak this:** add "look at their last 5 posts on {platform}" for content analysis.

---

## 33. Customer persona analysis
**Use case:** document a target profile to align tone and offer.

```
Build a detailed persona for my target:

Quick description: {2-3 line description}
My current offer: {offer}

The persona must contain:
1. FIRST NAME + AGE + PROFESSIONAL CONTEXT (alive paragraph, not robotic)
2. A TYPICAL DAY (morning/day/evening, 5 lines)
3. DEEP PAINS (3 — not generic "no time")
4. DEEP DESIRES (3 — beyond business)
5. LIKELY OBJECTIONS to my offer
6. WHERE THEY HANG OUT (networks, communities, media)
7. WHAT THEY'VE ALREADY TRIED (and why it failed)
8. KEY MESSAGE that resonates with this persona

Avoid clichés. If info is missing, mark [TO VALIDATE WITH CUSTOMER INTERVIEW].
```

**Tweak this:** ask for 3 personas if hesitating between targets.

---

## 34. Market research: 3 uncovered angles
**Use case:** find a positioning opportunity.

```
I want to enter the market of {market / niche}.

What I know:
- Main competitors: {list}
- Typical audience: {description}
- My strengths: {strengths}

Identify:
1. THREE UNCOVERED ANGLES on this market (obvious gaps)
2. FOR EACH ANGLE:
   - Why nobody owns it (real reason or oversight?)
   - Audience size it could reach
   - Difficulty for ME to claim it (1-10)
3. RECOMMENDATION: which angle to attack first + first content to publish in 24h

Be critical. If an "uncovered angle" is actually a graveyard (already tried + flopped), say so.
```

**Tweak this:** add "horizon: launch in 30 days" to force concretization.

---

## 35. Decode a technical topic for a beginner
**Use case:** quickly understand a complex topic before a call.

```
Explain {technical topic} like I'm 14, but with the goal of explaining it back to a client.

Format:
1. ANALOGY (everyday life)
2. WHAT IT IS in 1 sentence
3. WHY IT EXISTS (the problem it solves)
4. HOW IT WORKS in 3 simple steps
5. CONCRETE EXAMPLE
6. WHAT A BUSINESS CLIENT SHOULD REMEMBER (not the tech, the ROI/usage)
7. CLASSIC PITFALLS / MISCONCEPTIONS
8. IF I WANT TO LEARN MORE: 3 resources to dig

No unexplained jargon. If a term appears, immediate definition in parens.
```

**Tweak this:** specify "for a {industry} client" to adjust examples.

---

## 36. Compare 5 tools across 5 criteria
**Use case:** mini tool review without losing 3 hours.

```
Compare these 5 tools across these 5 criteria:

Tools: {5 tools}
Criteria: {5 criteria — e.g. price, learning curve, integrations, scaling, support}
My context: {precise need}

Output:
1. COMPARISON TABLE (5 tool columns × 5 criterion rows, 1-5 score)
2. FOR EACH TOOL: 1 strength + 1 weakness, 1 line each
3. RECOMMENDATION for MY context (not generic)
4. RUNNER-UP (if rec doesn't fit, which to pick?)
5. PITFALL TO AVOID (the tool that looks good but will block you in 6 months)

Don't invent. If unsure about a feature, mark [TO VERIFY].
```

**Tweak this:** ask for "free vs paid" version to decide on cost.

---

## 37. User research brief (interviews)
**Use case:** prepare 5 customer interviews in 1h.

```
I want to interview 5 people in my target to validate a product idea.

Idea: {idea in 1 paragraph}
Target: {persona}

Build:
1. INTERVIEW GOAL (1 sentence — what I must learn)
2. 10 QUESTIONS in this order:
   - 2 context questions (warm them up)
   - 3 questions on their CURRENT problem (never about my solution)
   - 2 questions on their "job-to-be-done"
   - 2 questions on current solutions (and what fails)
   - 1 closing question that opens a follow-up
3. WHAT TO LISTEN FOR (not just hear)
4. RED FLAGS that invalidate the idea
5. GREEN FLAGS that confirm the opportunity

NEVER closed questions like "would you pay $X for this?" — doesn't work.
```

**Tweak this:** specify "format: 30 min Zoom" to calibrate depth.

---

## 38. Synthesis of contradictory sources
**Use case:** see clearly when everyone disagrees.

```
Here are several sources on the same topic:

Topic: {topic}
Source 1: {summary / extract}
Source 2: {summary / extract}
Source 3: {summary / extract}

Synthesize:
1. CONSENSUS POINTS (where they agree)
2. DIVERGENCE POINTS (where they oppose — without taking sides)
3. WHY they diverge (methodology? bias? different data?)
4. WHAT YOU'D CONCLUDE if you had to act today
5. WHAT'S MISSING to settle definitively (data to find, expert to interview)

Be nuanced. Don't flatten divergences. Avoid "the truth is in between" if it's not true.
```

**Tweak this:** add source dates — important for fast-evolving topics.

---

## 39. Brief before writing a long article
**Use case:** structure a 1500-2500 word article before writing.

```
I want to write a long article on this topic:

Topic: {topic}
Audience: {audience}
Article promise: {promise}
SEO keywords if relevant: {keywords}

Build the brief:
1. UNIQUE ANGLE (different from top 10 Google results)
2. DETAILED OUTLINE (H1 + 5-7 H2 + 2-3 H3 under each H2)
3. FOR EACH H2: 1-line key takeaway + example/data to include
4. SUGGESTED INTRO (3 sentences — hook, context, promise)
5. SUGGESTED CONCLUSION (3 sentences — recap, opening, soft CTA)
6. 3 VISUAL IDEAS (diagram, screenshot, infographic)
7. 5 POSSIBLE INTERNAL LINKS (to other content)

No "In this article we'll see...". Start with a statement.
```

**Tweak this:** specify SEO vs LinkedIn vs newsletter — ideal structure differs.

---

## 40. Decode a contract / legal text
**Use case:** understand legal text in 5 minutes.

```
Here's a legal text:

{text}

Analyze it for someone who isn't a lawyer.

Format:
1. WHAT IT'S ABOUT in 1 sentence
2. PARTIES INVOLVED
3. MAIN COMMITMENTS of each party
4. CLAUSES TO WATCH (termination, IP, payment, exclusivity)
5. RED FLAGS — unusual or risky clauses
6. POINTS TO NEGOTIATE if still possible
7. IN ONE SENTENCE: sign or not? (with conditions)

Disclaimer: always end with "This is not professional legal advice. For important agreements, consult a lawyer."
```

**Tweak this:** specify context (B2B client, freelance, partnership) — risk shifts.

---

# CATEGORY 5 — CUSTOMER SUPPORT (10 prompts)

## 41. Reply to an unhappy customer
**Use case:** defuse a tense written situation.

```
A customer is unhappy. Here's their message:

{customer message}

Context:
- Product/service involved: {product}
- What actually happened: {facts}
- Our share of responsibility: {share}

Write a reply that:
1. Acknowledges their feeling (without saying "I understand your frustration" — phrase it differently)
2. States the FACTS (no excuses, no blame)
3. Proposes ONE concrete solution + a plan B
4. Gives a precise resolution timeline
5. Ends with an opening (offer to discuss by phone if needed)

Tone: professional, calm, firm. Not servile, not defensive. Max 150 words.
```

**Tweak this:** specify if at fault or not — tonality shifts.

---

## 42. Product FAQ (from customer questions)
**Use case:** turn repeated questions into clean FAQ.

```
Here are the 10 most-asked questions from my customers:

{raw question list}

For each question:
1. Reformulate as a customer would NATURALLY say it (never "How can I...")
2. Clear answer in 2-3 sentences max
3. If relevant: link to resource OR contact for deeper help
4. Tag: {basic / advanced / billing / technical / other}

Final format: Q/A table + tag + link.
Style: direct, "you", confident, never "feel free to contact us".
Order FAQs from most to least frequent.
```

**Tweak this:** ask for "5 FAQ version" if you want the 5 most strategic for your sales page.

---

## 43. Day 0 onboarding email
**Use case:** first email after purchase.

```
Write the onboarding email sent right after purchase of this product.

Product: {name + 1-line description}
Customer type: {persona}
Access link: {URL}

Structure:
1. Subject (max 5 words, can include emoji if natural)
2. Hello + short acknowledgment
3. DIRECT ACCESS to product (clear link)
4. 3 STEPS TO GET STARTED (1 line each)
5. WHERE TO BEGIN: the FIRST thing to do (1 concrete tip)
6. How to reach me if stuck
7. Short signature

Max 150 words. Tone: confident, "you", never "Thank you so much for your trust".
```

**Tweak this:** add "PS: next recommended product" if relevant upsell.

---

## 44. "You haven't used X yet" reactivation email
**Use case:** reactivate a customer who bought but didn't use.

```
Write a reactivation email for this context:

Product purchased: {product}
Purchase date: {date}
Activity since: {opened email but didn't download / downloaded but didn't use}

Email:
1. Subject (curiosity, not guilt)
2. Acknowledge life is busy (1 line, not servile)
3. Reminder of main product benefit (1 line, don't re-explain everything)
4. ONE single ULTRA SIMPLE next step (not "5 steps")
5. Open question that invites a reply
6. Signature

Max 100 words. No "You forgot to...". Keep dignity.
```

**Tweak this:** add "+ propose 15-min express call" if premium customer.

---

## 45. Reply to refunds / cancellations
**Use case:** handle a refund with class.

```
A customer asks for a refund. Their message:

{message}

Context:
- Product: {product + price}
- Refund policy: {policy}
- Customer tenure: {tenure}
- Stated reason: {reason}

Write a reply that:
1. Confirms request received without drama
2. If refund is possible and justified: confirm timing + process
3. If you want to understand why (useful for improvement): ONE optional question
4. Keeps door open (without pushing to repurchase)
5. Ends with a human note

NEVER: "are you sure?", "did you really try?", "we're sad to see you go...". Max 100 words.
```

**Tweak this:** specify if you want to ask for testimonial or not.

---

## 46. Macro reply for recurring question
**Use case:** create a reusable template for the 50th time the same question comes in.

```
Recurring question: {question}
My context: {related product/service}

Create a "macro" reply:
1. SHORT VERSION (3-4 sentences — for Slack/DM)
2. MEDIUM VERSION (1 paragraph — for email)
3. LONG VERSION (with link to doc — for support ticket)

Each version must:
- Answer the question directly (no preamble)
- Anticipate the logical next sub-question
- Include a resource link if useful
- Stay "human" even though it's a template

No "Hello, thank you for your message". Get straight to the point.
```

**Tweak this:** create 10 macros at once for your top 10 questions = lighter inbox.

---

## 47. Post-delivery survey (improved NPS)
**Use case:** collect useful feedback, not just a number.

```
I want to collect feedback after delivering this product/service:

Product: {product}
Target: {customer type}

Build a 5-question max survey:
1. A quantitative NPS-style reformulated question
2. An open qualitative question on THE moment they felt the value
3. A question on what was missing / what they'd have liked more
4. A question on context (who would they recommend this to?)
5. A closing question to collect a testimonial if NPS is high

Tone: conversational, not corporate. Short (max 3 min to fill).
Bonus: for each question, indicate WHY you ask (business goal).
```

**Tweak this:** add "Tally format" for export-ready output.

---

## 48. Soft upsell pitch
**Use case:** propose the next product without breaking the relationship.

```
My customer bought {current_product}.
The next logical tier is {next_product} (at {price} EUR).

Write a 2-email sequence over 14 days:

Email 1 (D+10): focused on the CONCRETE value they already got from current product + engagement question.
Email 2 (D+14): present next product as the NATURAL continuation, not a new pitch. Include:
- What it solves at the next level
- What concretely changes vs today
- Direct link, transparent price
- One single offer, no bundles

Tone: confident, "you", NEVER "exclusively for you". Max 120 words per email.
```

**Tweak this:** specify if you want to insert a customer testimonial between Email 1 and Email 2.

---

## 49. Bug report from customer
**Use case:** help a non-tech customer report a bug clearly.

```
A customer reports a problem but their description is confusing:

Raw customer message: {message}

Reformulate as a clear bug ticket:
1. ONE-LINE SUMMARY (for ticket title)
2. STEPS TO REPRODUCE (step by step, what the customer did)
3. ACTUAL RESULT (what they saw)
4. EXPECTED RESULT (what they should have seen)
5. ENVIRONMENT (device, browser, version — if in message or to ask)
6. PROPOSED SEVERITY: critical / high / medium / low
7. MISSING INFO (to ask the customer in one short message)

Also include: the message to send BACK to the customer for missing info (polite, short, max 50 words).
```

**Tweak this:** specify your stack to suggest the right technical questions.

---

## 50. End-of-mission email (client closure)
**Use case:** close a client project cleanly.

```
The project with this client is ending.

Project: {name + deliverables}
Duration: {duration}
Result obtained: {quantified result if possible}

Write the closing email:
1. RECAP OF WHAT WAS DONE (3 bullets)
2. KNOWLEDGE TRANSFER (accesses, doc, useful contacts)
3. WHAT WORKED + ONE honest learning from our side
4. POSSIBLE NEXT STEPS (without pitching) — if future evolution, how to reach me
5. TESTIMONIAL REQUEST (1 sentence, optional for them, format their choice)
6. Human closing note

Tone: pro, composed, sincere. Max 200 words. No generic "It was a pleasure working with you".
```

**Tweak this:** add "+ propose 30-min retro" if relationship is strong.

---

## What's next?

Want to go further with AI?

- 🤖 **Build your first AI agent from scratch (Claude + n8n)?**
  → [Build Your First AI Agent ($29)](https://taiyka.com/products/ai-agent-playbook)

- 📊 **An evolving library of prompts + workflows + templates inside a real community?**
  → [The Skool community](https://taiyka.com/skool)

---

**Manu** · [@manu_ai.to](https://instagram.com/manu_ai.to) · [taiyka.com](https://taiyka.com)

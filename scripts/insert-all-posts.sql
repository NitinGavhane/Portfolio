-- Upserts all blog posts into Supabase. Safe to re-run.

INSERT INTO blog_posts (title, slug, content, excerpt, category, image_url, read_time, published, created_at, updated_at)
VALUES (
  'I Switched to OpenRouter Six Months Ago — Here''s What Nobody Tells You About It',
  'openrouter-guide-and-monetization',
  'Hi everyone, I am Nitin Gavhane and I want to talk about a tool that quietly changed how I build and charge for AI projects.

Last year I was managing separate API keys for OpenAI, Anthropic, and Mistral across three different client projects. Each had its own billing dashboard, its own rate limits, its own quirks. When a client asked "how much did this cost to run last month?" I had to open three tabs and do mental math.

Then I started routing everything through OpenRouter. One key. One dashboard. Access to over 200 models. And a monetization layer that lets you charge clients for AI usage without building your own billing system from scratch.

This post is the setup guide I wish existed when I started. No filler, just the actual steps — plus the monetization angle that most OpenRouter tutorials completely skip.

## What OpenRouter Actually Is

OpenRouter is a unified API gateway that sits between your application and every major LLM provider. Instead of integrating OpenAI''s SDK, then Anthropic''s SDK, then Mistral''s, you make one standard API call and tell OpenRouter which model you want.

```
Your App → OpenRouter → OpenAI / Anthropic / Mistral / Meta / Google / etc.
```

The request format follows the OpenAI standard, which means if you''ve already built something with GPT-4o, you can switch to Claude or Llama with one line change.

Why does this matter in 2026 specifically? Because the model landscape shifts fast. Models that were state-of-the-art six months ago are now mid-tier. Prices drop constantly. New open-source models release monthly. If you''re locked into one provider''s SDK, every time you want to try a cheaper or better model, you''re doing an integration project. OpenRouter turns that into a config change.

## Setting Up OpenRouter: The Actual Steps

### Step 1 — Create an account and get your API key

Go to openrouter.ai, sign up, and open [Keys](https://openrouter.ai/keys) in the dashboard. Create a new key and copy it somewhere safe.

```
# Save this in your .env file - never hardcode it
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

### Step 2 — Add credits

OpenRouter uses prepaid credits. You load money in, it tracks usage across all the models you call. Go to Credits in the dashboard and add at least $5 to start — enough to run thousands of test calls on cheaper models.

### Step 3 — Make your first API call

The base URL is https://openrouter.ai/api/v1. The format is identical to OpenAI''s chat completions endpoint.

```
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

def call_openrouter(prompt: str, model: str = "anthropic/claude-sonnet-4") -> str:
    response = httpx.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {os.getenv(''OPENROUTER_API_KEY'')}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://yourapp.com",   # Required by OpenRouter
            "X-Title": "Your App Name"                # Shows in their dashboard
        },
        json={
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 1000
        }
    )
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]

# Test it
result = call_openrouter("Explain vector embeddings in one paragraph.")
print(result)
```

That''s it. You''re calling Claude through OpenRouter. Swap model to "openai/gpt-4o" or "meta-llama/llama-3.1-70b-instruct" and the rest of the code stays the same.

### Step 4 — Use the OpenAI SDK (optional but convenient)

If you already use the OpenAI Python SDK, you can point it at OpenRouter with two lines changed:

```
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

response = client.chat.completions.create(
    model="google/gemini-2.0-flash-001",
    messages=[{"role": "user", "content": "What changed in AI in 2025?"}],
    extra_headers={
        "HTTP-Referer": "https://yourapp.com",
        "X-Title": "Your App Name"
    }
)
print(response.choices[0].message.content)
```

Your existing OpenAI code works as-is. Just change the base URL and swap the key.

## Choosing the Right Model for the Job

This is where OpenRouter pays for itself. Different models have wildly different price-to-performance profiles. Here''s a practical breakdown of what to use when:

| Use case | Model(s) | Why |
| --- | --- | --- |
| Production, quality-critical | anthropic/claude-sonnet-4, openai/gpt-4o | Higher cost, more reliable structured outputs, better instruction following |
| High-volume, cost matters | google/gemini-2.0-flash-001, meta-llama/llama-3.1-8b-instruct | Fast, cheap, good enough for classification, summarization, extraction |
| Coding & technical | anthropic/claude-sonnet-4, deepseek/deepseek-r1 | Strong code generation, follows technical specs well |
| Free testing in dev | Models with a :free suffix on the Models page | Develop and test before switching to a paid model |

```
# Example: route to different models based on task type
def smart_route(task_type: str, prompt: str) -> str:
    model_map = {
        "summarize":   "google/gemini-2.0-flash-001",     # Fast, cheap
        "code_review": "anthropic/claude-sonnet-4",        # High quality
        "classify":    "meta-llama/llama-3.1-8b-instruct", # Very cheap
        "draft_email": "openai/gpt-4o-mini",               # Balanced
    }
    model = model_map.get(task_type, "anthropic/claude-sonnet-4")
    return call_openrouter(prompt, model)
```

This alone — routing tasks to the cheapest model that handles them well — can cut API costs by 60–70% on a typical multi-feature application.

## The Monetization Part Nobody Talks About

Most OpenRouter tutorials cover setup and stop there. Here''s the part that actually makes this interesting for developers building products.

### Method 1 — The markup model (simplest)

You charge clients a monthly retainer or per-use fee. Your actual cost to serve them is your OpenRouter bill. The margin in between is yours.

Example: you build a content generation tool for a client. They use roughly 2M tokens per month. At Gemini Flash rates (~$0.15 per million tokens), your cost is $0.30/month. You charge them $99/month. The gap is your product margin.

This works for freelancers and agencies. The key is knowing your actual cost before you price. OpenRouter''s dashboard shows per-model usage breakdowns — use that to price confidently.

### Method 2 — Usage-based billing with key credits

OpenRouter has a feature called API Key Credits that changes how you can build products. Instead of sharing your own API key (never do this), you generate per-user keys and provision them with a credit limit. When that limit is hit, the key stops working. You control the top-up.

```
import httpx
import os

def create_user_api_key(user_id: str, credit_limit_usd: float = 5.0) -> dict:
    """
    Create a provisioned API key for a specific user.
    Set their spending limit in USD.
    """
    response = httpx.post(
        "https://openrouter.ai/api/v1/keys",
        headers={
            "Authorization": f"Bearer {os.getenv(''OPENROUTER_API_KEY'')}",
            "Content-Type": "application/json"
        },
        json={
            "name": f"user-{user_id}",
            "limit": credit_limit_usd  # USD spending limit
        }
    )
    response.raise_for_status()
    return response.json()

# When a new user signs up for your app:
new_key = create_user_api_key("user_12345", credit_limit_usd=2.0)
print(f"User key created: {new_key[''key'']}")
```

Now you have a model where each user gets their own capped key; when they hit the limit they''re prompted to top up (you charge them via Stripe, then add more credits via the API); and you can track per-user spending natively — no custom metering infrastructure required. This is how you build a usage-based SaaS on top of AI APIs without building billing from scratch.

### Method 3 — White-label AI tools for clients

This is the most common freelance AI engagement in 2026: a client wants an AI tool with their own branding. They don''t want to manage OpenAI accounts, API keys, or model decisions. They just want a thing that works.

Your stack: OpenRouter handles all model access and billing aggregation; a FastAPI backend routes requests and applies your system prompts; a simple frontend (or an integration into their existing tool). You invoice them monthly; your cost is your OpenRouter spend.

```
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
import os

app = FastAPI()

CLIENT_CONFIGS = {
    "client_abc": {
        "system_prompt": "You are a support assistant for ABC Corp.",
        "model": "google/gemini-2.0-flash-001",
        "max_tokens": 500
    },
    "client_xyz": {
        "system_prompt": "You are a legal document reviewer. Flag unclear clauses.",
        "model": "anthropic/claude-sonnet-4",
        "max_tokens": 2000
    }
}

class ChatRequest(BaseModel):
    message: str
    client_id: str

@app.post("/chat")
async def chat(request: ChatRequest):
    config = CLIENT_CONFIGS.get(request.client_id)
    if not config:
        raise HTTPException(status_code=404, detail="Client not found")
    response = httpx.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {os.getenv(''OPENROUTER_API_KEY'')}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://youragency.com",
            "X-Title": "Client AI Tool"
        },
        json={
            "model": config["model"],
            "messages": [
                {"role": "system", "content": config["system_prompt"]},
                {"role": "user", "content": request.message}
            ],
            "max_tokens": config["max_tokens"]
        }
    )
    data = response.json()
    return {"response": data["choices"][0]["message"]["content"]}
```

One backend, multiple clients, each getting a different AI behavior. You don''t need to run separate deployments per client.

### Method 4 — Build and sell prompt packs + API access

This one requires a bit of audience building but scales well. You create a library of production-ready prompts for a specific niche — legal, real estate, e-commerce, HR. Each prompt is tested, documented, and formatted to work with specific OpenRouter models. You sell access to the prompt library as a product and optionally bundle API credits so buyers can start running them immediately. The OpenRouter credits API makes this straightforward: each buyer gets a provisioned key with a fixed credit amount included in their purchase price.

## Things to Watch Out For

**Model availability changes without warning.** A model can be deprecated or temporarily unavailable. If your production app is hardcoded to one specific model string, a deprecation notice can break everything. Add a fallback:

```
MODELS_BY_PRIORITY = [
    "anthropic/claude-sonnet-4",
    "openai/gpt-4o",
    "google/gemini-2.0-flash-001"
]

def call_with_fallback(prompt: str) -> str:
    for model in MODELS_BY_PRIORITY:
        try:
            return call_openrouter(prompt, model)
        except httpx.HTTPStatusError as e:
            if e.response.status_code in (503, 429):
                continue  # Try next model
            raise
    raise RuntimeError("All models unavailable")
```

**Free models have rate limits that will surprise you.** If you''re testing on a free-tier model and it works fine, don''t assume the same throughput applies in production. Check the model card on OpenRouter for rate limit details before you deploy.

**Context windows vary by model.** Gemini Flash handles 1M token contexts. Llama 8B handles much less. If your app passes long documents, test your model choice against real document sizes before launch.

**Your HTTP-Referer header affects request attribution.** OpenRouter tracks which site/app requests come from. Use a real URL you control. It affects how your usage appears in their dashboard and can matter if you ever need to dispute a charge.

## A Realistic Monthly Cost Breakdown

For a small content tool with 50 active users, each making ~20 requests/day:

```
Total requests: 50 users × 20 requests × 30 days = 30,000 requests/month
Average tokens per request: ~800 input + ~400 output = ~1,200 tokens

Using Gemini Flash ($0.15/M input, $0.60/M output):
Input cost:  (50 × 20 × 30 × 800) / 1,000,000 × $0.15  = ~$3.60
Output cost: (50 × 20 × 30 × 400) / 1,000,000 × $0.60  = ~$7.20
Total API cost: ~$10.80/month
```

If you charge users $9/month: revenue $450, cost $10.80, margin $439.20. The math on AI SaaS is genuinely good when you route to the right model. The mistake most people make is defaulting to the highest-quality model for every request instead of matching model tier to task complexity.

## Where to Go From Here

If you''re building a new AI project in 2026, OpenRouter is worth starting with rather than going direct to a single provider. The cost visibility alone is worth it — you know exactly what every model costs per call before you commit to a pricing model.

The monetization path that works fastest: pick a niche where people have a repetitive AI task they''re currently doing manually, wrap the right model + prompt in a clean interface, and charge a flat monthly fee. Your infrastructure cost with OpenRouter will be a fraction of what you charge. Start with one use case, get the cost math right, then scale.',
  'One API key, one dashboard, 200+ models — plus a monetization layer most tutorials skip. My practical OpenRouter setup guide, model-routing strategy, and four ways to actually charge for AI usage.',
  'AI',
  '',
  '10 min read',
  true,
  '2026-07-05T00:00:00.000Z',
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title      = EXCLUDED.title,
  content    = EXCLUDED.content,
  excerpt    = EXCLUDED.excerpt,
  category   = EXCLUDED.category,
  image_url  = EXCLUDED.image_url,
  read_time  = EXCLUDED.read_time,
  published  = EXCLUDED.published,
  updated_at = NOW();

INSERT INTO blog_posts (title, slug, content, excerpt, category, image_url, read_time, published, created_at, updated_at)
VALUES (
  'I Wasted 40+ Hours Setting Up Claude Code. This Free Repo Does It in 120 Seconds.',
  'everything-claude-code-setup-in-120-seconds',
  'Hi everyone, I am Nitin Gavhane and in this blog I want to tell you about something that genuinely made me a little annoyed — because I wish I''d found it months earlier.

If you''ve been using Claude Code for any serious development work, you already know the problem. You install it, open the terminal, start typing — and it works. But something feels off. Like you''ve been given a race car with no engine tuned. It moves, but it''s not doing what you saw on that YouTube video or that Twitter thread. Everyone else seems to be getting so much more out of it.

That gap is real. And there''s a free, open-source repo that closes it in about two minutes. It''s called everything-claude-code. 140,000 GitHub stars. 21,000 forks. Won the Anthropic Hackathon. And until recently, I had no idea it existed.

## The Actual Problem with Vanilla Claude Code

Out of the box, Claude Code is an empty vessel. That''s not an insult — it''s just what it is. The core engine is there, but everything around it — the workflow structure, the agents, the automation rules, the security layer — you''re expected to build all of that yourself. Most people don''t, because it takes weeks.

The four pain points that trip everyone up:

- **No pre-built agents.** You need specialized planners, reviewers, auditors, fixers — none of that ships with Claude Code. You build them from scratch or you don''t have them.
- **Manual configuration.** The .claude.md file that controls Claude''s behavior in your project has to be written by hand. Most people write a mediocre version and wonder why Claude keeps going off-script.
- **Custom hook writing.** Hooks are how you automate things — run tests on file save, enforce code style, trigger security checks. Writing them correctly is tedious and brittle if you don''t know what you''re doing.
- **Guesswork on model routing.** Which tasks should go to Opus? Which to Sonnet? Most people default to Opus for everything and quietly pay 5x more than they need to.

The result: 40+ hours burned on setup before you''ve shipped anything real.

## What everything-claude-code Actually Is

It''s a complete performance optimization system for Claude Code. One repo that turns a blank command-line tool into a fully configured, cross-platform AI dev team — and it works whether you''re using Cursor, Open Code, or the plain CLI. Here''s what''s inside:

- **48 Agents** — specialized operators that work autonomously. Planners that map out features before any code gets written. Reviewers that catch logic issues. Auditors that scan for security holes. Fixers that take a failing test and correct the implementation.
- **182 Skills** — the toolkit layer. Enforced TDD patterns so Claude doesn''t skip tests when you''re in a hurry. Frontend and backend routines. DevOps runbooks. API design patterns. Repeatable behaviors Claude applies consistently, not things you re-explain every session.
- **68 Commands** — the interface layer. Shims, hooks, rules, and MCP configurations that execute reliably. This is the plumbing that makes everything else work without you babysitting it.

The comparison to a vanilla setup is stark:

|  | Vanilla Claude Code | Everything Repo |
| --- | --- | --- |
| Setup time | Weeks | Under 2 minutes |
| Architecture | You build the scaffolding | 48 pre-configured agents |
| Security | Manual code review | 1,282 automated tests |
| Cost | $20–$50/mo for plugins | $0.00, open source |

## The Features That Actually Change How You Work

### /plan — architecture before code

This was the first thing that made me stop and actually pay attention. You type:

```
> /plan Add user authentication with OAuth
```

And instead of Claude immediately starting to write files, it generates a complete implementation blueprint first. You get the full file structure mapped out — auth provider, hooks, service layer, components, pages, test files. Edge cases flagged. Required files listed before a single line of code is written. It saves 30+ minutes per feature just in planning, and it catches the architectural mistakes you''d normally only discover two hours into building.

### Agent Shield — security auditing built in

```
> npx cc agent shield scan
Scan Complete: 1,282 Tests Executed. Grade: A+
```

Real vulnerability analysis against your entire workspace. Not "here are some best practices" — actual test execution covering SQL injection, XSS, OWASP Top 10, auth vulnerabilities, secret leakage, and MCP server risks. Before this, security review meant either paying for a tool or doing it manually before every deploy and missing things anyway. Now it''s one command.

### /instinct — the system that learns your codebase

The system observes your successful coding patterns across sessions. When something works — a refactoring approach, a testing pattern, a particular way you structure API responses — it extracts that logic and saves it with a confidence score. Next session, it applies those learned patterns automatically.

The loop is: coding session → pattern extraction → memory storage → applied instinct on the next prompt. You check it with /instinct status. The practical effect is that Claude gets noticeably better at your specific codebase over time. It stops making the suggestions that are technically correct but wrong for how your project is structured.

### Intelligent model routing — 60% cost reduction

Most people use Opus for everything. The repo routes 80% of standard coding tasks to Sonnet automatically, reserving Opus only for deep architecture work that actually needs it.

```
{
  "model": "sonnet",
  "maximum_thinking_tokens": 10000,
  "claude_autoco_compact_percent_override": 50
}
```

60% reduction in API costs for the same output quality on most tasks. If you''re running Claude Code heavily, that adds up fast.

## How to Install It (Two Steps, Under 2 Minutes)

Step 1 — install the plugin:

```
> /plugin marketplace add [Repo URL]
> /plugin install @everything-claude-code
```

This automatically configures hooks, rules, and MCPs. Step 2 — copy the rules. The plugin system can''t distribute rules files automatically, so this part is a manual copy — but it takes about 30 seconds:

```
> git clone [Repo URL]
# Copy common-rules & language rules to your workspace
> /plugin list
```

When that''s done you''ll see: "Everything loaded. 48 agents active. Ready to build." You go from blank slate to fully configured AI dev team in the time it takes to make coffee.

## Things to Know Before You Deploy

A few honest notes the docs call out directly — and I appreciated that they didn''t hide them:

**You need Claude Code CLI v2.1 or newer.** Check your version first and update if needed before installing.

**Multi-agent commands like /multiplan need an extra runtime install:**

```
npx cg workflow
```

Without this, those commands won''t execute properly.

**Keep active MCP servers under 10.** If you exceed 10 active MCP servers, you eat up 60% of your context window. More MCP servers sounds better until you realize you''re burning your context budget on server overhead instead of actual work.

**It''s community maintained.** Not an official Anthropic product. If something breaks, file a GitHub issue — not a support ticket with Anthropic. The community is active and issues get resolved, but set your expectations correctly. This is open source, not enterprise software.

## The Full Stack, At No Cost

When it''s all set up, here''s what you''re running:

- 48 specialized agents
- 182 dev skills
- 68 pre-configured commands
- 1,282 security tests
- Cross-platform engine (Cursor, Open Code, CLI)

Total cost: $0.00, open source forever. The framing that stuck with me: it''s like hiring a senior developer team that never sleeps. Planners, reviewers, auditors, fixers — all running off one repo you cloned for free. That''s not hype; that''s just what 48 pre-built specialized agents actually delivers when you wire them up correctly.

## One More Thing

If you want to run this entirely for free — no Claude API costs at all — there''s a separate configuration guide for running it on Gemini via Google''s free cloud tier. It''s a bonus option for anyone who wants a zero-cost setup end to end. Worth knowing that option exists if you''re experimenting before committing to production.

## The Bottom Line

Claude Code out of the box is a starting point, not a finished tool. The gap between what it ships with and what it''s capable of is real, and filling that gap used to take weeks of manual setup work. everything-claude-code closes that gap in 120 seconds. Free. Open source. 140,000 developers have already starred it for a reason. Start there — you''ll wonder what you were doing before.

If this saved you some setup time, share it with one developer on your team who''s just getting started with Claude Code. Pay it forward.

— Nitin Gavhane',
  'everything-claude-code turns vanilla Claude Code into a fully configured AI dev team — 48 agents, 182 skills, 68 commands, built-in security auditing, and 60% model-routing savings — in about two minutes.',
  'AI',
  '',
  '9 min read',
  true,
  '2026-07-05T00:00:00.000Z',
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title      = EXCLUDED.title,
  content    = EXCLUDED.content,
  excerpt    = EXCLUDED.excerpt,
  category   = EXCLUDED.category,
  image_url  = EXCLUDED.image_url,
  read_time  = EXCLUDED.read_time,
  published  = EXCLUDED.published,
  updated_at = NOW();

INSERT INTO blog_posts (title, slug, content, excerpt, category, image_url, read_time, published, created_at, updated_at)
VALUES (
  '7 GitHub Repos That Make Claude Code 10x Better',
  '7-github-repos-make-claude-code-better',
  'Hi everyone, I am Nitin Gavhane and in this blog I want to walk you through a handful of GitHub repos I''ve been poking around in lately, ones that genuinely make Claude more useful day to day. Not a list copy-pasted from somewhere. These are repos I''ve opened, read, and in most cases actually tried.

If you''ve used Claude or Claude Code for more than a week, you''ve probably hit the same wall I did. The model is sharp, but it forgets everything between sessions, doesn''t know your project''s quirks, and treats every conversation like day one. Turns out a lot of people have already built fixes for this and put them up on GitHub for free. Here''s what I found worth your time.

### Start with the master list: awesome-claude-code

**Repo:** [github.com/hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)

Before anything else, go look at hesreallyhim/awesome-claude-code. It''s a curated index of slash commands, CLAUDE.md files, hooks, and workflow tools, all in one place. Think of it as the table of contents for this whole ecosystem.

I didn''t install anything from it the first time I visited. I just scrolled to see what categories existed, because half the value here is realizing how much you didn''t know you could customize. Slash commands for git operations, code review templates, project scaffolding scripts — it''s all sitting there, sorted and linked.

### Anthropic''s own examples: claude-cookbooks

**Repo:** [github.com/anthropics/claude-cookbooks](https://github.com/anthropics/claude-cookbooks)

This one''s easy to overlook because it sounds boring, but claude-cookbooks is Anthropic''s official collection of working code examples for the API. Tool use, retrieval, agents, vision, you name it. When I''m not sure how a feature is supposed to be wired up, I check here before I check anywhere else, because the code actually runs as written instead of being a half-finished gist someone abandoned in 2024.

If you''re building anything with the Claude API rather than just chatting in the app, bookmark this one.

### Superpowers: when you want Claude to act like a senior dev

**Repo:** [github.com/obra/superpowers](https://github.com/obra/superpowers)

This is the repo that surprised me the most. Superpowers turns Claude Code into something that follows an actual development process instead of just spitting out a function the moment you ask for one. It enforces a seven-step flow: brainstorm, write a spec, plan, write tests first, build subagents for pieces of the work, review, then finalize.

Sounds heavy for small tasks, and it kind of is. I wouldn''t use it to fix a typo. But for a real feature with edge cases I haven''t thought through yet, having Claude pause and ask "what should this actually do when the input is empty" before writing a line of code has caught bugs I would''ve shipped otherwise.

### Everything Claude Code: the kitchen-sink option

**Repo:** [github.com/affaan-m/ECC](https://github.com/affaan-m/ECC)

If you want one repo with basically everything pre-built, affaan-m/everything-claude-code is that repo. Thirty specialized subagents, over a hundred skills, sixty slash commands, hooks that fire automatically at different points in your workflow. One person built this over months of daily use, and it shows.

My honest advice: don''t install the whole thing on day one. I tried that with a different bundle once and ended up with conflicting hooks fighting each other for twenty minutes before I gave up and started over. Pull in the agents folder first, see what you actually use, then add skills as you hit problems they solve.

### Repomix: the fix for "Claude doesn''t know my codebase"

**Repo:** [github.com/yamadashy/repomix](https://github.com/yamadashy/repomix)

This one solves a really specific annoyance. You''ve got a project with eighty files and you want Claude to understand how they connect, but pasting them in one by one is painful and burns context fast. Repomix packs an entire repository into a single file, formatted so an LLM can read it cleanly.

There''s also a web version at [repomix.com](https://repomix.com) if you don''t want to touch a terminal. Type the repo name, hit pack, done. I''ve used it on a client''s WordPress theme folder just to ask Claude to find CSS conflicts across templates. Worked better than I expected for something that simple.

### Skill Creator: Anthropic''s meta-skill for building skills

Here''s a problem I didn''t know I had until I had it: I built a custom skill, it worked great for a week, then quietly got worse as the underlying model updated, and I had no clean way to tell if it was actually degrading or if I was imagining it. Skill Creator addresses exactly that. It runs in four modes — create, eval, improve, and benchmark — and uses separate agents to run your skill against test prompts, grade the output, compare versions side by side, and suggest fixes based on what it finds.

If you''ve written more than two or three custom skills, this is worth the half hour it takes to set up.

### claude-code-action: bringing Claude into your CI/CD

claude-code-action is Anthropic''s official GitHub Action, and it lets Claude respond to pull requests and issues directly inside your repo. Tag it in a PR comment and ask it to review a change, or have it run automatically on every push. I set this up on a side project mostly out of curiosity and ended up keeping it because catching an obvious null-check miss before I even open the PR myself saves more time than I expected.

### A quick word of caution

None of this is plug-and-play magic. The more skills and hooks you stack, the more chances something quietly contradicts something else, and debugging a misbehaving agent setup is its own kind of frustrating. Add one repo at a time. Use it for a real task before adding the next one. You''ll actually remember what each piece does, instead of ending up with a setup you''re scared to touch.

That''s my list for now. If you''ve found a repo that changed how you use Claude, drop it in the comments — I''m always looking for the next thing to break my setup with.',
  'Seven GitHub repos I actually opened and tried that make Claude Code meaningfully better — from the awesome-claude-code index and Anthropic''s cookbooks to Superpowers, Repomix, and the official GitHub Action.',
  'AI',
  '',
  '7 min read',
  true,
  '2026-07-05T00:00:00.000Z',
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title      = EXCLUDED.title,
  content    = EXCLUDED.content,
  excerpt    = EXCLUDED.excerpt,
  category   = EXCLUDED.category,
  image_url  = EXCLUDED.image_url,
  read_time  = EXCLUDED.read_time,
  published  = EXCLUDED.published,
  updated_at = NOW();

INSERT INTO blog_posts (title, slug, content, excerpt, category, image_url, read_time, published, created_at, updated_at)
VALUES (
  'I Replaced a $497/Month Ad-Spy Tool With 15+ Free AI Tools (Here''s How)',
  'free-ai-tools-replace-ad-spy-tool',
  'Hi everyone, I am Nitin Gavhane and in this blog I want to talk about a tool I stumbled on recently that genuinely surprised me: a free MCP server that connects Claude (or any MCP-compatible AI) straight to the Facebook Ads Library.

If you do any kind of marketing, competitor research, or ad strategy work, stick around, because this one''s actually useful.

**Repo:** [github.com/RamsesAguirre777/facebook-ads-library-mcp](https://github.com/RamsesAguirre777/facebook-ads-library-mcp)

### So what is this thing?

The repo is called facebook-ads-library-mcp, built by a developer named Ramses Aguirre. In plain terms, it''s a bridge between your AI assistant and Facebook''s public Ads Library, the place where anyone can already see which ads a brand is running on Facebook and Instagram.

Normally you''d have to open that library yourself, scroll through ad after ad, and manually piece together what a competitor is doing. This project skips that. You just ask your AI something like "Analyze Nike''s current Facebook advertising strategy" or "Compare ad strategies between Tesla and BMW," and it goes and pulls the actual data for you.

### Why I think this matters

Here''s the thing that got my attention. Most competitor research tools in this space charge real money. The project''s own README points to ScrapeCreators as a comparison, which runs about $497 a month. This one is free and open source, and it comes with over 15 tools instead of the usual handful.

Some of what it can do:

- Search Facebook ads with detailed filters
- Automatically find competitors in your industry
- Spot brands running similar ad strategies to yours
- Break down what''s actually in an ad''s creative (images, copy, structure)
- Predict how an ad might perform, using a simple ML model
- Track a competitor''s page and get alerted when they launch new campaigns
- Export everything as JSON, CSV, or Markdown

I''ll be honest, the "predict ad performance" tool is the one I found myself using the most, mostly because I was curious whether it would actually be right.

### Getting it running

You don''t need to be a developer to set this up, though it helps to be comfortable with a terminal. Here''s the short version.

First, clone the repo and install the dependencies:

```
git clone https://github.com/RamsesAguirre777/facebook-ads-library-mcp.git
cd facebook-ads-library-mcp
pip install -r requirements.txt
```

Next, you need a Facebook access token, since the tool talks to the real Ads Library API. Head to the Facebook Graph API Explorer, generate a token with ads_read permission, and if you want it to last longer than the default hour, extend it to 60 days.

Then you point Claude Desktop (or whatever MCP client you''re using) at the server by adding it to your config file:

```
{
  "mcpServers": {
    "facebook_ads": {
      "command": "python",
      "args": [
        "/path/to/facebook-ads-library-mcp/facebook_ads_mcp_complete.py",
        "--facebook-token", "YOUR_FACEBOOK_ACCESS_TOKEN"
      ]
    }
  }
}
```

Restart Claude Desktop, and that''s it. You should now see it as an available tool.

### What you can actually ask it

This is where it gets fun. Once it''s connected, you can just talk to it in normal sentences:

> Find all fitness app companies advertising on Facebook right now.

> Identify advertising gaps in the fintech industry.

> Estimate Shopify''s monthly Facebook ad spend.

> Monitor Apple for new ad campaigns and alert me if they launch five or more.

I tried a version of that first one for a client in the skincare space, and it pulled up a handful of smaller brands I hadn''t even considered competitors. That alone made it worth setting up.

### A couple of honest caveats

It''s not magic. The performance prediction tool is useful as a rough gut check, not gospel. And since it depends on Facebook''s Graph API, you''re at the mercy of Facebook''s rate limits and whatever changes Meta makes to the API down the line. If you''ve used the Ads Library manually before, you know it can be a little inconsistent about what data it surfaces for older ads.

Also worth knowing: this project runs everything locally and talks directly to Facebook''s API, no third-party servers sitting in between reading your data. If you care about that kind of thing (and you probably should), it''s a point in its favor.

### Should you try it?

If you''re doing any competitor research on Facebook or Instagram ads, and you''re already using Claude or another MCP-based AI tool, I''d say yes, give it a shot. It costs nothing but a bit of setup time, and it turns a task that used to take an hour of manual scrolling into a two-minute conversation.

That''s it for this one. If you end up trying it, I''d genuinely like to know what you find, especially if you spot brands or strategies you weren''t expecting.

Until next time!',
  'A free, open-source MCP server connects Claude straight to the Facebook Ads Library — 15+ tools for competitor ad research that replace a $497/month product. Here''s what it does and how to set it up.',
  'AI',
  '',
  '6 min read',
  true,
  '2026-07-05T00:00:00.000Z',
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title      = EXCLUDED.title,
  content    = EXCLUDED.content,
  excerpt    = EXCLUDED.excerpt,
  category   = EXCLUDED.category,
  image_url  = EXCLUDED.image_url,
  read_time  = EXCLUDED.read_time,
  published  = EXCLUDED.published,
  updated_at = NOW();

INSERT INTO blog_posts (title, slug, content, excerpt, category, image_url, read_time, published, created_at, updated_at)
VALUES (
  'AntiGravity Just Became Unstoppable With OpenCode (Free)',
  'antigravity-opencode-free-ai-coding',
  'Hi everyone. My name is Nitin Gavhane. I''ve been using AntiGravity for a while now — and honestly, I liked it. But there was always this one nagging gap. Every time I wanted AI to actually help with my code — not just autocomplete a line, but understand my whole project — I kept hitting paywalls. Cursor wants $20/month, and Google Antigravity / GitHub Copilot want a subscription too. Even the "free" tools come with limits that kick in exactly when you''re in the middle of something.

Then I found OpenCode. And I want to tell you — it changed the way I work inside AntiGravity completely.

### What Even Is OpenCode?

OpenCode is an open-source, terminal-based AI coding agent. No GUI, no subscription, no locked-in model. You run it from your terminal, point it at your project, and it edits code directly — across multiple files — using whatever AI model you connect to it.

That last part matters more than it sounds. You can plug in Claude, GPT-4, Gemini, or even a local model running through Ollama. Which means if you already have Anthropic API credits, or you''re running a local LLM on your machine, OpenCode costs you exactly nothing extra.

It''s built by a small team and lives on GitHub. The setup takes maybe 10 minutes.

### How OpenCode Plugs Into AntiGravity

```
┌──────────────┐    ┌──────────────────┐    ┌──────────────────────┐
│  Your        │───▶│  OpenCode        │───▶│  AI Model            │
│  AntiGravity │    │  (Terminal Agent)│    │  Claude / GPT / Local│
│  Project     │◀───│                  │◀───│                      │
└──────────────┘    └──────────────────┘    └──────────────────────┘
       │
       ▼
  Edits applied
  directly to files
  (no copy-paste loop)
```

This is the core loop — OpenCode sits between your AntiGravity project and your AI model, reading and writing your files directly instead of just generating text for you to paste.

### Why AntiGravity + OpenCode Is Such a Good Combination

AntiGravity is already a strong environment for building and experimenting with code. But its AI integration, at least until now, mostly relied on what the platform natively offered. When I wanted to refactor something complex or debug across multiple files, I was either copying chunks of code into ChatGPT manually or paying for Cursor.

OpenCode removes that friction.

You open your terminal, run `opencode` inside your AntiGravity project folder, and start talking to it like you''d talk to a senior developer on your team. "Refactor this function," "add error handling here," "explain what this module does" — it responds in context, because it can actually read your files. Not just a snippet you pasted. The whole thing.

That''s a genuinely different experience. I hadn''t realized how much of my time was spent in the copy-paste loop until I stopped doing it.

### The Setup — Honestly Simpler Than I Expected

Here''s how you actually do it:

1. Install OpenCode — `npm install -g opencode-ai` (Node.js required)
2. Set your API key — drop it in the config file, or use Ollama for a fully local setup
3. Navigate into your AntiGravity project folder in the terminal
4. Run `opencode` — and you''re in

The first time it read through my project and summarized what the codebase was doing, I kind of just sat there for a second. It wasn''t guessing. It wasn''t hallucinating a generic project structure. It knew what I had built.

One thing to note: if you use a cloud model like Claude or GPT-4, you''re paying per token on those API calls. It''s usually pennies per session for normal work — but it''s worth knowing it isn''t completely free if you go that route. The truly free path is local models via Ollama, which runs on your own machine.

### OpenCode vs Cursor for AntiGravity Users

```
┌──────────────────────┬──────────────────────┬────────────────────┐
│ Feature              │ OpenCode             │ Cursor             │
├──────────────────────┼──────────────────────┼────────────────────┤
│ Price                │ Free (open source)   │ $20/month          │
│ AI Model Choice      │ Any (Claude, GPT,    │ Mostly Cursor''s    │
│                      │ Gemini, Local)       │ own selection      │
│ Works in Terminal    │ Yes                  │ No (GUI only)      │
│ Multi-file Context   │ Yes                  │ Yes                │
│ AntiGravity Friendly │ Yes (any folder)     │ Separate IDE       │
│ Local Model Support  │ Yes (Ollama)         │ Limited            │
└──────────────────────┴──────────────────────┴────────────────────┘
```

For AntiGravity users who don''t want to leave their existing setup, OpenCode wins on flexibility. Cursor is a full IDE replacement — OpenCode is a tool that fits into whatever you''re already doing.

### What You Can Actually Do With It — Real Use Cases

I don''t want to oversell this. It''s not magic. But here''s what I''ve been doing with it inside AntiGravity that''s saved me real time:

- **Refactoring old scripts** — I had some messy automation scripts that worked but were painful to read. Told OpenCode to clean them up and add inline comments. Done in under a minute.
- **Debugging with context** — Instead of pasting an error into ChatGPT and explaining the whole setup, I just describe the error to OpenCode. It already knows the files. It asks the right follow-up questions.
- **Generating boilerplate** — Tests, configs, repeated patterns. The stuff that''s tedious but necessary. This is where AI coding tools have always been good, and OpenCode is no different.
- **Explaining unfamiliar code** — I inherited some code in a project that I didn''t fully understand. Asked OpenCode to walk me through it. It read the files and explained each part in plain language.

None of these are impossible to do with other tools. They''re just slower and more annoying.

### A Few Honest Caveats

I''ve been pretty positive about this, so let me be fair.

OpenCode is still relatively new. There are rough edges. The documentation could be clearer in places. And if you''re not comfortable in a terminal at all, the learning curve is real — it''s not designed for people who prefer clicking through menus.

Also, local models through Ollama are free but slower and less capable than cloud models. If you want the full quality of something like Claude Sonnet, you''re looking at API costs. Still cheap, but not zero.

And it''s open source, which means support is community-based. You won''t get a help ticket answered by a support team. You''ll be reading GitHub issues.

None of that makes it a bad choice. It just makes it the kind of tool that rewards people who are willing to spend an hour getting comfortable with it.

If you''ve been looking for a way to bring real AI assistance into your AntiGravity workflow without paying $20 a month for a tool that makes you change your whole setup — OpenCode is worth your afternoon. Install it, connect it to whatever model you have access to, and just try it on a real project. The moment it starts editing your files like it actually read them, something clicks. You''ll understand what all the fuss is about.',
  'OpenCode is a free, open-source terminal AI coding agent that plugs any model — Claude, GPT, Gemini, or local Ollama — into your AntiGravity project and edits files directly. Here''s how it works and how to set it up.',
  'Dev',
  '',
  '7 min read',
  true,
  '2026-07-05T00:00:00.000Z',
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title      = EXCLUDED.title,
  content    = EXCLUDED.content,
  excerpt    = EXCLUDED.excerpt,
  category   = EXCLUDED.category,
  image_url  = EXCLUDED.image_url,
  read_time  = EXCLUDED.read_time,
  published  = EXCLUDED.published,
  updated_at = NOW();

INSERT INTO blog_posts (title, slug, content, excerpt, category, image_url, read_time, published, created_at, updated_at)
VALUES (
  '20 Things NotebookLM Can Do That Most People Never Try',
  '20-things-notebooklm-can-do',
  'Hi everyone, I am Nitin Gavhane and in this blog, I''m going to show you how to actually use NotebookLM.

Most people upload a PDF, click summarize, get three bullet points, and close the tab. I did this for months before realizing I was using maybe 10% of what this tool can actually do.

NotebookLM isn''t a summarizer. It''s closer to a research partner that''s read everything you''ve fed it and is waiting for you to ask better questions. The problem is nobody tells you what those questions look like. So here are 20 prompts I''ve actually used, plus some notes on how to get the most out of them.

### 1. The "explain it back to me wrong" check

> Explain this concept back to me the way someone who misunderstood it might. What''s the common misconception?

I stumbled onto this one by accident, and it''s become one of my favorites. Knowing the wrong version of an idea is often what makes the right version click. You read the misconception and think "oh, I see why someone would think that, but actually —" and suddenly you understand the real thing better than you did five minutes ago.

### 2. The skeptic''s pass

> If you were a peer reviewer trying to find flaws in this paper, what would you flag?

We tend to only ask AI to explain things favorably. Flip it. Ask it to find the weak points. You''ll get a much more honest read on how solid an argument actually is, and you''ll stop nodding along to things that don''t actually hold up.

### 3. The "so what" filter

> For each main point, tell me why it matters in practice. If it doesn''t matter, say so.

Not every idea in a source carries the same weight. A plain summary treats them all equally. This prompt forces a ranking, and "if it doesn''t matter, say so" is the important part. It gives the model permission to tell you something isn''t a big deal, which it normally avoids doing.

### 4. Translate for a specific audience

> Rewrite the key findings for a [12-year-old / busy executive / non-native English speaker].

Try the same source with three different audiences and watch the explanation change shape each time. This is genuinely useful if you ever need to explain something to someone else, because you find the version that actually lands before you''re standing in front of them.

### 5. Find the load-bearing assumption

> What''s the one assumption that, if wrong, would break this entire argument?

Every argument leans on something it never quite proves. This prompt goes hunting for it. Often it''s more useful than understanding the argument itself, because it tells you exactly where to push if you want to test whether the whole thing holds up.

### 6. Build a debate prep sheet

> I''m about to discuss this with someone who disagrees. Give me their likely objections and how I''d respond.

I use this before meetings where I know someone''s going to push back. It''s also, frankly, useful before family dinners where a certain topic is guaranteed to come up.

### 7. Spot the outdated parts

> Which claims in this source are most likely to be outdated, and why?

NotebookLM can''t check live facts, but it''s surprisingly good at flagging which kinds of claims age fastest, especially in anything tech-related. Worth running on older sources before you cite them anywhere.

### 8. Turn it into a decision

> Based on this, what should I actually do? Give me options, not just information.

A lot of source material describes a situation without ever telling you what to do about it. This closes that gap. Sometimes the answer is "nothing," which is also useful to know.

### 9. Make a before-vs-after comparison

> How does this source''s view differ from the conventional wisdom on this topic?

This is how I figure out what''s actually new in something versus what''s just the same idea with new packaging. Saves a lot of time on hype-heavy material.

### 10. Generate the questions you should be asking

> What questions should I be asking about this topic that I probably haven''t thought of?

Sometimes the most useful output isn''t an answer at all. It''s a better question you didn''t know to ask.

### 11. The "explain to future me" note

> Write a note to myself in 6 months, reminding me what this was about and why it mattered.

This felt gimmicky the first time I tried it, but it forces a level of compression that sticks. Six months later, that note is genuinely the fastest way back into the material.

### 12. Map the cast of characters

> List every person, organization, or entity mentioned, and explain their role in one sentence each.

Dense reports often have a dozen named players and you lose track of who''s who by page three. This fixes that in one shot.

### 13. The "what would change my mind" prompt

> What evidence, if it existed, would make this argument fall apart?

One of the better ways I''ve found to test whether I actually believe something or just haven''t questioned it yet.

### 14. Build a glossary on the fly

> Pull out every technical term and define it in plain language, ordered by how often each one appears.

The frequency ordering matters more than you''d think. The terms that show up most are the ones worth nailing down first; everything else you can look up as needed.

### 15. Find the contradiction

> Are there any points in this source that seem to contradict each other? Where?

Longer documents, especially anything written by committee, contradict themselves more often than you''d expect. This finds it fast.

### 16. Turn it into a conversation

> Write this as a dialogue between two people with different views, based on the source.

Dialogue makes complex ideas easier to follow than straight exposition, and it''s a fun way to revisit something you''ve already read once.

### 17. The one-slide challenge

> If you could only show one slide to summarize this, what would be on it?

Extreme prioritization. Whatever survives this cut is the actual core of the thing.

### 18. Find the analogy that''s already there

> Is there an analogy or metaphor used in this source? If not, suggest one that fits.

Sometimes the author already had a good explanatory device buried on page 12. Sometimes there isn''t one and you need to build it yourself.

### 19. Build a "what''s missing" list

> What would you expect a source like this to cover that it doesn''t?

Useful for spotting gaps, especially in research papers or reports with a stated scope that quietly narrows as you read.

### 20. Create your own follow-up reading list

> Based on this source, what topics or questions would be worth researching next?

This is how one document turns into a starting point instead of an endpoint. Honestly, it''s the whole game.

## A few things that made a real difference for me

- **Upload more than one source if you can.** NotebookLM''s real strength is working across documents, not within a single one. A lone PDF undersells it.
- **Be specific about format.** "Give me a table" or "five bullet points" gets you something you can actually use. Vague requests get vague answers back.
- **Don''t treat the first response as final.** Push back on it, ask it to go deeper, rewrite it for someone else. The tool is built for back-and-forth, and the first output is rarely the best one.

If you''ve found prompts that work better than these, I''d genuinely like to hear them. Drop them in the comments.',
  'NotebookLM isn''t a summarizer — it''s a research partner waiting for better questions. Here are 20 prompts I actually use, from the skeptic''s pass to the load-bearing-assumption hunt, plus tips to get the most out of each.',
  'AI',
  '',
  '8 min read',
  true,
  '2026-07-05T00:00:00.000Z',
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title      = EXCLUDED.title,
  content    = EXCLUDED.content,
  excerpt    = EXCLUDED.excerpt,
  category   = EXCLUDED.category,
  image_url  = EXCLUDED.image_url,
  read_time  = EXCLUDED.read_time,
  published  = EXCLUDED.published,
  updated_at = NOW();

INSERT INTO blog_posts (title, slug, content, excerpt, category, image_url, read_time, published, created_at, updated_at)
VALUES (
  '7 GitHub Repos That Cut My Scraping Time by 80%',
  '7-github-repos-cut-scraping-time',
  'Hi everyone, I am Nitin Gavhane, and in this blog I want to share a list I''ve been keeping for a while now: GitHub repos for scraping that I actually open and use, not ones I bookmarked once and forgot about.

I put this together because every time someone asks me "what should I use to scrape this site" or "how do I get clean data for my LLM project," I end up sending the same seven links over chat. So here they are in one place, with my honest take on when each one is worth reaching for.

### 1. Firecrawl

**Repo:** [github.com/firecrawl/firecrawl](https://github.com/firecrawl/firecrawl)

If you''re feeding web content to an LLM, this is probably the fastest way to get there. You give it a URL, it hands back clean markdown or structured JSON, and it handles JavaScript-heavy pages without you writing a single line of rendering logic. I use it when I need something working in the next ten minutes and don''t want to think about proxies or headless browsers.

### 2. Crawl4AI

**Repo:** [github.com/unclecode/crawl4ai](https://github.com/unclecode/crawl4ai)

This is the open-source cousin of the LLM-focused scrapers. It''s async, it''s fast, and it gives you a lot of control over how content gets extracted and chunked before it hits your model. I reach for this over Firecrawl when I want to self-host or when the site needs a custom extraction strategy that a hosted API won''t let me tweak.

### 3. Scrapy

**Repo:** [github.com/scrapy/scrapy](https://github.com/scrapy/scrapy)

The old reliable. If you''ve done any scraping in Python, you''ve probably touched Scrapy at some point. It doesn''t render JavaScript out of the box, and the learning curve is steeper than the newer tools, but nothing beats it for crawling thousands of pages on a schedule with proper rate limiting and retry logic already built in.

### 4. browser-use

**Repo:** [github.com/browser-use/browser-use](https://github.com/browser-use/browser-use)

This one is a bit different from the rest. Instead of scraping pages, it lets an AI agent click, type, and navigate a real browser like a person would. I use it for tasks that need actual interaction — filling a form, clicking through a checkout flow, logging in — rather than just pulling text off a page.

### 5. MarkItDown

**Repo:** [github.com/microsoft/markitdown](https://github.com/microsoft/markitdown)

Microsoft''s tool for turning PDFs, Word docs, PowerPoints, and HTML into clean markdown. It''s not really a scraper in the traditional sense, but I include it because half the time the hard part isn''t getting the file, it''s converting whatever format it''s in into something a model can actually read.

### 6. curl-impersonate

**Repo:** [github.com/lwthiker/curl-impersonate](https://github.com/lwthiker/curl-impersonate)

A version of curl built to mimic the TLS and HTTP fingerprints of real browsers like Chrome and Firefox. Regular curl requests get flagged by a lot of anti-bot systems within seconds. This one is the fix when a site keeps blocking you even though your scraping logic is otherwise fine.

### 7. Scrapling

**Repo:** [github.com/D4Vinci/Scrapling](https://github.com/D4Vinci/Scrapling)

A newer Python library that''s built with stealth and speed in mind. What I like about it is the adaptive selectors — if a site changes its layout slightly, it can still find the elements you''re looking for instead of breaking your whole pipeline overnight.

That''s the list. I''ll probably add to this as I find new tools worth trusting. If you''ve been using something I haven''t mentioned here, drop it in the comments — I''m always looking for the next one to add to my toolbox.',
  'Seven scraping GitHub repos I actually use — from Firecrawl and Crawl4AI for LLM-ready data to curl-impersonate for beating anti-bot systems — with honest notes on when to reach for each.',
  'Dev',
  '',
  '5 min read',
  true,
  '2026-07-05T00:00:00.000Z',
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title      = EXCLUDED.title,
  content    = EXCLUDED.content,
  excerpt    = EXCLUDED.excerpt,
  category   = EXCLUDED.category,
  image_url  = EXCLUDED.image_url,
  read_time  = EXCLUDED.read_time,
  published  = EXCLUDED.published,
  updated_at = NOW();

INSERT INTO blog_posts (title, slug, content, excerpt, category, image_url, read_time, published, created_at, updated_at)
VALUES (
  'GLM-5.2 Is Free Right Now, No API Key Needed, and It Surprised Me',
  'glm-5-2-free-open-weight-model',
  'Hi everyone, I am Nitin Gavhane and in this blog I want to walk you through GLM-5.2, the new open-weight model from Z.ai. I''ll keep this simple and practical: what it actually does, a real example I ran myself, and a step-by-step way to try it for free, whether or not you know how to code.

## What GLM-5.2 actually is

Think of GLM-5.2 as a large language model, similar in spirit to GPT-5.5, but **open weight** (meaning anyone can download and run the underlying model) and **MIT licensed** (meaning you can use it commercially without asking permission). It came out on June 13, 2026, from Z.ai, the company also known as Zhipu.

Two numbers matter most if you''re deciding whether to try it:

- **Context window:** about 1 million tokens. That''s the amount of text it can "hold in mind" during one conversation, roughly five times more than the previous GLM version.
- **Cost:** for coding tasks, it runs at roughly one-sixth the price of GPT-5.5 per token.

If you only run a handful of prompts a day, the price gap won''t mean much to you. If you''re running an agent that loops through hundreds of steps, or a team burning through tokens daily, that six-times difference adds up fast.

## A simple way to picture the context window

Imagine handing someone a research folder. With a small context window, you can only hand them a few pages at a time; they forget page one by the time they reach page ten. With something close to a million tokens, you can hand over the whole folder — a mid-sized codebase, a stack of PDFs, a long chat history — and the model keeps track of all of it at once. I''ve had to split documents into chunks for smaller models before, and it''s genuinely tedious. You lose track of what was in chunk 3 versus chunk 7.

## A real example: predicting boiling points

To see how it actually behaves, not just what the spec sheet says, I ran a small chemistry task: predict the boiling points of three pentane isomers — n-pentane, isopentane, and neopentane — and explain why branching in a molecule changes its boiling point.

I ran the same task on GLM-5.2 and on GPT-5.4, using the same prediction tool underneath, so the raw numbers came out the same either way. What differed was how each model handled the job:

- **GLM-5.2 went further than I asked.** It compared its predictions against real experimental data from NIST without being told to, built a comparison chart on its own, and explained the physics: branched molecules are more compact and spherical, which shrinks the surface area available for weak intermolecular forces, and that''s why boiling points drop as branching increases. It did all this in fewer conversation turns and used fewer input tokens than GPT-5.4.
- **GPT-5.4 gave correct numbers** and a short note about branching, and stopped there. No chart, no comparison against real data. Not wrong, just leaner.

I want to be upfront that this is one test, not a broad benchmark. But it matched what I''d read elsewhere about GLM-5.2 being unusually proactive for an open model.

## Where it still falls short

It''s not all upside. On long, multi-step autonomous tasks, GLM-5.2''s scores drop noticeably (13% on the SWE-Marathon benchmark, if you want the specific number). Handing it a week-long autonomous project and walking away isn''t realistic yet. The tooling and community plugins around it are also younger than what exists for GPT-5.5, simply because it''s newer.

## How to actually try GLM-5.2 for free

Here''s the part most people get stuck on. You don''t need an API key, a terminal, or a Z.ai account to try this. Here are four ways, from easiest to most technical.

### Option 1: Browser, no code, no key (what I used)

1. Go to Mira and create a free account.
2. Select GLM-5.2 from the model list.
3. Type your prompt directly in the browser, the way you''d use any chat app.
4. Free credits cover a reasonable amount of testing before you''d need to pay anything.

This is the fastest way to just see what the model can do, and it''s what I used for the pentane test above.

### Option 2: Z.ai''s own trial credits

1. Sign up at Z.ai''s developer platform.
2. Generate an API key from your account dashboard.
3. Z.ai gives new accounts trial credits to test GLM-5.2 through their API.
4. You''ll need a small script (Python or Node both work) to send requests, so this route assumes some coding comfort.

### Option 3: Third-party playgrounds, zero signup

Services like Cloudflare Workers AI host GLM-5.2 and let you test a prompt right on their site with no account at all. Good if you want to kick the tires on one question and leave.

### Option 4: Self-host it (full control, more setup)

If you have GPU hardware, or access to a cloud GPU instance, you can run the model yourself:

1. Go to Hugging Face and find zai-org/GLM-5.2.
2. Download the model weights (this is a large download — budget time and disk space).
3. Install the required libraries in a Python environment:

```
pip install transformers torch accelerate
```

Then load the model in a script:

```
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "zai-org/GLM-5.2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)
```

Run your prompts locally. This route is slower to set up but keeps every bit of data on your own hardware, which matters if you have privacy requirements.

For most people just curious, Option 1 is the least friction. I''d only recommend Option 4 if your team already has GPU infrastructure and a real reason to keep everything in-house.

## So, should you bother?

If your work involves coding or agent-style tasks where token cost adds up, or you regularly need to feed in large documents or codebases in one go, or your team needs to self-host for privacy reasons, GLM-5.2 is worth a real look. If you need the most mature ecosystem with every plugin already built and tested, GPT-5.5 still holds the edge there.

Either way, don''t take my word for it. Sign up on Mira, use the free credits, and run your own test with something you actually care about. That''s the only way to know if it fits what you''re building.

If you try it, I''d genuinely like to know what you ran it on — and whether you saw the same proactive behavior I did, or if my one test just got lucky.',
  'GLM-5.2 is Z.ai''s new open-weight, MIT-licensed model with a ~1M-token context window at roughly one-sixth the cost of GPT-5.5. Here''s a real test I ran, where it still falls short, and four ways to try it for free — no API key required.',
  'AI',
  '',
  '7 min read',
  true,
  '2026-07-04T00:00:00.000Z',
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title      = EXCLUDED.title,
  content    = EXCLUDED.content,
  excerpt    = EXCLUDED.excerpt,
  category   = EXCLUDED.category,
  image_url  = EXCLUDED.image_url,
  read_time  = EXCLUDED.read_time,
  published  = EXCLUDED.published,
  updated_at = NOW();


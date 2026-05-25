# Use Claude Cowork to Find Jobs While You Sleep
### A step-by-step system to automatically search for jobs, evaluate them against your personal criteria, and deliver a ranked shortlist every morning.

Instead of spending hours scrolling LinkedIn, you define what "great" looks like once, and Claude handles the repetitive filtering and research for you.

**What Claude Cowork supports for this workflow:**
- Scheduled recurring tasks (daily, weekday, custom cadence)
- Autonomous web research via connected tools
- File-based project memory (your criteria and rubric persist across sessions)
- Daily ranked shortlists with cover letters

---

## Before You Start

**You'll need:**
- A paid Claude plan (Pro, Max, Team, or Enterprise) — free plans do not support scheduled tasks or MCP connectors
- Claude Desktop installed (macOS or Windows — **Linux is not supported** for scheduled tasks)
- Cowork enabled in Claude Desktop
- Your computer **awake and Claude Desktop open** when scheduled tasks run

> **Important about sleep behavior:** If your computer is asleep or Claude Desktop is closed when a task is scheduled to fire, Cowork will skip that run and execute automatically once your computer wakes up or the app reopens. It does not pause and resume mid-task — it retries at next opportunity. Plan accordingly: leave your machine on overnight, or set your schedule for a time you're likely to be at your desk.

---

## What You're Building

By the end, you'll have:
- A document defining your ideal job
- A scoring rubric for evaluating openings
- Two connected data sources (Indeed for structured job data, Apify for broader web scraping)
- A recurring Cowork task that searches for new openings, scores each one, and delivers a ranked shortlist
- Tailored cover letters for the top 3 roles, ready before you start your day

---

## Step 0 — Install Your Job Search Connectors

This step is missing from most guides but is the most important. Without connectors, Claude is searching the web blindly. With them, it can query live job data directly and structured scraping tools with much higher reliability.

You need two connectors: **Indeed** (native Claude connector, no API key required) and **Apify** (web scraping platform, free tier available).

### Install the Indeed Connector

Indeed has a native Claude connector that lets Claude search job listings, retrieve full job descriptions, access salary data, read employer reviews, and pull your own Indeed profile to personalize results.

1. Go to [claude.com/connectors/indeed](https://claude.com/connectors/indeed) — or open Claude Desktop, go to **Settings → Integrations → Browse Connectors**, and search for "Indeed"
2. Click **Connect**
3. Sign in with your Indeed account when prompted
4. Grant the requested permissions (job search, profile read)
5. Once connected, Claude can call Indeed directly — no copy-pasting job links required

**What the Indeed connector gives you:**
- Live job search by title, keywords, location, employment type
- Full job descriptions with requirements, salary, and benefits
- Company data including employee reviews and culture ratings
- Your Indeed profile data to help Claude personalize scoring

### Install the Apify Connector

Apify is a web scraping and automation platform with thousands of pre-built scrapers. It fills the gaps where Indeed doesn't reach: company career pages, Wellfound (AngelList), Greenhouse, Lever, and general web research on companies.

There are three ways to connect Apify. Start with Method 1 — it's the simplest and doesn't require an API key.

---

**Method 1: Remote server via OAuth — Recommended (no API key needed)**

1. Create a free account at [apify.com](https://apify.com)
2. Open **Claude Desktop**
3. Go to **Settings → Integrations** (may appear as "Customize" depending on your version)
4. Click **Add custom connector** or **Add MCP Server**
5. Enter this URL: `https://mcp.apify.com`
6. Your browser will open automatically — sign in to Apify and authorize the connection
7. Fully quit and reopen Claude Desktop (don't just close the window)
8. Test by asking Claude: *"Search for web scraping Actors on Apify"*

No API token needed. OAuth handles authentication securely.

---

**Method 2: One-click from the connector directory**

1. Open **Claude Desktop**
2. Go to **Settings → Integrations**
3. Search for **"Apify"** in the connector directory
4. Click **Install**
5. Fully quit and reopen Claude Desktop

Alternatively, download the [Apify MCP .mcpb file](https://github.com/apify/actors-mcp-server/releases/latest/download/apify-mcp-server.mcpb) and open it — it registers the connector automatically without manual config.

> If you see an "Unable to connect to extension server" error with this method, switch to Method 1 — the remote server is more reliable.

---

**Method 3: Manual setup with API token (advanced users only)**

Use this only if Methods 1 and 2 don't work for you. Requires Node.js v18+ installed on your machine.

1. Create a free account at [apify.com](https://apify.com)
2. In the Apify Console, go to **Settings → Integrations → API tokens**
3. Copy your API token
4. Open your Claude Desktop config file:
   - Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
5. Add the following block under `mcpServers` (replace the token with yours):

```json
"apify": {
  "command": "npx",
  "args": [
    "-y",
    "@apify/actors-mcp-server",
    "--actors",
    "apify/google-search-scraper,apify/website-content-crawler"
  ],
  "env": {
    "APIFY_TOKEN": "your_token_here"
  }
}
```

6. Fully quit and reopen Claude Desktop

> The `--actors` list controls which scrapers Claude can access. Start with 1–2; adding too many inflates context and slows down tool selection.

**Useful Apify Actors for job searching:**
- `apify/linkedin-jobs-scraper` — LinkedIn job listings (note: LinkedIn actively rate-limits scrapers; results may be partial)
- `curious_coder/indeed-scraper` — Indeed listings as a fallback
- `apify/google-search-scraper` — Google search results for job postings
- `apify/web-scraper` — General-purpose scraper for company career pages

> **Note on LinkedIn:** LinkedIn aggressively blocks automated access. Direct scraping is unreliable and may violate LinkedIn's Terms of Service. For LinkedIn job data, manually review LinkedIn separately, or use it only as a supplemental source. The Indeed connector and Apify's career page scrapers are more reliable primary sources.

---

## Step 1 — Define Your Ideal Role

**Goal:** Create a "job criteria" document Claude will use as a source of truth when evaluating openings. Most people skip this and end up applying to roles that don't actually fit their goals.

**Open a new Cowork session and paste this prompt:**

```
Interview me to define my ideal next role.
Ask me one question at a time and wait for my answer before continuing.

Cover:
- Target title and level (e.g., Principal PM, Staff PM, Director)
- Compensation expectations (base, equity, total comp)
- Preferred industries and sectors
- Company size and stage (seed, Series B, public, enterprise)
- Remote vs hybrid vs onsite preference
- Location constraints or visa/work authorization requirements
- Culture preferences (ownership, pace, politics, product-led vs sales-led)
- Team structure and management expectations
- Technical interests (AI/ML, consumer, infrastructure, etc.)
- Career growth goals (IC track vs management)
- Work-life balance priorities
- Deal-breakers (things that would disqualify a role outright)
- Long-term goals (3–5 year horizon)

After all questions are complete, compile everything into a structured markdown document.
```

**Tips while answering:**

Be specific. Vague answers produce vague rankings.

| Weak | Strong |
|------|--------|
| I want a good salary | Targeting $180k–$230k base plus equity |
| I want a strong culture | High ownership, low politics, fast execution, strong product thinking |
| I like AI | I want to be the PM for a core AI/ML product, not an AI-adjacent role |

**Save the output:**
Once Claude finishes, ask it to generate a final file and save it as `job-criteria.md` in your Job Search project folder.

---

## Step 2 — Create a Scoring Rubric

**Goal:** Turn your preferences into an objective scoring system Claude can apply consistently across every role it finds.

**Paste this prompt:**

```
Using my job criteria document, create a weighted scoring framework for evaluating job opportunities.

Requirements:
- Total score should equal 100 points
- Use weighted categories based on what matters most to me
- Include both positive signals and automatic disqualifiers
- Penalize deal-breakers with a score of 0 regardless of other factors
- Include clear scoring logic for each category (not just a number)
- Weight long-term career growth, compensation, and role quality most heavily

Output the result as a markdown table with an explanation of the scoring logic beneath it.
```

**Example categories Claude will typically generate:**

| Category | Weight | What it measures |
|----------|--------|-----------------|
| Compensation | 25 | Base, equity, total comp alignment |
| Growth potential | 20 | Trajectory, scope expansion, title |
| Product/technical interest | 15 | Domain alignment with your stated interests |
| Culture fit | 15 | Ownership, pace, politics signals |
| Company quality | 10 | Stage, funding, leadership, reputation |
| Flexibility | 10 | Remote/hybrid alignment |
| Stability | 5 | Runway, profitability, team stability |

Save this as `job-scoring-rubric.md` in your project folder.

---

## Step 3 — Set Up Your Cowork Project

**Goal:** Give Cowork a persistent workspace so your criteria and rubric survive between sessions.

1. In Claude Desktop, create a new project or folder named **Job Search Automation** (or similar)
2. Add these files to the project:
   - `job-criteria.md`
   - `job-scoring-rubric.md`
3. Make sure your Indeed and Apify connectors are active (visible in the integrations panel)

These files become the permanent reference Claude pulls from during every scheduled run.

---

## Step 4 — Build the Automated Search Prompt

This is the core prompt that will run every morning. Paste it into your Cowork project session and refine it until you're happy with the output before scheduling it.

```
You have access to the Indeed connector and Apify scraping tools.

Search for new product management job openings that match my criteria in job-criteria.md.

Sources to use:
1. Indeed connector — search for [your target title] roles with relevant keywords
2. Apify web scraper — search Wellfound (wellfound.com/jobs), Greenhouse-hosted job boards, 
   and Lever-hosted job boards for matching roles
3. Target company career pages (list any specific companies you're watching)

For each role found:

1. Extract: company name, role title, location, compensation (if listed), date posted, 
   application URL
2. Score the role using my scoring rubric (job-scoring-rubric.md) — show the breakdown 
   by category, not just a final number
3. Flag any deal-breakers that disqualify the role immediately
4. Note any signals about company culture, product direction, or leadership quality 
   found via Apify web research

Output format:
- Ranked list from highest to lowest score
- For each role: company, title, location, salary if available, date posted, 
  score breakdown, brief reasoning, application link
- Exclude roles posted more than 14 days ago
- Exclude roles you've surfaced in the past 7 days (check prior outputs)

After the ranked list, draft tailored cover letters for the top 3 roles:
- Reference specific details about the company's product, mission, or recent news
- Connect my actual experience (from job-criteria.md) to the role's specific requirements
- Do not use generic AI phrasing — write as if a thoughtful human drafted this
- Keep each letter under 350 words
- Format each cover letter as a separate section in markdown
```

**Test this manually first.** Run it once in a regular Cowork session and review the output. Adjust the prompt until the results feel right before setting it to run automatically.

---

## Step 5 — Schedule It

**Goal:** Run the workflow automatically every morning without any manual trigger.

**To create a scheduled task in Cowork:**

1. Open your Job Search Automation project in Claude Desktop
2. Type `/schedule` in the chat input, or click **"Scheduled"** in the left sidebar
3. Click **Create new scheduled task**
4. Paste your automation prompt from Step 4
5. Set your desired schedule

**Recommended schedules:**

| Schedule | Best for |
|----------|----------|
| Every weekday at 7:00 AM | Active job search, checking before work |
| Every day at 6:30 AM | Competitive markets, AI/startup roles |
| Every Sunday evening | Weekly batch review instead of daily |

**Why daily matters for senior roles:** Strong Principal PM and Director-level openings at AI companies often receive hundreds of applicants within 24–48 hours of posting. Checking weekly means you're already late to most strong opportunities.

**Reminder:** Your computer must be awake and Claude Desktop must be open for the scheduled task to run. If it's not, the task will run the next time you open the app.

---

## Step 6 — Review and Apply Efficiently

Every morning, open the generated shortlist and work through it in priority order.

The shortlist handles the filtering. Your time goes toward:
- Tailoring applications for the highest-scoring roles
- Networking at the companies you're most interested in
- Interview prep once you're moving
- Resume refinement based on patterns in what scores highly

That's where offers happen — not in the searching.

---

## Advanced Setup (Optional)

Once the basic workflow runs reliably, you can extend it with more focused Apify actors:

- Use `apify/linkedin-jobs-scraper` as a supplemental source (treat results as directional, not exhaustive, given LinkedIn's restrictions)
- Use `apify/web-scraper` to pull recent news about target companies before your interviews
- Add a second scheduled task on Friday afternoon that aggregates the week's shortlist into a single ranked file for weekend review
- Ask Claude to draft personalized outreach messages for first-degree LinkedIn connections at your top companies

---

## Known Limitations

| Limitation | What it means |
|------------|---------------|
| Requires computer to be awake | Tasks won't run if your machine is asleep or app is closed |
| macOS and Windows only | Scheduled tasks are not available on Linux |
| LinkedIn scraping is unreliable | LinkedIn actively blocks scrapers; use Indeed connector as primary source |
| Salary data is often missing | Many job postings don't include compensation; gaps are normal |
| Duplicate filtering is best-effort | Claude may occasionally resurface older roles; manually flag them |

---

## What This Actually Changes

The biggest advantage isn't "AI applies to jobs for me."

The real shift is better filtering, faster discovery, and less decision fatigue. Most people waste energy searching. The strongest candidates spend their energy building relationships, tailoring their story, and moving quickly on the right opportunities.

This system handles the first part so you can focus on the second.

---

*Sources: [Apify MCP Documentation](https://docs.apify.com/platform/integrations/mcp) · [Indeed MCP Connector](https://claude.com/connectors/indeed) · [Cowork Scheduled Tasks](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork)*

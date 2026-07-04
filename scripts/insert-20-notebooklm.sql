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

# GTM Playbook — GOLM Lead-Gen Funnel

Converts `traffic-strategy.md` into executable assets. Organic-first. UTM-tagged
throughout so the funnel's intent-band data tells you what actually works.

---

## A. Spreadsheet-Cost Calculator — Lead Magnet Spec

**Purpose:** The highest-performing B2B interactive lead magnet — gives a named dollar
figure, creates concrete ROI context before the quiz, and hands off directly to the
readiness assessment as the natural "now find out if a custom build is worth it" step.

**Build scope:** a single self-contained page (or embedded widget), not the 3-page funnel.
Could live at `/tools/ops-cost-calculator` or as a standalone campaign page. Out of v1
funnel scope — build as a follow-on asset (or fold a lightweight version into the funnel
landing as a secondary hook). See traffic-strategy.md Open Questions §5.

---

### Inputs (form fields)

| Field | Label | Type | Notes |
|---|---|---|---|
| 1 | Hours per week spent on manual/admin ops tasks | Number | Stepper or slider; range 1–60 |
| 2 | Approximate hourly value of your time (or your team's) | Number | $ input; default suggestion: $50/hr for owner |
| 3 | How often do errors or rework happen? | Select | Daily / A few times a week / A few times a month / Rarely |
| 4 | Average time to fix one error (hours) | Number | Stepper; range 0.5–8 |
| 5 | Number of people whose work touches this workflow | Number | Range 1–50 |

**Optional / enhancing:**
- Business revenue bracket (helps contextualize output as % of revenue) — `< $500K / $500K–$2M / $2M–$10M / $10M+`
- Primary pain area (free-select): `Quoting & estimating / Job or project tracking / Scheduling & dispatch / Compliance & documentation / Reporting & billing`

---

### Calculation formula

**Annual ops waste estimate:**

```
manual_hours_cost  = (hours_per_week × hourly_value × 52)
error_cost         = (errors_per_year × avg_fix_hours × hourly_value × staff_count)
total_annual_waste = manual_hours_cost + error_cost
```

Where:
- `errors_per_year` derived from frequency selection: Daily=250, Weekly=52×3=156, Monthly=12×3=36, Rarely=12
- `staff_count` = the "people touching this workflow" input

**Scale / sanity note:** cap display at a credible ceiling (~$500K/yr) so it doesn't
produce absurd numbers for large teams. Show the formula in a "how we calculated this"
accordion beneath the result — transparency builds trust and is a good teaching beat for
the stream.

---

### Output screen

**Headline:** `Your operation is losing an estimated $[TOTAL] per year.`

**Sub-line:** `That's [MANUAL_HOURS_COST]/yr in manual labour + [ERROR_COST]/yr in
errors and rework — before accounting for missed growth or opportunities you didn't take
on because the ops couldn't handle them.`

**Visual:** simple bar chart or two-tile split (manual cost vs. error cost). Keep it
clean — one chart, no dashboard.

**Handoff CTA:**

> `Now find out if a custom build would pay for itself.`
> `[Get your Custom Software Readiness Score — 2 min →]`

Link to `/assessment` with UTMs: `utm_source=calculator&utm_medium=tool&utm_campaign=ops-cost-calc`

**Optional email capture on the output screen:** "Save this estimate to your inbox"
(lightweight, no quiz score attached). Keep separate from the quiz email capture so it
doesn't feel like a second gate — make it truly optional. Feed into the same Resend
audience if implemented.

---

### UTM on the calculator CTA

All traffic from the calculator into the funnel should carry:
- `utm_source=calculator`
- `utm_medium=tool`
- `utm_campaign=ops-cost-calc`

This lets you query `leads` by `utm_source='calculator'` and see its Hot-lead yield vs.
direct traffic.

---

## B. Two-Week LinkedIn Founder Cadence

**Account:** Dave's personal profile (D-011 in spirit: personal profile outperforms
company page 5:1 on reach for founders). Post 3×/week minimum; 5×/week if sustainable.

**Goal for the two weeks:** establish the "niche ops software" positioning, introduce
the quiz, and generate the first wave of qualified traffic. Everything gets UTM-tagged.

---

### Week 1 — Establish positioning + the problem

**Mon — Text post: The frustration frame**

*Format:* 200–400 word personal story. No header image needed.

*Angle:* "I've talked to dozens of [niche business] owners who are running their
entire operation in a spreadsheet they've been patching for six years. Not because they
haven't tried something better — because nothing fits. Here's what that actually costs
them."

*Hook line:* Start with a specific, concrete detail. Not "many businesses struggle with
software." More like: "The spreadsheet had 14 tabs, three of which only one person
understood. That person had left."

*Close:* "Most of these businesses don't need enterprise software. They need *their*
software. Link to the readiness quiz in first comment."

*UTM:* `utm_source=linkedin&utm_medium=organic&utm_campaign=positioning-launch`

---

**Wed — Carousel: "5 signs your operations software is holding you back"**

*Format:* 5–7 slide carousel. Cover slide + one point per slide + CTA slide.

*Slides:*
1. Cover: `Is your software working for your business — or are you working around it?`
2. `You've built a workaround for the workaround.` (The duct-tape stack story)
3. `Adding one client adds two admin tasks.` (The "it doesn't scale" sign)
4. `The person who knows the system is the system.` (Key-person dependency)
5. `You've looked at off-the-shelf options and they all do 60% of what you need.` (The niche fit gap)
6. `The fix isn't another tool. It's one that actually fits.` (The GOLM angle)
7. CTA slide: `Find out where you stand. Free readiness score — 2 min. [Link]`

*UTM:* `utm_source=linkedin&utm_medium=organic&utm_campaign=5-signs-carousel`

---

**Fri — Behind-the-scenes: building the quiz**

*Format:* short text post + optional screenshot or short clip.

*Angle:* Founder transparency. "I'm building a Custom Software Readiness quiz — a
scored assessment that tells a niche business owner whether a custom build is actually
worth it for them right now, without a sales call. Here's why I built it that way and
what I've learned about what business owners actually want to know."

*Goal:* introduce the tool authentically, create anticipation, invite replies.

*UTM:* `utm_source=linkedin&utm_medium=organic&utm_campaign=quiz-build-bts`

---

### Week 2 — Live stream teardown + repurpose

**Mon — Live stream: Spreadsheet teardown**

*Format:* 45–60 min live on LinkedIn (or record for LinkedIn Video if live isn't feasible).

*Title:* `Live: I'm tearing down a real ops spreadsheet — and showing what a
fit-for-purpose system would look like`

*Structure:*
- (0–5 min) Context: why niche businesses end up here
- (5–25 min) Walk through an anonymized real spreadsheet (or a realistic composite).
  Name the pain points specifically: "this tab gets updated by hand three times a day,"
  "this formula is one wrong paste from breaking everything," "this row represents
  $15K of work with no audit trail."
- (25–45 min) Sketch what a custom system would replace: what stays, what goes,
  what gets automated. Don't hard-sell — show the thinking.
- (45–60 min) Q&A. Answer everything. This is the trust builder.

*Close:* "If this resonated, take the two-minute readiness quiz. Link in the comments."

*UTM on the quiz link posted in stream comments:*
`utm_source=linkedin&utm_medium=livestream&utm_campaign=spreadsheet-teardown`

*Recording:* make the recording available as a LinkedIn video post immediately after.

---

**Wed — Carousel: Stream repurpose**

*Format:* 5–8 slide carousel, "5 things we found in the spreadsheet teardown."

*Source material:* the most quotable or surprising moments from the live stream.

*Objective:* reach the people who didn't catch the live. Drives back to the recording
and the quiz.

*UTM:* `utm_source=linkedin&utm_medium=organic&utm_campaign=teardown-repurpose`

---

**Fri — Written takeaway post**

*Format:* 300–500 word narrative summary of the stream's key insight. One concrete
takeaway framed as a principle ("The sign it's time for custom software isn't the
number of tools you use — it's the number of workarounds you've accepted as normal").

*Close:* quiz CTA with link.

*UTM:* `utm_source=linkedin&utm_medium=organic&utm_campaign=teardown-takeaway`

---

### Repurpose flow summary

```
Live stream (Mon)
    → LinkedIn Video recording (same day)
    → Carousel of highlights (Wed)
    → Written takeaway (Fri)
    → Short clips (30–60s) → post individually over following 2 weeks
    → Transcript → raw material for blog/SEO post
```

**Short clip extraction:** identify 3–5 moments from the stream where a specific,
surprising, or quotable insight lands. Each clip = standalone LinkedIn video post
(no context needed). Caption on-screen. Post across 2–3 weeks to extend reach.

---

## C. SEO Content Cluster

**Positioning angle:** "Off-the-shelf didn't fit us" — own this framing before anyone
else does. Target problem-aware long-tail searches where a new domain can rank, not
"best [niche] software" listicles already owned by review sites.

**Two-tier strategy from traffic-strategy.md:**
- **Tier A (Searchable trades):** SEO works. Job shops, septic haulers, similar. These
  owners Google their pain.
- **Tier B (Low search, high value):** Community + outbound first. SEO is secondary
  — but pillar content still helps with credibility when they do land.

---

### Pillar page

**Title:** `When Off-the-Shelf Software Doesn't Fit Your Business`

**URL slug:** `/blog/when-off-the-shelf-software-doesnt-fit`

**Target keyword cluster:** "custom software for small business," "when to build custom
software," "off-the-shelf software alternatives," "spreadsheet replacement operations"

**Estimated word count:** 2,500–3,500 words. Comprehensive, not padded.

**Outline:**
1. The gap nobody talks about: enterprise software is too much, consumer software is too
   little, and "good enough" tools are designed for the median business — not yours
2. Five signs you've outgrown the workaround stack
3. The build-vs-buy framework (specific criteria, not generic advice)
4. What "custom software" actually means at the 2–50 person scale (scope examples,
   realistic cost range, honest tradeoffs)
5. How to know if now is the right time (connects to the quiz)
6. CTA: Take the readiness assessment

**Internal links:** link to all cluster posts below; cluster posts link back to this pillar.

---

### Cluster posts (6–10 long-tail targets)

| # | Title | Target angle | Tier | Approx. search intent |
|---|---|---|---|---|
| 1 | `How to Replace Your Operations Spreadsheet (Without Buying Another SaaS)` | Job shop / general ops | A | Problem-aware, researching options |
| 2 | `Spreadsheet vs. Custom Software: When Does It Make Sense to Upgrade?` | General | A+B | Decision-stage, comparison |
| 3 | `The Hidden Cost of Manual Operations: A Calculator for Niche Business Owners` | General | A | Problem-framing; can link to the calculator asset |
| 4 | `Job Shop Software That Actually Fits: What Small Fabricators Need (and Why ERP Is Overkill)` | Metal fab / job shops | A | High-intent Tier A; "best software for job shops" adjacent but owned angle |
| 5 | `Why Route Management for Septic and Hauling Companies Is Still Stuck in Spreadsheets` | Septic / FOG haulers | A | High-intent Tier A; very low competition |
| 6 | `What Niche Operations Software Looks Like at 5–50 Employees` | General | A+B | Awareness → consideration |
| 7 | `Build vs. Buy Software for Operations: The Decision Framework for Small Business Owners` | General | A+B | High-intent decision stage; pillar support |
| 8 | `Compliance Operations Without Off-the-Shelf Fit: How Niche Service Businesses Handle It` | Tier B (abatement, inspection) | B | Lower search, high credibility value for Tier B outbound |
| 9 | `When to Stop Patching Your Workflow and Commission Custom Software` | General | A+B | Decision-stage; "commission" phrasing differentiates from DIY no-code angle |
| 10 | `How GOLM Approaches Custom Software for Operations: Our Methodology` | Brand / GOLM-specific | A+B | Brand search, credibility; also an objection handler in outbound |

---

### SEO content production notes

- **Prioritise Tier A posts first** (posts 1, 4, 5) — these have actual search volume
  and the fastest path to organic leads.
- Each post should include: a specific, concrete example or scenario (anonymized from
  real conversations or realistic composite); the readiness quiz CTA at mid-post and
  end; links to the pillar and 2–3 related cluster posts.
- **No keyword stuffing.** Write for a business owner who found it via search and should
  feel like it was written specifically for them.
- **Publish cadence:** 2 posts/month is enough to build the cluster; consistency beats
  volume for a new domain.

---

## D. UTM Tagging Cheat-Sheet

Quick reference built on the taxonomy in `traffic-strategy.md §3`. Use this table
consistently across every link placed in the wild so the funnel's channel-scoring works.

**Rule:** if it's a link to the funnel from anywhere outside the site, it gets a UTM.
No UTM = unattributed in the leads table. Unattributed leads can't be scored by channel.

---

### Source × Medium reference

| Source (`utm_source`) | Medium (`utm_medium`) | When to use |
|---|---|---|
| `linkedin` | `organic` | Organic LinkedIn post (personal or company page) |
| `linkedin` | `social` | LinkedIn paid / sponsored content |
| `linkedin` | `livestream` | Comment link dropped in a live stream |
| `reddit` | `community` | Reddit post or comment |
| `facebook` | `community` | Facebook Group post or comment |
| `google` | `cpc` | Google Ads paid click |
| `google` | `organic` | Not used in UTMs (organic Google doesn't carry UTM cleanly — use GSC) |
| `partner` | `referral` | Link from a partner / referral source (bookkeeper, CFO, SaaS, etc.) |
| `outbound` | `email` | Cold or warm outbound email sequence |
| `outbound` | `social` | LinkedIn direct outreach / connection message |
| `youtube` | `organic` | YouTube video description or pinned comment |
| `calculator` | `tool` | Link from the ops-cost calculator to the quiz |
| `email` | `nurture` | Newsletter or follow-up email to an existing list |
| `direct` | — | Don't tag direct; it populates automatically as dark/direct |

---

### Campaign naming convention

**Pattern:** `[vertical]-[angle]` or `[content-type]-[angle]`

**Keep campaign names lowercase, hyphen-delimited, no spaces.**

| Example campaign | Meaning |
|---|---|
| `fabshop-spreadsheet-cost` | Tier A (fabrication) — spreadsheet cost angle |
| `fabshop-build-vs-buy` | Tier A (fabrication) — build/buy decision angle |
| `septic-route-management` | Tier A (septic haulers) — route management pain |
| `diving-compliance` | Tier B (commercial diving) — compliance angle |
| `abatement-outbound` | Tier B (abatement) — outbound sequence |
| `positioning-launch` | General — launch/positioning content |
| `5-signs-carousel` | Content type — 5 signs carousel |
| `teardown-repurpose` | Content type — stream repurpose carousel |
| `spreadsheet-teardown` | Stream event |
| `ops-cost-calc` | Calculator tool → quiz handoff |
| `partner-[name]` | Specific partner referral (replace [name] with a short slug) |

---

### Content parameter (optional)

For posts where you publish the same link multiple times (e.g., the quiz link appears
in both the caption and first comment of a LinkedIn post), use `utm_content` to
distinguish:

- `utm_content=caption` vs `utm_content=comment`
- `utm_content=cta-top` vs `utm_content=cta-bottom` (for pages with two CTA placements)

This is optional but useful for optimizing placement, not just channel.

---

### Full URL example

```
https://[your-domain]/assessment?utm_source=linkedin&utm_medium=organic&utm_campaign=spreadsheet-teardown&utm_content=comment
```

Use a URL shortener (Bitly, Short.io) for stream comments and social posts where long
URLs look messy — but keep the UTMs in the destination URL. Tracking happens on the
funnel side, not in the shortener click count.

---

### How the funnel uses it

The landing page Server Component reads `utm_source`, `utm_medium`, `utm_campaign` from
the query string and carries them through the quiz link to the submit action, which
writes them to the `leads` table (`utm_source`, `utm_medium`, `utm_campaign` columns).

**To see channel performance in Supabase:**
```sql
-- Hot leads by channel
SELECT utm_source, utm_campaign, COUNT(*) as hot_leads
FROM leads
WHERE intent_band = 'hot'
GROUP BY utm_source, utm_campaign
ORDER BY hot_leads DESC;
```

```sql
-- Conversion rate by source (Hot leads / total leads)
SELECT utm_source,
       COUNT(*) as total_leads,
       SUM(CASE WHEN intent_band = 'hot' THEN 1 ELSE 0 END) as hot_leads,
       ROUND(100.0 * SUM(CASE WHEN intent_band = 'hot' THEN 1 ELSE 0 END) / COUNT(*), 1) as hot_pct
FROM leads
GROUP BY utm_source
ORDER BY hot_pct DESC;
```

```sql
-- Hero variant performance (A/B/C test, stored in answers JSONB)
SELECT answers->>'variant' as variant,
       COUNT(*) as total,
       SUM(CASE WHEN intent_band = 'hot' THEN 1 ELSE 0 END) as hot_count
FROM leads
WHERE answers->>'variant' IS NOT NULL
GROUP BY variant
ORDER BY hot_count DESC;
```

---

## Open questions for Dave

1. **Calculator scope:** build the ops-cost calculator as a standalone `/tools/` page
   now, or fold a lightweight "quick estimate" variant into the landing page to reduce
   bounce? The standalone is cleaner and more shareable; the inline version reduces funnel
   length. Recommend standalone for v1, inline as a landing-page variant later.

2. **LinkedIn stream logistics:** does Dave have equipment/setup for the live spreadsheet
   teardown, or should it be recorded and posted as a video? Live gets better organic
   reach; recorded is lower-risk for first attempt.

3. **SEO domain setup:** new domain vs golm.ca/blog? A subdomain or path on golm.ca
   (once domain is confirmed, see decisions.md Open items) passes the most authority.
   If using a temporary vercel.app domain for v1, hold off on publishing SEO content
   until the real domain is set.

4. **Partner outreach list:** who's already in Dave's network that maps to the
   "bookkeeper / fractional CFO / Zapier freelancer" referral profile? A warm outreach
   to 5–10 known contacts is faster than cold partner acquisition.

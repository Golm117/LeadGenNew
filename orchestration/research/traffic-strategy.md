# Traffic Strategy — GOLM Lead-Gen Funnel

Synthesis of vertical + channel research (2026-05-29). Budget posture: **organic-first**.
On-page copy stays agnostic (D-010); **targeting** is vertical-specific. Everything here
is designed to feed the funnel's UTM channel-scoring (T-160) so Hot-lead yield — not
guesswork — ranks channels and verticals over time.

---

## 1. The core insight: two tiers of verticals, two playbooks

The highest-opportunity niches (worst software fit) are NOT the most searchable. Don't
force one channel across all of them.

**Tier A — Searchable trades (SEO + quiz funnel works).** These owners Google their pain.
- **Custom metal fabrication / make-to-order job shops (5–50 emp)** — too-small-for-ERP, too-complex-for-Excel; quoting + job tracking in spreadsheets.
- **Septic / grease-trap / FOG & portable-sanitation haulers** — route + manifest + tank-history pain; "15+ hrs/week" admin.
- Playbook: SEO content cluster, low-spend Google Ads, quiz as the offer.

**Tier B — High-value, under-tooled, low search volume (community/partnership/outbound).**
- **Commercial diving / rope-access inspection** — dive logs, cert expiries, audit-exposed compliance; near-zero off-the-shelf fit. Go-after score 5.
- **Environmental / asbestos & lead abatement contractors** — NESHAP/EPA/OSHA compliance run on paper + spreadsheets; penalty exposure = clear ROI. Score 5.
- Playbook: trade associations, licensed-contractor lists, niche forums, targeted outbound, partnerships. SEO won't find them.

**Backburner — Specialty-crop / packhouse (FSMA 204).** Real future pain but the mandate
slipped to **July 2028**, so urgency is gone for now.

**Ruled out (incumbent-dominated):** HVAC/plumbing/electrical (ServiceTitan/Jobber),
lawn care (Yardbook/RealGreen), NEMT (RouteGenie), equipment rental (Point of Rental),
freight brokerage (crowded TMS). GOLM would fight incumbents, not spreadsheets.

**Recommended first focus:** run **Tier A (job shops + septic)** through SEO/quiz, and
**Tier B (diving + abatement)** through community/partnership/outbound — in parallel,
each UTM-tagged, and let the funnel tell you which converts to Hot.

---

## 2. Channel plan (organic-first)

**Primary — LinkedIn founder content.** Post from Dave's personal profile (5–7x company-page
reach), 3 quality posts/week, document carousels + 60–90s captioned video. Niche the
positioning hard. **Repurpose every live stream**: one stream → clips + a carousel recap +
a written takeaway. Stream angle that fits the funnel: live "spreadsheet teardown" of a
real (anonymized) ops workflow → show the custom fix.

**Communities (value-first, no spamming).**
- Reddit: r/OwnerOperator, r/Truckers, r/FreightBrokers, r/Logistics, r/supplychain,
  r/operationsmanagement, r/warehousing, r/msp, plus trade subs. Contribute first; link only when asked.
- Facebook Groups: where less-online trades owners are (search "[trade] business owners");
  respect promo-day norms.

**SEO content cluster (compounding).** Target problem-aware long-tail where a new site can
rank ("spreadsheet replacement for [X]", "how to track [jobs] without spreadsheets"). Do
NOT fight "best software for [niche]" listicle SERPs head-on — win the "off-the-shelf
didn't fit us" angle. Lead magnets:
- **Spreadsheet-cost calculator** (top-performing B2B interactive magnet) → outputs a dollar figure → "see your readiness score."
- **Build-vs-buy decision guide** → quiz is the natural "which is right for me?" CTA.
- **Per-vertical guides** ("How small fab shops replace their quoting spreadsheet"), one per Tier-A niche.

**Partnerships / referral.** Bookkeepers / fractional CFOs/COOs (they see the mess first),
Zapier/Make automation freelancers (hand off when no-code hits its ceiling), trade
associations (sponsor/webinar), complementary non-competing SaaS. Play: 2-tier referral
(free quiz-share + kickback on closed builds) + co-branded free ops audit.

**Outbound (Tier B especially).** Small personalized batches (20–30/day) to named
operators in one trade; opener = a specific observation about their tool stack; soft CTA
to the free quiz. Omnichannel (email + LinkedIn touch). Separate warmed sending domain,
SPF/DKIM/DMARC, <0.1% complaints.

**Paid (later, small).** $300–500/mo Google Ads test on the cheapest high-intent terms
("build vs buy software", "spreadsheet replacement software"); lead with the *free quiz*
as the offer, not "book a call". Meta = retargeting quiz visitors + email lookalikes only
(weak B2B cold targeting). Hold LinkedIn paid until deal economics justify ~$4–5K/mo.

---

## 3. Wire it to the funnel (UTM taxonomy)

The funnel already captures UTM + the hero `variant` onto the lead row (T-160). Use a
consistent taxonomy so channel-scoring and per-vertical Hot-yield are queryable:
- `utm_source`: `linkedin` | `reddit` | `facebook` | `google` | `partner` | `outbound` | `youtube`
- `utm_medium`: `organic` | `cpc` | `community` | `referral` | `email` | `social`
- `utm_campaign`: `<vertical>-<angle>`, e.g. `fabshop-spreadsheet-cost`, `septic-build-vs-buy`, `diving-compliance`, `abatement-outbound`
Then sort `leads` by `intent_band='hot'` grouped by source/campaign to see what actually
produces buyers — and by `variant` for copy performance.

## 4. Hero variant × channel hypotheses (to validate via the A/B/C test)
- **Blunt (C)** — likely best in Reddit/trade communities where direct talk lands.
- **Cost-led (B)** — likely best for paid search / outbound (P&L-minded, high intent).
- **Outcome-led (A, control)** — LinkedIn / partnership traffic (warmer, brand-forward).
Don't pre-assign — the test + UTM data confirms or kills each hypothesis.

## 5. Sequencing
**Weeks 1–2:** Dave's LinkedIn cadence + stream repurposing; start contributing in 3–4
Reddit/FB communities; ship the spreadsheet-cost calculator + build-vs-buy post; line up
2–3 referral partners. UTM-tag everything.
**Month 3:** Per-vertical content cluster (Tier A); targeted outbound to Tier B; a small
Google Ads test; reallocate toward whatever produced the cheapest *Hot* leads.

---

## Open questions for Dave
- Do the recommended verticals match GOLM's actual delivery sweet spot / past work? (Picks the first 1–2 to go deep on.)
- Is there existing reach to lean on (email list, past clients, association memberships, an audience from the streams)?
- A spreadsheet-cost calculator is a strong lead magnet but is **out of the current 3-page funnel scope** — build later, or fold a lightweight version into the funnel?

_(Sources captured in the research agent outputs; see notepad for the run.)_
